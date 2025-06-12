<?php
header("Content-Type: application/json");

require '../shared-files/db_configurations.php';

try {
    // Get input - matching your JS variable names
    $accountNumber = $_POST['accountNumber'] ?? '';  // Changed from 'studentNumber'
    $password = $_POST['password'] ?? '';
    
    // Validate required fields
    if (empty($accountNumber) || empty($password)) {
        echo json_encode([
            "success" => false, 
            "message" => "Account number and password are required"
        ]);
        exit;
    }
    
    // Use prepared statement to get user data
    $stmt = $conn->prepare("SELECT account_type, pwd FROM system_accounts WHERE id_number = ?");
    $stmt->bind_param("s", $accountNumber);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result && $result->num_rows > 0) {
        $row = $result->fetch_assoc();
        $hashedPassword = $row['pwd'];
        $accountType = $row['account_type'];
        
        error_log("Input password: " . $password);
        error_log("Stored hash: " . $hashedPassword);

        // Verify the password against the hash
        if (password_verify($password, $hashedPassword)) {
            error_log("Password matched!");
            echo json_encode([
                "success" => true,
                "account_type" => $accountType,
                "message" => "Login successful"
            ]);
        } else {
                error_log("Password did NOT match.");
            echo json_encode([
                "success" => false, 
                "message" => "Invalid credentials"
            ]);
        }
    } else {
        echo json_encode([
            "success" => false, 
            "message" => "Invalid credentials"
        ]);
    }
    
    $stmt->close();
    
} catch (Exception $e) {
    echo json_encode([
        "success" => false, 
        "message" => "Server error: " . $e->getMessage()
    ]);
}

$conn->close();
?>