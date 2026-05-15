<?php
header("Content-Type: application/json");
require_once '../helpers/AuthMiddleware.php';
require_once '../config/database.php';
require_once __DIR__ . '/../error_log_config.php'; 

try {
    // 1. Auth Check
    $token = AuthMiddleware::check();
    $db = Database::getInstance();
    error_log("Incoming Request: " . file_get_contents("php://input"));
    $stmt = $db->prepare("CALL USP_Admin_Dashboard(0)"); // 0 for production
    $stmt->execute();

    // Get the Card & Revenue totals
    $summary = $stmt->fetch(PDO::FETCH_ASSOC);

    // Move to the next result set for the Church List
    $stmt->nextRowset();
    $church_list = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        "success" => false, 
        "summary" => $summary,
        "churches" => $church_list
    ]);

    } catch (Exception $e) {
    error_log($e->getMessage());

    http_response_code(500);
    echo json_encode([
        "success" => false, 
        "message" => $e->getMessage()
    ]);
}

?>