<?php
session_start();
include '../db.php';

header('Content-Type: application/json');

// Recibir datos JSON
$input = file_get_contents("php://input");
$data = json_decode($input, true);

$nombre_usuario = $data['nombre_usuario'] ?? null;
$contrasena = $data['contrasena'] ?? null;

if (!$nombre_usuario || !$contrasena) {
    echo json_encode(["success" => false, "message" => "Usuario y contraseña son obligatorios"]);
    exit;
}

// Conectar a la base de datos
$conn = new mysqli("localhost", "root", "", "baseconbackend");

if ($conn->connect_error) {
    die(json_encode(["success" => false, "message" => "Error de conexión a la base de datos"]));
}

// Buscar usuario en la base de datos
$query = "SELECT id, nombre_usuario, contrasena, rol FROM usuarios WHERE nombre_usuario = ?";
$stmt = $conn->prepare($query);
$stmt->bind_param("s", $nombre_usuario);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 1) {
    $user = $result->fetch_assoc();
    
    // Verificar la contraseña (sin encriptar en tu caso)
    if ($contrasena === $user['contrasena']) {
        // Iniciar sesión y guardar datos del usuario
        $_SESSION['usuario_id'] = $user['id'];
        $_SESSION['nombre_usuario'] = $user['nombre_usuario'];
        $_SESSION['rol'] = $user['rol'];

        echo json_encode([
            "success" => true, 
            "message" => "Inicio de sesión exitoso",
            "rol" => $user['rol']
        ]);
    } else {
        echo json_encode(["success" => false, "message" => "Contraseña incorrecta"]);
    }
} else {
    echo json_encode(["success" => false, "message" => "Usuario no encontrado"]);
}

// Cerrar conexión
$stmt->close();
$conn->close();
?>
