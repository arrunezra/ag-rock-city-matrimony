<?php
header("Content-Type: application/json");
include 'db_connection.php'; // Your PDO or MySQLi connection

// Get the posted data
$data = json_decode(file_get_contents("php://input"), true);
$userId = $data['user_id'];
$imageId = $data['image_id'];

if (!$userId || !$imageId) {
    echo json_encode(["success" => false, "message" => "Missing data"]);
    exit;
}

try {
    // Start transaction
    $pdo->beginTransaction();

    // 1. Set all images for this user to NOT default (0)
    $stmt1 = $pdo->prepare("UPDATE profile_images SET isDefault = 0 WHERE user_id = ?");
    $stmt1->execute([$userId]);

    // 2. Set the specific selected image to primary (1)
    $stmt2 = $pdo->prepare("UPDATE profile_images SET isDefault = 1 WHERE id = ? AND user_id = ?");
    $stmt2->execute([$imageId, $userId]);

    // Commit the changes
    $pdo->commit();

    echo json_encode([
        "success" => true, 
        "message" => "Primary photo updated successfully"
    ]);

} catch (Exception $e) {
    // If anything goes wrong, undo the changes
    $pdo->rollBack();
    echo json_encode([
        "success" => false, 
        "message" => "Database error: " . $e->getMessage()
    ]);
}
?>