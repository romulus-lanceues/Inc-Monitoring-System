<?php
header("Content-Type: application/json");
require '../shared-files/db_configurations.php';

try {
    // Get the data sent by front-end
    $accountName = $_POST['name'] ?? '';
    $accountNumber = $_POST['accountNumber'] ?? '';
    $password = $_POST['password'] ?? '';
    
    // Validate required fields
    if (empty($accountName) || empty($accountNumber) || empty($password)) {
        echo json_encode([
            'success' => false,
            'message' => 'All fields are required'
        ]);
        exit;
    }
    
    // Hash the password for security
    $hashedPassword = password_hash($password, PASSWORD_DEFAULT);
    
    // Use prepared statement (more secure)
    $stmt = $conn->prepare("INSERT INTO system_accounts(id_number, account_name, pwd) VALUES(?, ?, ?)");
    $stmt->bind_param("sss", $accountNumber, $accountName, $hashedPassword);
    
    if ($stmt->execute()) {
        echo json_encode([
            'success' => true,
            'message' => 'Account created successfully',
            'account_id' => $conn->insert_id
        ]);
    } else {
        echo json_encode([
            'success' => false,
            'message' => 'Database error: ' . $stmt->error
        ]);
    }
    
    $stmt->close();
    
} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Server error: ' . $e->getMessage()
    ]);
}

$conn->close();
?>