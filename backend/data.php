<?php

// database
// $host = "localhost";
// $db = "js_chart";
// $user = "dckap";
// $pwd = "dckap2023Ecommerce";

// $conn = new mysqli($host, $db, $user, $pwd);

// if($conn->connect_errno) {
//     http_response_code(400);
//     header('content_type: text/plain');
//     echo $conn->connect_error;
//     exit();
// }



define('DB_HOST', 'localhost');
define('DB_USERNAME', 'dckap');
define('DB_PASSWORD', 'dckap2023Ecommerce');
define('DB_NAME', 'js_chart');

$query = new mysqli(DB_HOST, DB_USERNAME, DB_PASSWORD, DB_NAME);
if(!$query) {
    die("Connection failed: ".$query->error);
}
else {
    echo "Connected";
}

$query->close();



