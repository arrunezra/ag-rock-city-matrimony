<?php
header("Content-Type: application/json");
require_once '../helpers/AuthMiddleware.php';
require_once '../config/database.php';
$db = Database::getInstance();

$userId   = $_POST['userid'] ?? null; 
$fileGuid = $_POST['file_id'] ?? null; // Pass this from RN to replace a file

if (!$userId || !isset($_FILES['file']) || $_FILES['file']['error'] !== UPLOAD_ERR_OK) {
    echo json_encode(["success" => false, "message" => "Invalid request details."]);
    exit;
}

$file         = $_FILES['file'];
$originalName = $file['name'];
$fileSize     = $file['size'];
$mimeType     = $file['type'];
$ext          = strtolower(pathinfo($originalName, PATHINFO_EXTENSION));

try {
    $db->beginTransaction();

    if ($fileGuid) {
        // --- MODE: REPLACE EXISTING FILE ---
        // 1. Check if record exists
        $stmt = $db->prepare("SELECT file_name FROM file_repo WHERE file_id = ? AND userid = ?");
        $stmt->execute([$fileGuid, $userId]);
        $oldFileName = $stmt->fetchColumn();

        if (!$oldFileName) {
            throw new Exception("File with provided GUID not found.");
        }

        // 2. Delete the old physical file
        $oldPath = '../uploads/dms/' . $oldFileName;
        if (file_exists($oldPath)) unlink($oldPath);

        // 3. New filename uses the EXISTING GUID
        $storedFileName = $fileGuid . '.' . $ext;

        // 4. Update the existing record
        $update = $db->prepare("UPDATE 
                                    file_repo 
                                SET file_name = ?, 
                                    original_name = ?, 
                                    extension = ?, 
                                    file_size = ?, 
                                    created_at = NOW(), 
                                    file_id = ?, 
                                    mime_type = ?  
                                WHERE file_id = ? and userid = ?");
        $update->execute([$storedFileName, $originalName, $ext, $fileSize, $fileGuid,$mimeType, $userId]);

    } else {
        // --- MODE: NEW UPLOAD ---
        // 1. Generate NEW GUID
        $fileGuid = sprintf('%04x%04x-%04x-%04x-%04x-%04x%04x%04x',
            mt_rand(0, 0xffff), mt_rand(0, 0xffff), mt_rand(0, 0xffff),
            mt_rand(0, 0x0fff) | 0x4000, mt_rand(0, 0x3fff) | 0x8000,
            mt_rand(0, 0xffff), mt_rand(0, 0xffff), mt_rand(0, 0xffff)
        );

        $storedFileName = $fileGuid . '.' . $ext;

        // 2. Insert new record
        $insert = $db->prepare("INSERT INTO file_repo (file_id, file_name, original_name, extension, file_size, mime_type,userid) VALUES (?, ?, ?, ?, ?, ?, ?)");
        $insert->execute([$fileGuid, $storedFileName, $originalName, $ext, $fileSize,$mimeType, $userId]);
    }

    // Move the new physical file
    $targetPath = '../uploads/dms/' . $storedFileName;
    if (!move_uploaded_file($file['tmp_name'], $targetPath)) {
        throw new Exception("Failed to save physical file.");
    }

    $db->commit();

    echo json_encode([
        "success" => true,
        "message" => $fileGuid ? "File replaced" : "New file uploaded",
        "data" => [
            "guid" => $fileGuid,
            "file_name" => $storedFileName,
            "original_name" => $originalName
        ]
    ]);

} catch (Exception $e) {
    if ($db->inTransaction()) $db->rollBack();
    echo json_encode(["success" => false, "message" => $e->getMessage()]);
}