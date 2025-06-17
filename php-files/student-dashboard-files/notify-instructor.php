<?php
header("Content-Type: application/json");
require "../shared-files/db_configurations.php";

// Read and decode JSON input instead of using $_POST
$input = json_decode(file_get_contents('php://input'), true);

$studentName = $input['studentName'] ?? null;
$subject = $input['subjectName'] ?? null;

if (!$studentName || !$subject) {
    echo json_encode(['success' => false, 'error' => 'Invalid input']);
    exit;
}

try {
    // Prepare the SQL statement with placeholders
    $sql = "INSERT INTO notifications (student_name, subject_name, read_status) VALUES (?, ?, ?)";
    $stmt = $conn->prepare($sql);
    
    // Execute with bound parameters
    $stmt->execute([$studentName, $subject, false]);
    
    echo json_encode(['success' => true, 'message' => 'Notification inserted successfully']);
    
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'error' => 'Database error: ' . $e->getMessage()]);
}
?>