<?php
$host = "localhost";
$user = "root";  // Cambia si tienes otra configuración
$password = "";  // Si tienes contraseña en MySQL, agrégala aquí
$dbname = "baseconbackend";

$conn = new mysqli($host, $user, $password, $dbname);

if ($conn->connect_error) {
    die("Error de conexión: " . $conn->connect_error);
}
?>
