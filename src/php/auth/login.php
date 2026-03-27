<?php
header("Content-Type: application/json");
require_once '../config/database.php';
require_once '../helpers/JWT.php';
require_once __DIR__ . '/../error_log_config.php'; 

$db = Database::getInstance();
$data = json_decode(file_get_contents("php://input"));

if (empty($data->phoneNumber) || empty($data->password)) {
    http_response_code(400);
    echo json_encode(["message" => "Phone number and password are required"]);
    exit();
}
try {
// 1. Fetch User and Profile details (including profile_thumb)
$sql = "SELECT  u.id, 
                u.userid, 
                u.phoneNumber, 
                u.email, 
                u.PasswordHash, 
                u.role, 
                p.first_name, 
                p.last_name, 
                pf.file_name,   
                p.city,
                p.profile_id,
                u.IsVerified
        FROM users u 
        LEFT JOIN profiles p ON u.userid = p.userid 
        LEFT JOIN profile_files pf ON p.profile_id = p.profile_id 
        WHERE u.phoneNumber = ? OR u.email = ?";

$stmt = $db->prepare($sql);
$stmt->execute([$data->phoneNumber, $data->phoneNumber]);
$user = $stmt->fetch();

if ($user && password_verify($data->password, $user['PasswordHash'])) {
    
    // 2. Generate Access Token
    $payload = [
        "uid" => $user['userid'],
        "phone" => $user['phoneNumber'],
        "email" => $user['email'],
        "role" => $user['role']
    ];
    $accessToken = JWT::encode($payload, 3600);

    // 3. Generate and Save Refresh Token
    $refreshToken = bin2hex(random_bytes(32));
    $updateStmt = $db->prepare("UPDATE users SET refresh_token = ? WHERE id = ?");
    $updateStmt->execute([$refreshToken, $user['id']]);

     
    // 4. Send Comprehensive JSON Output
    echo json_encode([
        "status" => "success",
        "access_token" => $accessToken,
        "refresh_token" => $refreshToken,
        "expires_in" => 3600,
        "user" => [
            "userid" => $user['userid'],
            "firstName" => $user['first_name'] ?? 'Member',
            "lastName" => $user['last_name'] ?? '',
            "email" => $user['email'],
            "phone" => $user['phoneNumber'],
            "role" => $user['role'],
            "profilePic" => $user['file_name'] ??   'default_profile.png',
            "profileThumb" => $user['profile_thumb'] ?? 'default_profile.png',
            "city" => $user['city'] ?? '',
			"profile_id" => $user['profile_id'] ?? '',
			"isVerified" => $user['IsVerified'] ?? '',
        ]
    ]);
} else {
    http_response_code(401); 
    echo json_encode(["message" => "Invalid phone number/email or password"]);
}

} catch (Exception $e) {
        error_log("complete_profile Error: " . $e->getMessage()); 

    if ($db->inTransaction()) {
        $db->rollBack();
    }
    http_response_code(500);
    echo json_encode(["success" => false, "message" => $e->getMessage()]);
}
?>