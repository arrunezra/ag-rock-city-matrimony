<?php
header("Content-Type: application/json");
//require_once '../helpers/AuthMiddleware.php';
require_once '../config/database.php'; 
require_once '../helpers/cammon.php';

//AuthMiddleware::check();
$db = Database::getInstance();
$method = $_SERVER['REQUEST_METHOD'];

try {
    switch ($method) {
        case 'GET':
            handleGetRequest($db);
            break;
        case 'POST':
            handlePostRequest($db);
            break;
        case 'PUT':
            handlePutRequest($db);
            break;
        case 'DELETE':
            handleDeleteRequest($db);
            break;
        default:
            http_response_code(405);
            echo json_encode(["success" => false, "message" => "Method not allowed"]);
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => $e->getMessage()]);
}

function handleGetRequest($db) {

    $action = $_GET['action'] ?? 'list';

    switch ($action) {
        case 'details':
            fetchSingleStaff($db);
            break;
        
        case 'list':
        default:
            fetchStaffList($db);
            break;
    } 
}

function handlePostRequest($db) {
    $input = json_decode(file_get_contents("php://input"), true);
    $action = isset($input['action']) ? $input['action'] : 'add';

    // --- CASE 1: PAGINATED FETCH ---
    if ($action === 'fetch') {
        $churchId = $input['church_Id'];
        $page = isset($input['page']) ? (int)$input['page'] : 1;
        $limit = isset($input['limit']) ? (int)$input['limit'] : 10;
        $offset = ($page - 1) * $limit;
        
        $params = [$churchId];
        $whereClauses = ["church_Id = ?"];

        // 1. Search Filter
        if (!empty($input['search'])) {
            $search = "%" . trim($input['search']) . "%";
            $whereClauses[] = "(firstName LIKE ? OR lastName LIKE ? OR designation LIKE ?)";
            array_push($params, $search, $search, $search);
        }

        // 2. Status Filter
        if (!empty($input['activeStatus'])) {
            $whereClauses[] = "activeStatus = ?";
            $params[] = $input['activeStatus'];
        }

        // 3. Department Filter
        if (!empty($input['designation'])) {
            $whereClauses[] = "designation = ?";
            $params[] = $input['designation'];
        }

        $whereSql = implode(" AND ", $whereClauses);

        // Fetch Count for metadata
        $countStmt = $db->prepare("SELECT COUNT(*) FROM staff_details WHERE $whereSql");
        $countStmt->execute($params);
        $totalRecords = $countStmt->fetchColumn();

        // Fetch Paginated Data
        $sql = "SELECT * FROM staff_details WHERE $whereSql ORDER BY created_at DESC LIMIT $limit OFFSET $offset";
        $stmt = $db->prepare($sql);
        $stmt->execute($params);
        $data = $stmt->fetchAll(PDO::FETCH_ASSOC);

        echo json_encode([
            "success" => true,
            "data" => $data,
            "pagination" => [
                "total_records" => (int)$totalRecords,
                "total_pages" => ceil($totalRecords / $limit)
            ]
        ]);
        return;
    } 
    
    // --- STAFF INSERTION WITH PRE-CHECK ---
  try {
    // 1. First, check if the mobile number already exists in staff_details
    $checkMobile = $db->prepare("SELECT id FROM staff_details WHERE mobileNo = ?");
    $checkMobile->execute([trim($input['mobileNo'])]);

    if ($checkMobile->rowCount() > 0) {
        http_response_code(409); // Conflict
        echo json_encode([
            "success" => false, 
            "message" => "This mobile number is already registered to a staff member."
        ]);
        return;
    }

    // 2. Proceed with checking the 'users' table (Auth table)
    $checkUser = $db->prepare("SELECT id FROM users WHERE phoneNumber = ? OR email = ?");
    $checkUser->execute([trim($input['mobileNo']), trim($input['email'])]);

    if ($checkUser->rowCount() > 0) {
        http_response_code(409);
        echo json_encode([
            "success" => false, 
            "message" => "A user account with this mobile or email already exists."
        ]);
        return;
    }

    // 3. Start Transaction (since we are inserting into two tables)
  
        $db->beginTransaction();
        // Generate Staff ID
        $churchCode = getChurchCode($db, $input['church_Id']);
        $staffId = generateStaffId($db, $churchCode);
        $userid = generateFormattedUserID($db);
        $hashedPassword = password_hash($input['password'], PASSWORD_DEFAULT);
        // 4. Insert into 'users' for Login
        $stmtUser = $db->prepare("INSERT INTO users (userid, phoneNumber, email, PasswordHash, role) VALUES (?, ?, ?, ?, ?)");
        $stmtUser->execute([
            $staffId, 
            trim($input['mobileNo']), 
            trim($input['email']), 
            $hashedPassword, 
            $input['role'] ?? 'staff'
        ]);

        // 5. Insert into 'staff_details' for Profile
        $sqlStaff = "INSERT INTO staff_details 
                    (staff_id,userid, firstName, lastName,   designation, 
                    church_Id, mobileNo, alrenativeMobileNo, address, activeStatus) 
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        
        $stmtStaff = $db->prepare($sqlStaff);
        $stmtStaff->execute([
            $staffId,
            $userid,
            trim($input['firstName']),
            trim($input['lastName']), 
            $input['designation'] ?? null,
            $input['church_id'],
            trim($input['mobileNo']),
            $input['alrenativeMobileNo'] ?? null,
            $input['address'] ?? null,
            $input['activeStatus'] ?? 'Active'
        ]);

        $db->commit();
        echo json_encode(["success" => true, "message" => "Staff created successfully", "staff_id" => $staffId]);
        exit;

    } catch (Exception $e) {
        $db->rollBack();
        http_response_code(500);
        echo json_encode(["success" => false, "message" => "Transaction failed: " . $e->getMessage()]);
    }
}

