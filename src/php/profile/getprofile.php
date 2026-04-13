<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
require_once '../helpers/AuthMiddleware.php';
require_once '../config/database.php';
require_once __DIR__ . '/../error_log_config.php'; 


try {
	// Test if logging works immediately 
	$token = AuthMiddleware::check();
	$tRole = $token->role ?? $token['role'];
	$tprofile_id = $token->profile_id ?? $token['profile_id'];
	$gender = $token->gender ?? $token['gender'];

	$db = Database::getInstance();

	// Get POST data
	$input = json_decode(file_get_contents("php://input"), true);

	$limit = 10;
	$page = isset($input['page']) ? (int)$input['page'] : 1;
	$offset = ($page - 1) * $limit;

    $whereClauses[] = "profile_id != ?";
    $params[] = $tprofile_id;

    // 1. Gender Filter
    if (!empty($gender)) {
        $whereClauses[] = "gender != ?";
        $params[] = $gender;
    }
     

    // 2. Member Restrictions
    if (!empty($tRole) && $tRole == 'member') {
         $whereClauses[] = "IsVerified = 1";
         $whereClauses[] = "IsActive = 1";
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
    $countStmt = $db->prepare("SELECT COUNT(*) FROM V_Profile $whereSql");
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
				,work_with_name
                ,company_name
				,file_name 
                ,IsActive
                ,IsVerified
				,is_caste_no_bar
            FROM V_Profile 
            $whereSql 
            ORDER BY updated_at DESC 
            LIMIT $limit OFFSET $offset";
  
  error_log("SQL Query: " . $sql);
error_log("Params: " . print_r($params, true));

 

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