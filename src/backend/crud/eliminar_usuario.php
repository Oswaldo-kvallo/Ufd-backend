<?php
include '../db.php';

$conn = new mysqli("localhost", "root", "", "baseconbackend");

if ($conn->connect_error) {
    die(json_encode(["success" => false, "message" => "Error de conexión a la base de datos"]));
}

$id = $_POST['id'];

if (empty($id)) {
    echo json_encode(["success" => false, "message" => "El ID del usuario es obligatorio"]);
    exit;
}

// Verificar si el usuario existe
$sql_check = "SELECT id FROM usuarios WHERE id = ?";
$stmt_check = $conn->prepare($sql_check);
$stmt_check->bind_param("i", $id);
$stmt_check->execute();
$stmt_check->store_result();

if ($stmt_check->num_rows === 0) {
    echo json_encode(["success" => false, "message" => "El usuario no existe"]);
} else {
    // Eliminar usuario
    $sql = "DELETE FROM usuarios WHERE id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $id);

    if ($stmt->execute()) {
        echo json_encode(["success" => true, "message" => "Usuario eliminado correctamente"]);
    } else {
        echo json_encode(["success" => false, "message" => "Error al eliminar el usuario"]);
    }
}

$stmt_check->close();
$stmt->close();
$conn->close();
?>
