<?php
//Unir con front(borrar si no da despues)
header("Content-Type: application/json");



include '../db.php';
require '../headers.php';

$conn = new mysqli("localhost", "root", "", "baseconbackend");

if ($conn->connect_error) {
    die(json_encode(["success" => false, "message" => "Error de conexión a la base de datos"]));
}

// Obtener datos del formulario(sin conectar al front, por mientras funciona, si no da conectarlo con el front este sirve)
/*$nombre = trim($_POST['nombre_area']);*/
//Aqui ya es conectandolo con el front, si no da borralo
$data = json_decode(file_get_contents("php://input"), true);
$nombre = isset($data['nombre_area']) ? trim($data['nombre_area']) : '';


if (empty($nombre)) {
    echo json_encode(["success" => false, "message" => "El nombre del área es obligatorio"]);
    exit;
}

// Verificar si ya existe un área con ese nombre
$sql_check = "SELECT id FROM areas WHERE nombre_area = ?";
$stmt_check = $conn->prepare($sql_check);
$stmt_check->bind_param("s", $nombre);
$stmt_check->execute();
$stmt_check->store_result();

if ($stmt_check->num_rows > 0) {
    echo json_encode(["success" => false, "message" => "El nombre del área ya existe"]);
} else {
    // Insertar el área si no existe
    $sql_insert = "INSERT INTO areas (nombre_area) VALUES (?)";
    $stmt_insert = $conn->prepare($sql_insert);
    $stmt_insert->bind_param("s", $nombre);

    if ($stmt_insert->execute()) {
        echo json_encode(["success" => true, "message" => "Área creada correctamente"]);
    } else {
        echo json_encode(["success" => false, "message" => "Error al crear el área"]);
    }
    $stmt_insert->close();
}

$stmt_check->close();
$conn->close();
?>
