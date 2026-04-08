<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
require_once '../config/database.php';

try {
    $db = Database::getInstance();

    // 1. Get Counts
    $statsSql = "SELECT 
                    SUM(CASE WHEN isActive = 1 THEN 1 ELSE 0 END) as active_count,
                    SUM(CASE WHEN isActive = 0 THEN 1 ELSE 0 END) as inactive_count,
                    SUM(CASE WHEN IsVerified = 1 THEN 1 ELSE 0 END) as verified_count,
                    SUM(CASE WHEN IsVerified = 0 THEN 1 ELSE 0 END) as unverified_count,
                    COUNT(*) as total_count
                 FROM users";
    $statsStmt = $db->query($statsSql);
    $stats = $statsStmt->fetch(PDO::FETCH_ASSOC);

    // 2. Get Last 10 Records
    $recentSql = "SELECT 
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
                        ,file_name
                    FROM V_Profile
				ORDER BY updated_at DESC 
				LIMIT 10";
    $recentStmt = $db->query($recentSql);
    $recent = $recentStmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        "success" => true,
       "data" => [
        "summary" => $stats,
        "profile" => $recent
    ]
    ]);

} catch (PDOException $e) {
    echo json_encode(["success" => false, "message" => $e->getMessage()]);
}