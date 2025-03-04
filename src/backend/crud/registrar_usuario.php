<?php
include '../db.php';

$conn = new mysqli("localhost", "root", "", "baseconbackend");

if ($conn->connect_error) {
    die(json_encode(["success" => false, "message" => "Error de conexión a la base de datos"]));
}

$nombre_usuario = trim($_POST['nombre_usuario']);
$contrasena = password_hash($_POST['contrasena'], PASSWORD_DEFAULT);
$id_area = $_POST['id_area'];

if (empty($nombre_usuario) || empty($_POST['contrasena']) || empty($id_area)) {
    echo json_encode(["success" => false, "message" => "Todos los campos son obligatorios"]);
    exit;
}

// Verificar si el usuario ya existe
$sql_check = "SELECT id FROM usuarios WHERE nombre_usuario = ?";
$stmt_check = $conn->prepare($sql_check);
$stmt_check->bind_param("s", $nombre_usuario);
$stmt_check->execute();
$stmt_check->store_result();

if ($stmt_check->num_rows > 0) {
    echo json_encode(["success" => false, "message" => "El usuario ya existe"]);
} else {
    // Insertar usuario
    $sql = "INSERT INTO usuarios (nombre_usuario, contrasena, id_area, estado) VALUES (?, ?, ?, ?)";
    $stmt = $conn->prepare($sql);
    $estado = "Activo";  // Establece el estado por defecto como "Activo"
    $stmt->bind_param("ssis", $nombre_usuario, $contrasena, $id_area, $estado);


    if ($stmt->execute()) {
        echo json_encode(["success" => true, "message" => "Usuario registrado correctamente"]);
    } else {
        echo json_encode(["success" => false, "message" => "Error al registrar el usuario"]);
    }
}

$stmt_check->close();
$stmt->close();
$conn->close();
?>
