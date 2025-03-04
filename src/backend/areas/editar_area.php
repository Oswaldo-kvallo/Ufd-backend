<?php
include '../db.php';
require '../headers.php';

$conn = new mysqli("localhost", "root", "", "baseconbackend");

if ($conn->connect_error) {
    die(json_encode(["success" => false, "message" => "Error de conexión a la base de datos"]));
}

// Obtener datos del formulario(sin conectar al front, por mientras funciona, si no da conectarlo con el front este sirve)
/* $id = $_POST['id'];
$nombre = trim($_POST['nombre_area']);
$estado = $_POST['estado']; // 'activo' o 'inactivo'*/
$data = json_decode(file_get_contents("php://input"), true);
$id = isset($data['id']) ? $data['id'] : '';
$nombre = isset($data['nombre_area']) ? trim($data['nombre_area']) : '';
$estado = isset($data['estado']) ? $data['estado'] : '';


if (empty($id) || empty($nombre) || empty($estado)) {
    echo json_encode(["success" => false, "message" => "El ID, el nombre y el estado del área son obligatorios"]);
    exit;
}

// Verificar si ya existe otro área con el mismo nombre
$sql_check = "SELECT id FROM areas WHERE nombre_area = ? AND id != ?";
$stmt_check = $conn->prepare($sql_check);
$stmt_check->bind_param("si", $nombre, $id);
$stmt_check->execute();
$stmt_check->store_result();

if ($stmt_check->num_rows > 0) {
    echo json_encode(["success" => false, "message" => "El nombre del área ya existe"]);
} else {
    // Actualizar el área si el nombre no está duplicado
    $sql_update = "UPDATE areas SET nombre_area = ?, estado = ? WHERE id = ?";
    $stmt_update = $conn->prepare($sql_update);
    $stmt_update->bind_param("ssi", $nombre, $estado, $id);

    if ($stmt_update->execute()) {
        echo json_encode(["success" => true, "message" => "Área actualizada correctamente"]);
    } else {
        echo json_encode(["success" => false, "message" => "Error al actualizar el área"]);
    }
    $stmt_update->close();
}

$stmt_check->close();
$conn->close();
?>
