<?php
include '../db.php';

$conn = new mysqli("localhost", "root", "", "baseconbackend");

if ($conn->connect_error) {
    die(json_encode(["success" => false, "message" => "Error de conexión a la base de datos"]));
}

// Verificar si los datos han sido enviados correctamente
$input = file_get_contents("php://input");
$data = json_decode($input, true);

if (!$data) {
    echo json_encode(["success" => false, "message" => "Error: No se recibieron datos JSON"]);
    exit;
}

$id = $data["id"] ?? null;
$nombre_usuario = $data["nombre_usuario"] ?? null;
$id_area = $data["id_area"] ?? null;
$estado = $data["estado"] ?? 'Activo'; 
$contrasena = $data["contrasena"] ?? null;


// Validar que el estado sea correcto
$estado = trim($estado); // Eliminar espacios en blanco
$valoresValidos = ['Activo', 'Inactivo'];

if (!in_array($estado, $valoresValidos)) {
    echo json_encode(["success" => false, "message" => "El estado debe ser 'Activo' o 'Inactivo'"]);
    exit();
}

// Preparar la consulta con o sin contraseña
if ($contrasena) {
    $sql = "UPDATE usuarios SET nombre_usuario = ?, contrasena = ?, id_area = ?, estado = ? WHERE id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("ssiis", $nombre_usuario, $contrasena, $id_area, $estado, $id);
} else {
    $sql = "UPDATE usuarios SET nombre_usuario = ?, id_area = ?, estado = ? WHERE id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("sisi", $nombre_usuario, $id_area, $estado, $id);
}

// Ejecutar y verificar si la actualización fue exitosa
if ($stmt->execute()) {
    echo json_encode(["success" => true, "message" => "Usuario actualizado correctamente"]);
} else {
    echo json_encode(["success" => false, "message" => "Error al actualizar usuario"]);
}

$stmt->close();
$conn->close();
?>
