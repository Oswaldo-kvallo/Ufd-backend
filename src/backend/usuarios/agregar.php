<?php
include __DIR__ . '/../db.php';

header('Content-Type: application/json');

// Recibir datos del cuerpo de la solicitud
$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['nombre_usuario']) || !isset($data['contrasena']) || !isset($data['id_area']) || !isset($data['estado'])) {
    echo json_encode(["success" => false, "message" => "Datos incompletos"]);
    exit;
}

// Verificar si el id_area existe en la tabla areas
$query = "SELECT id FROM areas WHERE id = ?";
$stmt = $conn->prepare($query);
$stmt->bind_param("i", $data['id_area']);
$stmt->execute();
$stmt->store_result();

if ($stmt->num_rows == 0) {
    echo json_encode(["success" => false, "message" => "Error: El área especificada no existe"]);
    $stmt->close();
    exit;
}

$stmt->close(); // Cierra la consulta anterior

// Verificar si el estado es válido (activo o inactivo)
$estado_validos = ['Activo', 'Inactivo'];
if (!in_array($data['estado'], $estado_validos)) {
    echo json_encode(["success" => false, "message" => "Error: El estado debe ser 'activo' o 'inactivo'"]);
    exit;
}

// Verificar si el usuario ya existe
$query = "SELECT id FROM usuarios WHERE nombre_usuario = ?";
$stmt = $conn->prepare($query);
$stmt->bind_param("s", $data['nombre_usuario']);
$stmt->execute();
$stmt->store_result();

if ($stmt->num_rows > 0) {
    echo json_encode(["success" => false, "message" => "Error: El usuario ya existe"]);
    $stmt->close();
    exit;
}

$stmt->close(); // Cierra la consulta anterior

// Insertar usuario si no existe
$query = "INSERT INTO usuarios (nombre_usuario, contrasena, id_area, estado) VALUES (?, ?, ?, ?)";
$stmt = $conn->prepare($query);

if ($stmt) {
    $stmt->bind_param("ssis", $data['nombre_usuario'], $data['contrasena'], $data['id_area'], $data['estado']);
    
    if ($stmt->execute()) {
        echo json_encode(["success" => true, "message" => "Usuario agregado correctamente"]);
    } else {
        echo json_encode(["success" => false, "message" => "Error al agregar usuario"]);
    }

    $stmt->close();
} else {
    echo json_encode(["success" => false, "message" => "Error en la consulta"]);
}

$conn->close();
?>
