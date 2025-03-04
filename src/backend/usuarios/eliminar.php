<?php
include '../db.php';

// Permitir recibir JSON
$input = file_get_contents("php://input");
$data = json_decode($input, true);

if (!$data) {
    echo json_encode(["success" => false, "message" => "Error: No se recibieron datos JSON"]);
    exit;
}

$id = $data["id"] ?? null;

if (!$id) {
    echo json_encode(["success" => false, "message" => "Error: Falta el ID del usuario"]);
    exit;
}

// Conexión a la base de datos
$conn = new mysqli("localhost", "root", "", "baseconbackend");

if ($conn->connect_error) {
    die(json_encode(["success" => false, "message" => "Error de conexión a la base de datos"]));
}

// Preparar la consulta SQL
$stmt = $conn->prepare("DELETE FROM usuarios WHERE id = ?");
$stmt->bind_param("i", $id);

// Ejecutar la consulta
if ($stmt->execute()) {
    echo json_encode(["success" => true, "message" => "Usuario eliminado correctamente"]);
} else {
    echo json_encode(["success" => false, "message" => "Error al eliminar usuario"]);
}

// Cerrar conexión
$stmt->close();
$conn->close();
?>