function handlePutRequest($db) {
    $input = json_decode(file_get_contents("php://input"), true);
    
    if (!isset($input['id']) || !is_numeric($input['id'])) {
        http_response_code(400);
        echo json_encode(["success" => false, "message" => "Valid staff ID is required"]);
        return;
    }
    
    // Check if staff exists
    $checkStmt = $db->prepare("SELECT id FROM staff_details WHERE id = ?");
    $checkStmt->execute([$input['id']]);
    if (!$checkStmt->fetch()) {
        http_response_code(404);
        echo json_encode(["success" => false, "message" => "Staff not found"]);
        return;
    }
    
    $sql = "UPDATE staff_details SET 
            firstName = ?, 
            lastName = ?,   
            role = ?, 
            designation = ?, 
            mobileNo = ?, 
            alrenativeMobileNo = ?, 
            address = ?, 
            activeStatus = ?, 
            updated_at = CURRENT_TIMESTAMP 
            WHERE id = ?";
    
    $stmt = $db->prepare($sql);
    $success = $stmt->execute([
        trim($input['firstName']),
        trim($input['lastName']), 
        isset($input['role']) ? trim($input['role']) : null,
        isset($input['designation']) ? trim($input['designation']) : null,
        isset($input['mobileNo']) ? trim($input['mobileNo']) : null,
        isset($input['alrenativeMobileNo']) ? trim($input['alrenativeMobileNo']) : null,
        isset($input['address']) ? trim($input['address']) : null,
        isset($input['activeStatus']) ? $input['activeStatus'] : 'Active',
        $input['id']
    ]);
    
    if ($success) {
        echo json_encode([
            "success" => true, 
            "message" => "Staff updated successfully"
        ]);
    } else {
        throw new Exception("Failed to update staff");
    }
}

