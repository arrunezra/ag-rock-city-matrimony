<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET");
require_once __DIR__ . '/../error_log_config.php'; 

require_once '../config/database.php';

try {
    $db = Database::getInstance();
    
    // 1. Validate Input
    $id = $_GET['id'];  
    $action = $_GET['action'] ?? 'view'; 
	
    if (!$id) {
        http_response_code(400);
        echo json_encode(["success" => false, "message" => "Invalid or missing Profile ID"]);
		error_log("Invalid or missing Profile ID");

        exit;
    }

    if ($action === 'edit') {
		    }
		else if ($action === 'view') {
			
		}
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
                        ,address
                        ,city
                        ,city_name
                        ,state
                        ,state_name
                        ,country
                        ,updated_at
                        ,country_name
                        ,religion
                        ,religion_name
                        ,community
                        ,community_name
                        ,sub_community
                        ,sub_community_name
                        ,mother_tongue
                        ,mother_tongues_name
                        ,is_caste_no_bar
                        ,marital_status
                        ,marital_status_name
                        ,family_type
                        ,father_occupation
                        ,father_occupation_name
                        ,mother_occupation
                        ,mother_occupation_name
                        ,noof_sibling
                        ,sister_count
                        ,kids_details
                        ,brother_count
                        ,has_children
                        ,children_count
                        ,aboutus
                        ,hobbies
                        ,hobbies_name
                        ,height
                        ,weight
                        ,blood_group
                        ,qualification
                        ,qualification_name
                        ,college
                        ,income
                        ,income_name
                        ,work_with
                        ,work_with_name
                        ,working_as
                        ,company_name
                        ,others
                    FROM V_Profile 
			    WHERE profile_id = :id 
			    LIMIT 1";
    

     

    $stmt = $db->prepare($sql);
    $stmt->execute(['id' => $id]);
    
    // 3. Use fetch() for a single record
    $profile = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($profile) {
        echo json_encode([
            "success" => true,
            "data" => $profile
        ]);
    } else {
        http_response_code(404);
		    error_log("Profile not found");

        echo json_encode([
            "success" => false, 
            "message" => "Profile not found"
        ]);
    }

} catch (Exception $e) {
    // 4. Log the actual error internally, but show a clean message to the user
    error_log($e->getMessage());
    http_response_code(500);
	
    echo json_encode([
        "success" => false, 
        "message" => "An internal server error occurred"
    ]);
}