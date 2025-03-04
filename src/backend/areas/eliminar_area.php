<?php
include '../db.php';

$conn = new mysqli("localhost", "root", "", "baseconbackend");

if ($conn->connect_error) {
    die(json_encode(["success" => false, "message" => "Error de conexión a la base de datos"]));
}

$id = $_POST['id'];

if (empty($id)) {
    echo json_encode(["success" => false, "message" => "El ID del área es obligatorio"]);
    exit;
}

// Verificar si el área tiene usuarios asociados
$sql_check_users = "SELECT id FROM usuarios WHERE id_area = ?";
$stmt_check_users = $conn->prepare($sql_check_users);
$stmt_check_users->bind_param("i", $id);
$stmt_check_users->execute();
$stmt_check_users->store_result();

if ($stmt_check_users->num_rows > 0) {
    echo json_encode(["success" => false, "message" => "No se puede eliminar el área porque tiene usuarios asignados"]);
} else {
    // Verificar si el área existe
    $sql_check_area = "SELECT id FROM areas WHERE id = ?";
    $stmt_check_area = $conn->prepare($sql_check_area);
    $stmt_check_area->bind_param("i", $id);
    $stmt_check_area->execute();
    $stmt_check_area->store_result();

    if ($stmt_check_area->num_rows === 0) {
        echo json_encode(["success" => false, "message" => "El área no existe"]);
    } else {
        // Eliminar el área
        $sql_delete = "DELETE FROM areas WHERE id = ?";
        $stmt_delete = $conn->prepare($sql_delete);
        $stmt_delete->bind_param("i", $id);

        if ($stmt_delete->execute()) {
            echo json_encode(["success" => true, "message" => "Área eliminada correctamente"]);
        } else {
            echo json_encode(["success" => false, "message" => "Error al eliminar el área"]);
        }
        $stmt_delete->close();
    }
    $stmt_check_area->close();
}

$stmt_check_users->close();
$conn->close();
?>
