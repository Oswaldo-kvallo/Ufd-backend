<?php
session_start();
include '../db.php';
require '/../xampp/htdocs/UFD Proyecto/Proyecto/backend/headers.php';

header('Content-Type: application/json');

// Conectar a la base de datos
$conn = new mysqli("localhost", "root", "", "baseconbackend");

if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Error de conexión a la base de datos"]);
    exit;
}

// Obtener los accesos desde la base de datos
$query = "SELECT accesos.id, usuarios.nombre_usuario, areas.nombre_area, accesos.fecha_ingreso, accesos.fecha_salida
          FROM accesos
          JOIN usuarios ON accesos.usuario_id = usuarios.id
          JOIN areas ON usuarios.id_area = areas.id";

$result = $conn->query($query);

if (!$result) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Error en la consulta SQL"]);
    $conn->close();
    exit;
}

$accesos = [];

while ($row = $result->fetch_assoc()) {
    // Verificar si 'fecha_salida' existe y no es NULL antes de formatearla
    $row['fecha_ingreso'] = date('Y-m-d H:i:s', strtotime($row['fecha_ingreso']));
    $row['fecha_salida'] = isset($row['fecha_salida']) && $row['fecha_salida'] !== null
        ? date('Y-m-d H:i:s', strtotime($row['fecha_salida']))
        : "No disponible"; // Si es NULL o no existe, asignamos "No disponible"

    $accesos[] = $row;
}

// Devolver los datos en formato JSON
echo json_encode([
    "success" => true,
    "accesos" => $accesos
]);

// Cerrar la conexión
$conn->close();
?>
