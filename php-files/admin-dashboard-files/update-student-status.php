<?php
header("Content-Type: application/json");
require "../shared-files/db_configurations.php";

$studentName = $_POST['studentName'] ?? null;
$subject = $_POST['subjectName'] ?? null;
$status = isset($_POST['status']) ? (int)$_POST['status'] : null;

$allowedSubjects = ['calculus', 'object_oriented_programming', 'discrete_math'];

if (!$studentName || !$subject || !in_array($subject, $allowedSubjects)) {
    echo json_encode(['success' => false, 'error' => 'Invalid input']);
    exit;
}

// Update the status in the database
$sql = "UPDATE students_status SET `$subject` = ? WHERE name = ?";
$stmt = $conn->prepare($sql);

if ($stmt) {
    $stmt->bind_param("is", $status, $studentName);
    if ($stmt->execute()) {
        echo json_encode(['success' => true]);
    } else {
        echo json_encode(['success' => false, 'error' => 'Execution failed']);
    }
    $stmt->close();
} else {
    echo json_encode(['success' => false, 'error' => 'Query preparation failed']);
}

$conn->close();
?>