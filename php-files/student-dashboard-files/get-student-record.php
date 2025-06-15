<?php 
header("Content-Type: application/json");

require "../shared-files/db_configurations.php";

// Check if request method is POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["error" => "Method not allowed"]);
    exit;
}

// Check if accountNumber is provided and not empty
if (!isset($_POST['accountNumber']) || empty(trim($_POST['accountNumber']))) {
    http_response_code(400);
    echo json_encode(["error" => "Account number is required"]);
    exit;
}

$accountNumber = trim($_POST['accountNumber']);

// Use prepared statement instead of real_escape_string
$stmt = $conn->prepare("SELECT name, calculus, object_oriented_programming, discrete_math FROM students_status WHERE id_number = ?");
$stmt->bind_param("s", $accountNumber);
$stmt->execute();
$result = $stmt->get_result();

if($result && $result->num_rows > 0){
    $row = $result->fetch_assoc();
    $studentName = htmlspecialchars($row['name'], ENT_QUOTES, 'UTF-8'); // Sanitize output
    $sub1 = $row['calculus'];
    $sub2 = $row['object_oriented_programming'];
    $sub3 = $row['discrete_math'];

    echo json_encode([
        "studentName" => $studentName,
        "subjects" => [
            [
                "name" => "Calculus",
                "status" => $sub1
            ],
            [
                "name" => "Object Oriented Programming",
                "status" => $sub2
            ],
            [
                "name" => "Discrete Math",
                "status" => $sub3
            ]
        ]
    ]);
} else {
    http_response_code(404);
    echo json_encode([
        "error" => "Student not found"
    ]);
}

$stmt->close();
$conn->close();
?>