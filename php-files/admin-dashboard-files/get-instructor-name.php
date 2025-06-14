<?php 
header("Content-Type: application/json");

require "../shared-files/db_configurations.php";

// Get the input value safely
$instructorNumber = $_POST['instructorNumber'] ?? '';

// Validate input
if (empty($instructorNumber) || !is_numeric($instructorNumber)) {
    http_response_code(400);
    echo json_encode([
        "error" => "Invalid or missing instructor number"
    ]);
    exit;
}

$instructorNumber = (int) $instructorNumber;

try {
    $stmt = $conn->prepare("SELECT account_name FROM system_accounts WHERE id_number = ?");
    
    if (!$stmt) {
        throw new Exception("Failed to prepare statement: " . $conn->error);
    }
    
    $stmt->bind_param("i", $instructorNumber);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result && $result->num_rows > 0) {
        $row = $result->fetch_assoc();
        echo json_encode([
            "instructorName" => $row['account_name']
        ]);
    } else {
        http_response_code(404);
        echo json_encode([
            "error" => "Instructor not found"
        ]);
    }
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        "error" => "Database error occurred"
    ]);
    // Log the actual error for debugging (don't send to client)
    error_log("Database error in retrieve_instructor_name.php: " . $e->getMessage());
    
} finally {
    if (isset($stmt)) {
        $stmt->close();
    }
    $conn->close();
}
?>
