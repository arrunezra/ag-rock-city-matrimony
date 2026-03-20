<?php
// Include your logging config at the very top!
require_once __DIR__ . '/../error_log_config.php'; 

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
require_once '../config/database.php';

$db = Database::getInstance();

$profile_id = $_GET['profile_id'] ?? '';
$search = $_GET['search'] ?? '';

if (empty($profile_id)) {
    echo json_encode([
        "success" => false,
        "message" => "Profile ID is required",
        "data" => []
    ]);
    exit;
}

try {
    // Prepare the query from the view
    $sql = "SELECT profile_id,
                   min_age,
                   max_age,
                   min_height,
                   max_height,
                   religions,
                   communities,
                   communitiesName,
                   mother_tongues,
                   mother_tonguesName,
                   marital_status,
                   marital_statusName,
                   children,
                   min_income,
                   max_income,
                   education,
                   working_with,
                   country,
                   countryName,
                   state,
                   stateName,
                   city,
                   cityName,
                   created_at,
                   updated_at
            FROM V_partner_preferences
            WHERE state = :statecode";
    
    // Add search condition if provided
    $params = [':profile_id' => $profile_id];
    
    if (!empty($search)) {
        $sql .= " AND (first_name LIKE :search 
                       OR last_name LIKE :search 
                       OR email LIKE :search 
                       OR phone LIKE :search)";
        $params[':search'] = "%$search%";
    }
    
    // Add ordering
    $sql .= " ORDER BY created_at DESC";
    
    // Execute the query
    $stmt = $db->prepare($sql);
    $stmt->execute($params);
    
    $results = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    echo json_encode([
        "success" => true,
        "message" => "Data retrieved successfully",
        "data" => $results,
        "count" => count($results)
    ]);
    
} catch (PDOException $e) {
    // This will now automatically write to your error_logs.txt via bootstrap/config
    error_log("get_partner_preferences Error: " . $e->getMessage()); 
    
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Database error occurred",
        "data" => []
    ]);
}
?>