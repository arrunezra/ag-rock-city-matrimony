<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, GET"); // Use POST for updates in production

require_once '../config/database.php';

try {
    $db = Database::getInstance();
    
    // 1. Validate Input
    $id = filter_input(INPUT_GET, 'id', FILTER_VALIDATE_INT);
    $action = $_GET['action'] ?? 'status'; // 'verify' or 'status'
    $status = isset($_GET['status']) ? (int)$_GET['status'] : null;

    if (!$id || $status === null) {
        http_response_code(400);
        echo json_encode(["success" => false, "message" => "Missing ID or Status"]);
        exit;
    }

    // 2. Determine which column to update based on action
    // We white-list the column name to prevent SQL injection
    $column = ($action === 'verify') ? 'IsVerified' : 'IsActive';

    // 3. Check if user exists before updating
    $checkSql = "SELECT id FROM users WHERE id = :id LIMIT 1";
    $checkStmt = $db->prepare($checkSql);
    $checkStmt->execute(['id' => $id]);
    
    if ($checkStmt->fetch()) {
        // 4. Perform the Update
        // Note: Column names cannot be bound as parameters, so we use the $column variable set above
        $updateSql = "UPDATE users SET $column = :status WHERE id = :id";
        $updateStmt = $db->prepare($updateSql);
        
        $updateStmt->execute([
            'status' => $status,
            'id' => $id
        ]);

        echo json_encode([
            "success" => true, 
            "message" => "Profile " . ($action === 'verify' ? "Verification" : "Status") . " updated successfully"
        ]); 
    } else {
        http_response_code(404);
        echo json_encode([
            "success" => false, 
            "message" => "User not found"
        ]);
    }

} catch (Exception $e) {
    error_log($e->getMessage());
    http_response_code(500);
    echo json_encode([
        "success" => false, 
        "message" => "Server error: " . $e->getMessage() // Remove $e->getMessage() in production
    ]);
}