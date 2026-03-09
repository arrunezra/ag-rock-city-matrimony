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
		    $sql = "SELECT 
						id
                        ,userid
                        ,first_name
                        ,last_name
                        ,dob
                        ,gender
                        ,email
                        ,phone
                        ,alt_phone
                        ,address
                        ,city
                        ,state
                        ,country
                        ,marital_status
                        ,height
                        ,weight
                        ,boold_group
                        ,health_info
                        ,disability
                        ,religion
                        ,community
                        ,sub_community
                        ,qualification
                        ,college
                        ,income
                        ,work_with
                        ,working_as
                        ,company_name
                        ,profile_pic
                        ,profile_thumb
                        ,has_children
                        ,children_count
                        ,kids_details
                        ,aboutus
                        ,hobbies
                        ,family_type
                        ,father_occupation
                        ,mother_occupation
                        ,Noof_sibling
                        ,sister_count
                        ,brother_count
                        ,created_at
                        ,updated_at
					FROM profiles 
			    WHERE id = :id 
			    LIMIT 1";
		 //echo json_encode(["success" => false, "message" => $sql]);
    //exit;
		}
		else if ($action === 'view') {
			$sql = "SELECT 
						id, userid, 
						first_name, 
						last_name, 
						full_name, 
						dob, 
						gender, 
						religion, 
						community, 
						sub_community, 
						phone, 
						email, 
						alt_phone, 
						address, 
						city, 
						state, 
						country, 
						marital_status, 
						height, 
						qualification, 
						college, 
						income, 
						work_with,
						working_as,
						company_name, 
						profile_pic, 
						profile_thumb, 
						children_count, 
						kids_details,
						family_type,
						father_occupation,
						mother_occupation,
						Noof_sibling,
						sister_count,
						brother_count,
						updated_at, 
						state_name, 
						city_name, 
						IsActive, 
						IsVerified,
						aboutus,
						hobbies
					FROM V_Profile 
			    WHERE id = :id 
			    LIMIT 1";
		}

    

     

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