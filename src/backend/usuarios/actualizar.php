<?php
include '../db.php';

header('Content-Type: application/json');

$input = file_get_contents("php://input");
$data = json_decode($input, true);

if (!$data) {
    echo json_encode(["success" => false, "message" => "Error: No se recibieron datos JSON"]);
    exit;
}

$id = $data["id"] ?? null;
$nombre_usuario = $data["nombre_usuario"] ?? null;
$contrasena = $data["contrasena"] ?? null;
$id_area = $data["id_area"] ?? null;
$estado = $data["estado"] ?? null;

if (!$id || !$nombre_usuario || !$id_area || !$estado) {
    echo json_encode(["success" => false, "message" => "Error: Faltan datos obligatorios"]);
    exit;
}

// Validar si el área existe en la base de datos
$query = "SELECT id FROM areas WHERE id = ?";
$stmt = $conn->prepare($query);
$stmt->bind_param("i", $id_area);
$stmt->execute();
$stmt->store_result();

if ($stmt->num_rows == 0) {
    echo json_encode(["success" => false, "message" => "Error: El área especificada no existe"]);
    $stmt->close();
    exit;
}
$stmt->close();

// Validar el estado (debe ser 'activo' o 'inactivo')
$estado_validos = ['activo', 'inactivo'];
if (!in_array($estado, $estado_validos)) {
    echo json_encode(["success" => false, "message" => "Error: Estado inválido, solo se permite 'activo' o 'inactivo'"]);
    exit;
}

// Verificar si el nombre de usuario ya existe en otro usuario (excluyendo el usuario actual)
$query = "SELECT id FROM usuarios WHERE nombre_usuario = ? AND id != ?";
$stmt = $conn->prepare($query);
$stmt->bind_param("si", $nombre_usuario, $id);
$stmt->execute();
$stmt->store_result();

if ($stmt->num_rows > 0) {
    echo json_encode(["success" => false, "message" => "Error: El nombre de usuario ya está en uso"]);
    $stmt->close();
    exit;
}
$stmt->close();

// Actualizar usuario
if (!empty($contrasena)) {
    $query = "UPDATE usuarios SET nombre_usuario = ?, contrasena = ?, id_area = ?, estado = ? WHERE id = ?";
    $stmt = $conn->prepare($query);
    $stmt->bind_param("ssisi", $nombre_usuario, $contrasena, $id_area, $estado, $id);
} else {
    $query = "UPDATE usuarios SET nombre_usuario = ?, id_area = ?, estado = ? WHERE id = ?";
    $stmt = $conn->prepare($query);
    $stmt->bind_param("sisi", $nombre_usuario, $id_area, $estado, $id);
}

if ($stmt->execute()) {
    echo json_encode(["success" => true, "message" => "Usuario actualizado correctamente"]);
} else {
    echo json_encode(["success" => false, "message" => "Error al actualizar usuario"]);
}

// Cerrar conexión
$stmt->close();
$conn->close();
?>
