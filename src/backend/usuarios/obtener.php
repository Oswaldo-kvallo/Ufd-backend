<?php
session_start(); // Inicia la sesión para poder verificar si hay sesión activa

// Verificar si hay una sesión activa
if (!isset($_SESSION['usuario_id'])) { // Cambia 'usuario_id' por la variable de sesión que estés usando
    echo json_encode(["success" => false, "message" => "Acceso no autorizado"]);
    exit; // Detenemos la ejecución del código si no hay sesión activa
}

include '../db.php';

// Conexión a la base de datos
$conn = new mysqli("localhost", "root", "", "baseconbackend");

if ($conn->connect_error) {
    die(json_encode(["success" => false, "message" => "Error de conexión a la base de datos"]));
}

// Consulta SQL con JOIN para obtener el nombre del área
$sql = "SELECT usuarios.id, usuarios.nombre_usuario, usuarios.contrasena, usuarios.estado, areas.nombre_area 
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
