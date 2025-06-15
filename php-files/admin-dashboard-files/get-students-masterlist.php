<?php
header("Content-Type: application/json");

require "../shared-files/db_configurations.php";

$subject = $_POST['subjectName'] ?? null;

$allowedSubjects = ['calculus', 'object_oriented_programming', 'discrete_math'];

// Validate input
if (!$subject || !in_array($subject, $allowedSubjects)) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid or missing subject']);
    exit;
}

try {
    // Get the total number of students enrolled in that subject
    $sqlStudentCount = "SELECT COUNT(*) AS count FROM students_status WHERE `$subject` IS NOT NULL";
    $stmt1 = $conn->prepare($sqlStudentCount);

    if (!$stmt1) {
        throw new Exception("Failed to prepare count statement: " . $conn->error);
    }

    $stmt1->execute();
    $result1 = $stmt1->get_result();

    $totalNumOfStudents = 0;
    if ($result1 && $result1->num_rows > 0) {
        $row = $result1->fetch_assoc();
        $totalNumOfStudents = (int)$row['count'];
    }

    // Get student data
    $sqlGetStudentData = "SELECT name, `$subject` FROM students_status WHERE `$subject` IS NOT NULL ORDER BY name";
    $stmt2 = $conn->prepare($sqlGetStudentData);

    if (!$stmt2) {
        throw new Exception("Failed to prepare data statement: " . $conn->error);
    }

    $stmt2->execute();
    $result2 = $stmt2->get_result();

    $studentInfos = [];

    if ($result2 && $result2->num_rows > 0) {
        while ($row = $result2->fetch_assoc()) {
            $studentInfos[] = [
                "name" => $row['name'],
                "status" => (int)$row[$subject]
            ];
        }
    }

    echo json_encode([
        "totalNumOfStudents" => $totalNumOfStudents,
        "studentInfos" => $studentInfos
    ]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        "error" => "Failed to retrieve student data"
    ]);
    // Log the actual error for debugging
    error_log("Database error in get-students-masterlist.php: " . $e->getMessage());

} finally {
    if (isset($stmt1)) {
        $stmt1->close();
    }
    if (isset($stmt2)) {
        $stmt2->close();
    }
    $conn->close();
}
?>