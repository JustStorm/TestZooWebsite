<?php
$conn = mysqli_connect("localhost", "root", "usbw");
mysqli_select_db($conn, "rating_db");


if ($_SERVER["REQUEST_METHOD"] === "POST" && isset($_POST["id"])) {
    $id = intval($_POST["id"]);
    $sql = "DELETE FROM rating WHERE id = $id";
    mysqli_query($conn, $sql);
}

header("Location: form.php"); // замените на свой файл, где отображаются отзывы
exit;
?>