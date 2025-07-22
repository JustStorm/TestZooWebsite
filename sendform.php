<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);


/* Принимаем данные из формы */
  $name = $_POST["username"]; 
  $email = $_POST["email"];
  $message = $_POST["message"];

/* Подключаемся к базе данных */
$conn = mysqli_connect("localhost", "root", "usbw");



// Проверка соединения
if (!$conn) {
    die("Ошибка подключения: " . mysqli_connect_error());
}
echo "Соединение установлено<br>";


$sql = "CREATE DATABASE IF NOT EXISTS rating_db CHARACTER SET utf8mb4";
if (mysqli_query($conn, $sql)) {
    echo "База данных создана<br>";
} else {
    echo "Ошибка создания БД: " . mysqli_error($conn);
}

mysqli_select_db($conn, "rating_db");



$sql = "CREATE TABLE IF NOT EXISTS rating (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    message VARCHAR(200) NOT NULL
    )";

if (mysqli_query($conn, $sql)) {
    echo "Таблица создана<br>";
} else {
    echo "Ошибка создания таблицы: " . mysqli_error($conn);
}


$sql = "INSERT INTO rating (name, email, message) VALUES ('$name', '$email', '$message')";
if (mysqli_query($conn, $sql)) {
    echo "Данные добавлены (На имя $name)<br>";
} else {
    echo "Ошибка вставки (возможно, запись уже есть): " . mysqli_error($conn);
}

mysqli_close($conn);


/* Делаем редирект обратно */
header("Location: ".$_SERVER["HTTP_REFERER"]); 
exit;

?>