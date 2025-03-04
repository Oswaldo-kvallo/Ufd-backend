<?php
session_start();
include '../db.php';
header("Access-Control-Allow-Origin: http://localhost:5173"); // Permite solicitudes desde cualquier origen (ajusta según sea necesario)
header("Access-Control-Allow-Methods: POST, GET, OPTIONS"); // Métodos permitidos
header("Access-Control-Allow-Headers: Content-Type, Authorization"); // Encabezados permitidos
header("Access-Control-Allow-Credentials: true");

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

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

        // Registrar acceso en la tabla `accesos`
        $fecha_ingreso = date("Y-m-d H:i:s");
        $insert_acceso = "INSERT INTO accesos (usuario_id, fecha_ingreso) VALUES (?, ?)";
        $stmt_acceso = $conn->prepare($insert_acceso);
        $stmt_acceso->bind_param("is", $user['id'], $fecha_ingreso);
        $stmt_acceso->execute();
        $stmt_acceso->close();

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
