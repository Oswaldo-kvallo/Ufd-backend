<?php
session_start();
include '../db.php';

$conn = new mysqli("localhost", "root", "", "baseconbackend");

if ($conn->connect_error) {
    die(json_encode(["success" => false, "message" => "Error de conexión a la base de datos"]));
}

// Obtener datos del formulario
$nombre_usuario = trim(htmlspecialchars($_POST['nombre_usuario']));
$contrasena = $_POST['contrasena'];

// Verificar si el usuario existe
$sql = "SELECT id, nombre_usuario, contrasena FROM usuarios WHERE nombre_usuario = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $nombre_usuario);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    $row = $result->fetch_assoc();

    // Verificar la contraseña (si está encriptada en la BD con password_hash)
    if ($contrasena === $row['contrasena']) {
        $_SESSION['usuario_id'] = $row['id'];
        $_SESSION['nombre_usuario'] = $row['nombre_usuario'];

        echo json_encode(["success" => true, "message" => "Inicio de sesión exitoso"]);
    } else {
        echo json_encode(["success" => false, "message" => "Contraseña incorrecta"]);
    }
} else {
    echo json_encode(["success" => false, "message" => "Usuario no encontrado"]);
}

$stmt->close();
$conn->close();
?>
