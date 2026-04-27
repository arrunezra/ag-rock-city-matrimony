<?php
header("Content-Type: application/json");
require_once '../helpers/AuthMiddleware.php';
require_once '../config/database.php';
require_once __DIR__ . '/../error_log_config.php'; 

$db = Database::getInstance();
$token = AuthMiddleware::check();

// 1. Get data from TOKEN and $_POST (since it's a file upload)
$profile_id = $token->profile_id ?? $token['profile_id'] ?? $token[0] ?? null;
$userId   = $_POST['userid'] ?? null; 
$fileGuid = $_POST['file_id'] ?? null; // For replacements
$module   = $_POST['module'] ?? null;
$action   = $_POST['action'] ?? null;

// 2. Validation Block
if (!$profile_id || !$userId || !isset($_FILES['file']) || $_FILES['file']['error'] !== UPLOAD_ERR_OK) {
    error_log("Validation Failed - Profile: $profile_id, User: $userId, File status: " . (isset($_FILES['file']) ? $_FILES['file']['error'] : 'Missing'));
    echo json_encode(["success" => false, "message" => "Invalid request details."]);
    exit;
}
  //  error_log("Validation Failed - module: $module );

// 3. File Metadata
$file         = $_FILES['file'];
$originalName = $file['name'];
$fileSize     = $file['size'];
$mimeType     = $file['type'];
$ext          = strtolower(pathinfo($originalName, PATHINFO_EXTENSION));
$tempGuid     = '';

try {
    $db->beginTransaction();

    if ($fileGuid) {
        // --- MODE: REPLACE EXISTING FILE ---
        $stmt = $db->prepare("SELECT file_name FROM file_repo WHERE file_id = ? AND userid = ?");
        $stmt->execute([$fileGuid, $userId]);
        $oldFileName = $stmt->fetchColumn();

        if (!$oldFileName) {
            throw new Exception("File with provided GUID not found.");
        }

        // Delete old file
        $oldPath = '../uploads/dms/' . $oldFileName;
        if (file_exists($oldPath)) unlink($oldPath);

        $storedFileName = $fileGuid . '.' . $ext;
        $tempGuid = $fileGuid;

        $update = $db->prepare("UPDATE file_repo SET 
                                    file_name = ?, original_name = ?, extension = ?, 
                                    file_size = ?, created_at = NOW(), mime_type = ?  
                                WHERE file_id = ? AND userid = ?");
        $update->execute([$storedFileName, $originalName, $ext, $fileSize, $mimeType, $fileGuid, $userId]);

    } else {
        // --- MODE: NEW UPLOAD ---
        $newfileGuid = sprintf('%04x%04x-%04x-%04x-%04x-%04x%04x%04x',
            mt_rand(0, 0xffff), mt_rand(0, 0xffff), mt_rand(0, 0xffff),
            mt_rand(0, 0x0fff) | 0x4000, mt_rand(0, 0x3fff) | 0x8000,
            mt_rand(0, 0xffff), mt_rand(0, 0xffff), mt_rand(0, 0xffff)
        );

        $storedFileName = $newfileGuid . '.' . $ext;
        $tempGuid = $newfileGuid;

        if ($module == "profile") {
            $insert = $db->prepare("INSERT INTO profiles_docs (file_id, profile_id, file_name, original_name, extension, file_size, mime_type) VALUES (?, ?, ?, ?, ?, ?, ?)");
            $insert->execute([$newfileGuid, $profile_id, $storedFileName, $originalName, $ext, $fileSize, $mimeType]);
        } else {
            $insert = $db->prepare("INSERT INTO file_repo (file_id, file_name, original_name, extension, file_size, mime_type, userid) VALUES (?, ?, ?, ?, ?, ?, ?)");
            $insert->execute([$newfileGuid, $storedFileName, $originalName, $ext, $fileSize, $mimeType, $userId]);
        }
    }

    // 4. Save Physical File
    $targetPath = '../uploads/dms/' . $storedFileName;
    if (!move_uploaded_file($file['tmp_name'], $targetPath)) {
        throw new Exception("Failed to save physical file.");
    }

    $db->commit();

    echo json_encode([
        "success" => true,
        "message" => $fileGuid ? "File replaced" : "New file uploaded",
        "data" => [
            "guid" => $tempGuid,
            "file_name" => $storedFileName,
            "original_name" => $originalName
        ]
    ]);

} catch (Exception $e) {
    error_log("Action Error: " . $e->getMessage());
    if ($db->inTransaction()) $db->rollBack();
    echo json_encode(["success" => false, "message" => $e->getMessage()]);
}