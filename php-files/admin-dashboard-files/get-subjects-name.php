<?php

header("Content-Type: application/json");

$subjects = [
    'calculus',
    'object_oriented_programming', 
    'discrete_math'
];

echo json_encode($subjects);

?>
