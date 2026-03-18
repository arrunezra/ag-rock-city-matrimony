<?php
// Include your logging config at the very top!
 require_once __DIR__ . '/../error_log_config.php'; 

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
require_once '../config/database.php';

$db = Database::getInstance();

$StateCode = $_GET['statecode'] ?? '';
$search = $_GET['search'] ?? '';

if (empty($StateCode)) {
    echo json_encode([
        "success" => false,
        "message" => "State code is required",
        "data" => []
    ]);
    exit;
}

try {
    // 1. Base Query (Removed ORDER BY from here)
    $query = "SELECT 
                m.LookupMasterName, 
                t.LookupKey as 'key', 
                t.LookupValue as 'value', 
                t.LookupParentKey as 'parent'
            FROM t_mas_lookup m
            JOIN t_tran_lookup t ON m.LookupMasterID = t.LookupMasterID
            WHERE 
                m.LookupMasterID IN (11) 
                AND m.IsActive = 1  
                AND t.is_active = 1
                AND t.LookupParentKey = ?";
    
    $params = [$StateCode];

    // 2. Conditional Search
    if (!empty($search)) {
        $query .= " AND t.LookupValue LIKE ?";
        $params[] = "%$search%";
    }

    // 3. Final Ordering and Limit (Appended only once at the end)
    $query .= " ORDER BY t.LookupValue ASC LIMIT 50";

    $stmt = $db->prepare($query);
    $stmt->execute($params);
    
    $cities = $stmt->fetchAll(PDO::FETCH_ASSOC);

    if ($cities) {
        echo json_encode([
            "success" => true,
            "message" => count($cities) . " cities found",
            "data" => $cities
        ]);
    } else {
        echo json_encode([
            "success" => false,
            "message" => "No records found matching your search",
            "data" => []
        ]);
    }

} catch (PDOException $e) {
    // This will now automatically write to your error_logs.txt via bootstrap/config
    error_log("City Fetch Error: " . $e->getMessage()); 
    
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Database error occurred",
        "data" => []
    ]);
}
?>