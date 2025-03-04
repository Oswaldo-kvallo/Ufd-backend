<?php
/*session_start(); // Inicia la sesión para verificar si hay sesión activa

// Verificar si hay una sesión activa
if (!isset($_SESSION['usuario_id'])) { 
    echo json_encode(["success" => false, "message" => "Acceso no autorizado"]);
    exit; 
}
*/
include '../db.php';
require '/../xampp/htdocs/UFD Proyecto/Proyecto/backend/headers.php';

// Conexión a la base de datos
$conn = new mysqli("localhost", "root", "", "baseconbackend");

if ($conn->connect_error) {
    die(json_encode(["success" => false, "message" => "Error de conexión a la base de datos"]));
}

// Consulta SQL con JOIN para obtener el nombre del área y el rol del usuario
$sql = "SELECT usuarios.id, usuarios.nombre_usuario, usuarios.contrasena, usuarios.estado, usuarios.rol, areas.nombre_area 
        FROM usuarios 
        LEFT JOIN areas ON usuarios.id_area = areas.id";

$result = $conn->query($sql);

$usuarios = [];
while ($row = $result->fetch_assoc()) {
    $usuarios[] = $row;
}

echo json_encode(["success" => true, "usuarios" => $usuarios]);

$conn->close();
?>
