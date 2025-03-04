<?php
include '../db.php';

$conn = new mysqli("localhost", "root", "", "baseconbackend");

if ($conn->connect_error) {
    die(json_encode(["success" => false, "message" => "Error de conexión a la base de datos"]));
}

$sql = "SELECT usuarios.id, usuarios.nombre_usuario, usuarios.contrasena ,usuarios.id_area, areas.nombre_area 
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
