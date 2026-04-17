<?php
require_once '../helpers/AuthMiddleware.php';
require_once '../config/database.php';
require_once __DIR__ . '/../error_log_config.php';

try {
    $token = AuthMiddleware::check();
    $db = Database::getInstance();
    $user = json_decode(file_get_contents("php://input"), true);

    // Secure call to Stored Procedure
    $profile_id = $user['profile_id'] ?? '';
    $mode = $user['role'] ?? 'Profile'; // Fixed: removed extra semicolon
    $view_mode = $user['view_mode'] ?? 'COUNT';
    $filter_by = strtolower($user['filter_by'] ?? '');

    // Calling the SP
    $stmt = $db->prepare("CALL GetProfileDashboardSummary(?, ?, ?, ?)");
    $stmt->execute([$profile_id, $mode, $view_mode, $filter_by]);
    
    if ($view_mode == 'COUNT') {
        $summary = $stmt->fetch(PDO::FETCH_ASSOC);
        
        echo json_encode([
            "success" => true,
            "mode_accessed" => $mode,
            "filter_applied" => $filter_by, // Added for clarity
            "summary" => [
                "requests" => (int)($summary['requests_count'] ?? 0),
                "accepted" => (int)($summary['accepted_count'] ?? 0),
                "likes"    => (int)($summary['likes_count'] ?? 0),
                "views"    => (int)($summary['views_count'] ?? 0)
            ]
        ]);
    } else {
        $summary = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        echo json_encode([
            "success" => true,
            "mode_accessed" => $mode,
            "summary" => [
                "type" => $view_mode,
                "filter" => $filter_by,
                "items" => $summary
            ]
        ]);
    }
    
    // Free the connection for next queries
    $stmt->nextRowset();
    
} catch (Exception $e) {
    http_response_code(500);
    error_log($e->getMessage());
    echo json_encode(["success" => false, "error" => "Internal Server Error"]);
}