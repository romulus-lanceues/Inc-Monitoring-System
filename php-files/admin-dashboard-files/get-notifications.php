<?php
header("Content-Type: application/json");

require "../shared-files/db_configurations.php";

// First Query – Get total notifications count
$sqlTotalNotifs = "SELECT COUNT(*) AS count FROM notifications";
$result = $conn->query($sqlTotalNotifs);

$totalNotifications = 0;
if ($result && $result->num_rows > 0) {
    $row = $result->fetch_assoc();
    $totalNotifications = (int)$row['count'];
}

// Second Query – Check if all notifications are read
$sqlCheckReadStatus = "SELECT MIN(read_status) AS min_status FROM notifications";
$result = $conn->query($sqlCheckReadStatus);

$allNotificationsRead = false;
if ($result && $result->num_rows > 0) {
    $row = $result->fetch_assoc();
    $allNotificationsRead = ((int)$row['min_status'] === 1);
}

// Third Query – Get notifications (raw order), then reverse it
$sqlGetNotifications = "SELECT student_name, subject_name FROM notifications WHERE student_name IS NOT NULL AND subject_name IS NOT NULL";
$result = $conn->query($sqlGetNotifications);

$notificationInfos = [];
if ($result && $result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $notificationInfos[] = [
            "student_name" => $row["student_name"],
            "subject_name" => $row["subject_name"]
        ];
    }

    // Reverse the array so latest (bottom) entries come first
    $notificationInfos = array_reverse($notificationInfos);
}

// Final JSON output
$response = [
    "totalNotifications" => $totalNotifications,
    "allRead" => $allNotificationsRead,
    "notifications" => $notificationInfos
];

echo json_encode($response);
?>