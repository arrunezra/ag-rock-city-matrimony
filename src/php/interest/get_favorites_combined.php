<?php
require_once '../helpers/AuthMiddleware.php';
require_once '../config/database.php';
require_once __DIR__ . '/../error_log_config.php'; 


try {
    $db = Database::getInstance();
    $token = AuthMiddleware::check();
	$my_id =  $token->profile_id ?? $token['profile_id'];
	$type = $_GET['type'] ?? 'liked'; // 'liked' or 'accepted'
	
	
    if ($type === 'accepted') {
        // Matches: Either I sent and they accepted, OR they sent and I accepted
        $sql = "SELECT p.*, 'Accepted' as connection_status, 1 as is_liked_by_me
                FROM interests i
                INNER JOIN V_Profile p ON (i.sender_id = p.profile_id OR i.receiver_id = p.profile_id)
                WHERE (i.sender_id = ? OR i.receiver_id = ?) 
                AND i.status = 'Accepted' 
                AND p.profile_id != ?";
        $params = [$my_id, $my_id, $my_id];
    } else {
        // Shortlisted: Only people I have clicked the Heart icon on
        $sql = "SELECT p.*, i_sent.status AS sent_status, i_received.status AS received_status, 1 as is_liked_by_me
                FROM profile_likes l
                INNER JOIN V_Profile p ON l.profile_id = p.profile_id
                LEFT JOIN interests i_sent ON i_sent.receiver_id = p.profile_id AND i_sent.sender_id = ?
                LEFT JOIN interests i_received ON i_received.sender_id = p.profile_id AND i_received.receiver_id = ?
                WHERE l.sender_id = ?";
        $params = [$my_id, $my_id, $my_id];
    }

    $stmt = $db->prepare($sql);
    $stmt->execute($params);
    echo json_encode(["success" => true, "data" => $stmt->fetchAll(PDO::FETCH_ASSOC)]);
} catch (Exception $e) {
    echo json_encode(["success" => false, "message" => $e->getMessage()]);
}