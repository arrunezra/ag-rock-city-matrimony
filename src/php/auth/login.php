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
    // 1. Fetch User and Profile details
    // FIXED: Added missing comma after p.profile_id
    $sql = "SELECT  u.id
                    ,u.userid
                    ,u.phoneNumber
                    ,u.email
                    ,u.PasswordHash
                    ,u.role 
                    ,p.profile_id
                    ,p.gender
                    ,p.first_name
                    ,p.last_name
					,p.gender
                    ,pf.file_name 
                    ,p.city
					,p.is_visible
                    ,u.IsVerified
					
            FROM users u 
            LEFT JOIN profiles p ON u.userid = p.userid 
            LEFT JOIN profile_files pf ON pf.file_id = (
                SELECT file_id 
                FROM profile_files 
                WHERE profile_id = p.profile_id 
                AND is_verified = 1 
                ORDER BY is_profile_pic DESC, created_at DESC 
                LIMIT 1
            )
            WHERE u.IsActive = 1 AND  (u.phoneNumber = ? OR u.email = ?)";

    $stmt = $db->prepare($sql);
    $stmt->execute([$data->phoneNumber, $data->phoneNumber]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($user && password_verify($data->password, $user['PasswordHash'])) {
        
        // 2. Generate Access Token
        $payload = [
            "uid" => $user['userid'],
            "phone" => $user['phoneNumber'],
            "email" => $user['email'],
            "role" => $user['role'],
            "profile_id" => $user['profile_id'],
			"gender" => $user['gender'],
			"is_visible" => $user['is_visible']
        ];
        $accessToken = JWT::encode($payload, 3600);

        // 3. Generate and Save Refresh Token
        $refreshToken = bin2hex(random_bytes(32));
        $updateStmt = $db->prepare("UPDATE users SET refresh_token = ? WHERE id = ?");
        $updateStmt->execute([$refreshToken, $user['id']]);

        // 4. Default avatar logic
        // FIXED: Wrapped ternary in parentheses to prevent logic errors
        $defaultAvatar = ($user['gender'] === 'Male') ? 'boy.png' : 'girl.jpg';
        $profilePic = !empty($user['file_name']) ? $user['file_name'] : $defaultAvatar;
         
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
                "profilePic" => $profilePic,
                "profileThumb" => $profilePic, // Usually same as pic if no separate thumb
                "city" => $user['city'] ?? '',
                "profile_id" => $user['profile_id'] ?? '',
                "isVerified" => $user['IsVerified'] ?? 0,
				"is_visible" => $user['is_visible']
            ]
        ]);
    } else {
        http_response_code(401); 
        echo json_encode(["message" => "Invalid phone number/email or password"]);
    }

} catch (Exception $e) {
    error_log("Login Error: " . $e->getMessage()); 
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Internal server error"]);
}
?>