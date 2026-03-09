<?php
header("Content-Type: application/json");
require_once '../config/database.php';
require_once __DIR__ . '/../error_log_config.php'; 

$pdo = Database::getInstance(); 

$input = json_decode(file_get_contents("php://input"), true);

// Validation
if (!isset($input['action']) || !isset($input['id'])) {
    echo json_encode(["success" => false, "message" => "Missing action or ID"]);
    exit;
}

$action = $input['action'];
$profileId = $input['id'];
$updateData = [];

// Map actions to specific database columns
switch ($action) {
    case 'aboutus':
        $updateData = ['aboutus' => $input['aboutus']];
        break;

    case 'basicdetails':
        $updateData = [
            'first_name' => $input['first_name'],
            'last_name' => $input['last_name'],
            'dob' => $input['dob'],
            'gender' => $input['gender'],
            'marital_status' => $input['marital_status'],
            'height' => $input['height'],
            'weight' => $input['weight'],
            'boold_group' => $input['boold_group']
        ];
        break;

    case 'religion&community':
        $updateData = [
            'religion' => $input['religion'],
            'community' => $input['community'],
            'sub_community' => $input['sub_community']
        ];
        break;

    case 'familydetails':
        $updateData = [
            'family_type' => $input['family_type'],
            'father_occupation' => $input['father_occupation'],
            'mother_occupation' => $input['mother_occupation'],
            'Noof_sibling' => $input['Noof_sibling'],
            'sister_count' => $input['sister_count'],
            'brother_count' => $input['brother_count']
        ];
        break;

    case 'education':
        $updateData = [
            'qualification' => $input['qualification'],
            'college' => $input['college'],
            'work_with' => $input['work_with'],
            'working_as' => $input['working_as'],
            'company_name' => $input['company_name'],
            'income' => $input['income']
        ];
        break;

    case 'location':
        $updateData = [
            'address' => $input['address'],
            'city' => $input['city'],
            'state' => $input['state'],
            'country' => $input['country']
        ];
        break;

    default:
        echo json_encode(["success" => false, "message" => "Invalid action"]);
        exit;
}

// 2. Perform the Database Update
try {
    if (empty($updateData)) throw new Exception("No data to update");

    $pdo->beginTransaction();

    // Dynamically build the SQL string
    $fields = "";
    foreach ($updateData as $key => $value) {
        $fields .= "$key = :$key, ";
    }
    $fields = rtrim($fields, ", ");

    $sql = "UPDATE profiles SET $fields, updated_at = NOW() WHERE id = :id";
    
    $stmt = $pdo->prepare($sql);
    
    // Bind the ID
    $updateData['id'] = $profileId;
    
    $stmt->execute($updateData);
    $pdo->commit();

    echo json_encode([
        "success" => true, 
        "message" => "Profile updated successfully",
        "action" => $action
    ]);

} catch (Exception $e) {
    if ($pdo->inTransaction()) $pdo->rollBack();
    error_log("Update Error: " . $e->getMessage());
    echo json_encode(["success" => false, "message" => "Server error: " . $e->getMessage()]);
}
?>