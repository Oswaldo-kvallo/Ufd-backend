<?php
session_start();
include '../db.php';
require '/../xampp/htdocs/UFD Proyecto/Proyecto/backend/headers.php';

header('Content-Type: application/json');

if (!isset($_SESSION['usuario_id'])) {
    echo json_encode(["success" => false, "message" => "No hay sesión activa"]);
    exit;
}

// Conectar a la base de datos
$conn = new mysqli("localhost", "root", "", "baseconbackend");

if ($conn->connect_error) {
    die(json_encode(["success" => false, "message" => "Error de conexión a la base de datos"]));
}

// Registrar la fecha y hora de salida en la tabla `accesos`
$usuario_id = $_SESSION['usuario_id'];
$fecha_salida = date("Y-m-d H:i:s");

// Actualizar el último acceso del usuario con la fecha de salida
$update_acceso = "UPDATE accesos SET fecha_salida = ? WHERE usuario_id = ? AND fecha_salida IS NULL ORDER BY fecha_ingreso DESC LIMIT 1";
$stmt = $conn->prepare($update_acceso);
$stmt->bind_param("si", $fecha_salida, $usuario_id);
$stmt->execute();
$stmt->close();

// **Cerrar sesión correctamente**
$_SESSION = []; // Eliminar todas las variables de sesión

// Invalidar la cookie de sesión en el navegador
if (ini_get("session.use_cookies")) {
    $params = session_get_cookie_params();
    setcookie(session_name(), '', time() - 42000,
        $params["path"], $params["domain"],
        $params["secure"], $params["httponly"]
    );
}

// Cerrar sesión
session_destroy();

echo json_encode(["success" => true, "message" => "Sesión cerrada correctamente"]);

// Cerrar conexión
$conn->close();
?>
