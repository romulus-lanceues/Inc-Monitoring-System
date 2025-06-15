<?php

header("Content-Type: application/json");

require "../shared-files/db_configurations.php";

// Get the subject name from POST
$subject = $_POST['subjectName'] ?? null;

// Define a whitelist of allowed column names
$allowedSubjects = ['calculus', 'object_oriented_programming', 'discrete_math'];

if (!$subject || !in_array($subject, $allowedSubjects)) {
    echo json_encode(['error' => 'Invalid or missing subject']);
    exit;
}

// First query: count students who passed
$sqlPassed = "SELECT COUNT(*) AS count FROM students_status WHERE `$subject` = TRUE";
$result = $conn->query($sqlPassed);

$passed = 0;
if ($result && $result->num_rows > 0) {
    $row = $result->fetch_assoc();
    $passed = (int)$row['count'];
}

// Second query: count students who have data for this subject
$sqlTotal = "SELECT COUNT(*) AS count FROM students_status WHERE `$subject` IS NOT NULL";
$result = $conn->query($sqlTotal);

$total = 0;
if ($result && $result->num_rows > 0) {
    $row = $result->fetch_assoc();
    $total = (int)$row['count'];
}

// Respond with JSON
echo json_encode([
    'passedStudents' => $passed,
    'totalStudents' => $total
]);

$conn->close();
?>