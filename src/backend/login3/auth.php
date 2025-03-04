<?php
session_start();
header("Access-Control-Allow-Origin: *"); // Permite solicitudes desde cualquier origen (ajusta según sea necesario)
header("Access-Control-Allow-Methods: POST, GET, OPTIONS"); // Métodos permitidos
header("Access-Control-Allow-Headers: Content-Type, Authorization"); // Encabezados permitidos
header('Content-Type: application/json');

if (!isset($_SESSION['usuario_id']) || !isset($_SESSION['rol'])) {
    echo json_encode(["success" => false, "message" => "Acceso no autorizado"]);
    exit;
}

// Obtener los datos de la sesión
$usuario_id = $_SESSION['usuario_id'];
$nombre_usuario = $_SESSION['nombre_usuario'];
$rol = $_SESSION['rol'];

// Definir la redirección según el rol
$ruta = '';
switch ($rol) {
    case 'administrador':
        $ruta = '/admin_inicio';
        break;
    case 'alimentador':
        $ruta = '/alimentador_inicio';
        break;
    default:
        echo json_encode(["success" => false, "message" => "Rol no reconocido"]);
        exit;
}

echo json_encode([
    "success" => true,
    "message" => "Sesión activa",
    "usuario_id" => $usuario_id,
    "nombre_usuario" => $nombre_usuario,
    "rol" => $rol,
    "ruta" => $ruta // Enviar la ruta de redirección al frontend
]);
?>

