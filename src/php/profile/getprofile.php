<?php
header("Content-Type: application/json");
//require_once '../helpers/AuthMiddleware.php';
require_once '../config/database.php';
//AuthMiddleware::check();
require_once __DIR__ . '/../error_log_config.php'; 

// Test if logging works immediately 
 $db = Database::getInstance();

// Get POST data
$input = json_decode(file_get_contents("php://input"), true);

$limit = 10;
$page = isset($input['page']) ? (int)$input['page'] : 1;
$offset = ($page - 1) * $limit;

try {
    $whereClauses = [];
    $params = [];

    // 1. Gender Filter
    if (!empty($input['gender'])) {
        $whereClauses[] = "gender = ?";
        $params[] = $input['gender'];
    }

    // 2. Marital Status Filter
    if (!empty($input['marital_status'])) {
        $whereClauses[] = "marital_status = ?";
        $params[] = $input['marital_status'];
    }

    // 3. Annual Income Filter (Assuming simple "Greater than or equal to")
    if (!empty($input['annual_income'])) {
        $whereClauses[] = "annual_income >= ?";
        $params[] = $input['annual_income'];
    }

    // 4. Age Filter (Calculated from DOB)
    if (!empty($input['min_age']) && !empty($input['max_age'])) {
        $whereClauses[] = "TIMESTAMPDIFF(YEAR, dob, CURDATE()) BETWEEN ? AND ?";
        $params[] = (int)$input['min_age'];
        $params[] = (int)$input['max_age'];
    }

    $whereSql = !empty($whereClauses) ? "WHERE " . implode(" AND ", $whereClauses) : "";

    // Get total count for pagination metadata
    $countStmt = $db->prepare("SELECT COUNT(*) FROM profiles $whereSql");
    $countStmt->execute($params);
    $totalRows = $countStmt->fetchColumn();
    $totalPages = ceil($totalRows / $limit);

    // Fetch paginated and filtered data
    $sql = "SELECT 
				profile_id
                ,userid
                ,first_name
                ,last_name
                ,full_name
                ,dob
                ,age
                ,gender
                ,email
                ,phone
                ,city
                ,city_name
                ,state
                ,state_name
                ,country
                ,updated_at
                ,country_name
                ,religion
                ,community
                ,sub_community
                ,mother_tongue
                ,mother_tongues_name
                ,marital_status
                ,marital_status_name
                ,family_type
                ,father_occupation
                ,mother_occupation
                ,noof_sibling
                ,sister_count
                ,kids_details
                ,brother_count
                ,has_children
                ,children_count
                ,aboutus
                ,hobbies
                ,height
                ,disability
                ,weight
                ,blood_group
                ,qualification
                ,income
                ,work_with
                ,company_name
            FROM V_Profile 
            $whereSql 
            ORDER BY updated_at DESC 
            LIMIT $limit OFFSET $offset";
 
    $stmt = $db->prepare($sql);
    $stmt->execute($params);
    $profiles = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Check if the array is empty
    if (empty($profiles)) {
        echo json_encode([
            "success" => false, // Set to false to trigger error handling on frontend
            "message" => "Record not found",
            "data" => [],
            "totalPages" => 0,
            "currentPage" => $page
        ]);
    } else {
        echo json_encode([
            "success" => true,
            "data" => $profiles,
            "totalPages" => $totalPages,
            "currentPage" => $page
        ]);
    }
} catch (Exception $e) {
    http_response_code(500);
	error_log($e->getMessage());

    echo json_encode(["success" => false, "message" => $e->getMessage()]);
}

?>