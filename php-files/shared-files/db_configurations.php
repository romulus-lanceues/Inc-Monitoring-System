<?php
$host = "localhost";
$port = 3307; // XAMPP default
$user = "root";
$pass = "";
$db = "inc_system_records";

// Connect with port
$conn = new mysqli($host, $user, $pass, $db, $port);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
?>