function handleDeleteRequest($db) {
    $input = json_decode(file_get_contents("php://input"), true);
    
    if (!isset($input['id']) || !is_numeric($input['id'])) {
        http_response_code(400);
        echo json_encode(["success" => false, "message" => "Valid staff ID is required"]);
        return;
    }
    
    // Soft delete (recommended)
    $sql = "UPDATE staff_details SET activeStatus = 'Inactive', updated_at = CURRENT_TIMESTAMP WHERE id = ?";
    
    // Or hard delete (uncomment if needed)
    // $sql = "DELETE FROM staff_details WHERE id = ?";
    
    $stmt = $db->prepare($sql);
    $success = $stmt->execute([$input['id']]);
    
    if ($success && $stmt->rowCount() > 0) {
        echo json_encode(["success" => true, "message" => "Staff deleted successfully"]);
    } else {
        http_response_code(404);
        echo json_encode(["success" => false, "message" => "Staff not found or already deleted"]);
    }
}

 function generateStaffId($db, $churchCode = 'STF') {
    $year = date('Y');
    // Ensure church code is uppercase and clean
    $cleanPrefix = strtoupper(trim($churchCode)) . '-' . $year . '-';
    
    // 1. Find the highest current ID for this prefix
    $stmt = $db->prepare("SELECT staff_id FROM staff_details 
                          WHERE staff_id LIKE ? 
                          ORDER BY staff_id DESC LIMIT 1");
    
    // We search for anything starting with CHURCHCODE-2026-
    $stmt->execute([$cleanPrefix . '%']);
    $lastId = $stmt->fetchColumn();
    
    if ($lastId) {
        // 2. Extract the number after the last hyphen
        // Using strrchr or explode is safer if the prefix length varies
        $parts = explode('-', $lastId);
        $lastNumber = intval(end($parts)); 
        
        // 3. Increment and pad with zeros (e.g., 1 -> 002)
        $newNumber = str_pad($lastNumber + 1, 3, '0', STR_PAD_LEFT);
    } else {
        // 4. If no records exist for this year/church, start at 001
        $newNumber = '001';
    }
    
    return $cleanPrefix . $newNumber;
}

function getChurchCode($db, $churchId) {
    // Get church code from churches table
    $stmt = $db->prepare("SELECT church_id FROM church_details WHERE id = ?");
    $stmt->execute([$churchId]);
    $churchCode = $stmt->fetchColumn();
    
    return $churchCode ?: 'AGRC'; // Default to STF if no church code
}

function fetchSingleStaff($db) {
    if (!isset($_GET['id'])) {
        http_response_code(400);
        echo json_encode(["success" => false, "message" => "id is required"]);
        return;
    }

    $sql = "SELECT 
        s.firstName,
        s.lastName,
        ds.LookupValue AS designation,
        s.mobileNo,
        s.alrenativeMobileNo,
        s.address,
        s.activeStatus,
        s.updated_at,
        c.church_name, 
        c.pastor_name, 
        c.address AS church_address,
        st.LookupValue AS state_name, 
        ct.LookupValue AS city_name 
    FROM staff_details s
    LEFT JOIN church_details c ON s.church_id = c.church_id
    LEFT JOIN t_tran_lookup st ON c.state = st.LookupKey AND st.LookupMasterID = 6
    LEFT JOIN t_tran_lookup ct ON c.city = ct.LookupKey AND ct.LookupMasterID = 11
    LEFT JOIN t_tran_lookup ds ON s.designation = ds.LookupKey AND ds.LookupMasterID = 10
    WHERE s.id = ?
    LIMIT 1;";

    $stmt = $db->prepare($sql);
    $stmt->execute([$_GET['id']]);
    $data = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($data) {
        echo json_encode(["success" => true, "data" => $data]);
    } else {
        http_response_code(404);
        echo json_encode(["success" => false, "message" => "Staff not found"]);
    }
}
function fetchStaffList($db) {
    if (!isset($_GET['church_id'])) {
        http_response_code(400);
        echo json_encode(["success" => false, "message" => "church_id parameter is required"]);
        return;
    }
    
    $churchId = filter_var($_GET['church_id'], FILTER_VALIDATE_INT);
    $params = [$churchId];
    $sql = "SELECT * FROM staff_details WHERE church_Id = ?";
    
    if (isset($_GET['search']) && !empty(trim($_GET['search']))) {
        $search = "%" . trim($_GET['search']) . "%";
        $sql .= " AND (firstName LIKE ? OR lastName LIKE ? OR designation LIKE ? OR role LIKE ? OR staff_id LIKE ?)";
        $params = array_merge($params, [$search, $search, $search, $search, $search]);
    }
    
    if (isset($_GET['status']) && in_array($_GET['status'], ['Active', 'Inactive'])) {
        $sql .= " AND activeStatus = ?";
        $params[] = $_GET['status'];
    }
    
    $sql .= " ORDER BY COALESCE(updated_at, created_at) DESC";
    
    $stmt = $db->prepare($sql);
    $stmt->execute($params);
    $data = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    echo json_encode(["success" => true, "data" => $data]);
}
?>