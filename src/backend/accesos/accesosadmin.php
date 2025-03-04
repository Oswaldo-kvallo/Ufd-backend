<?php
session_start();
include '../db.php';
require '/../xampp/htdocs/UFD Proyecto/Proyecto/backend/headers.php';

header('Content-Type: application/json');
//agregado recientemente
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Credentials: true");

//28 de febrero agregue esto
// echo json_encode(["session" => $_SESSION]);


if (!isset($_SESSION['usuario_id']) || $_SESSION['rol'] != 'Administrador') {
    echo json_encode(["success" => false, "message" => "Acceso no autorizado"]);
    exit;
}

// Conectar a la base de datos
$conn = new mysqli("localhost", "root", "", "baseconbackend");

if ($conn->connect_error) {
    // die(json_encode(["success" => false, "message" => "Error de conexión a la base de datos"]));
    // http_response_code(500);
    echo json_encode(["success" => false, "message" => "Error de conexión a la base de datos"]);
    exit;
}

// Obtener los accesos del administrador desde la base de datos
$query = "SELECT accesos.id, usuarios.nombre_usuario, accesos.fecha_ingreso, accesos.fecha_salida
          FROM accesos
          JOIN usuarios ON accesos.usuario_id = usuarios.id
          WHERE usuarios.id = ?";

$stmt = $conn->prepare($query);
$stmt->bind_param("i", $_SESSION['usuario_id']);
$stmt->execute();
$result = $stmt->get_result();

// 28 de febrero
/*if (!$result) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Error en la consulta SQL"]);
    $stmt->close();
    $conn->close();
    exit;
}*/

// Verificar que la consulta retornó datos
$accesos = [];
while ($row = $result->fetch_assoc()) {
    // Asegúrate de formatear las fechas correctamente
    $row['fecha_ingreso'] = date('Y-m-d H:i:s', strtotime($row['fecha_ingreso']));
    $row['fecha_salida'] = date('Y-m-d H:i:s', strtotime($row['fecha_salida']));
    //$row['fecha_salida'] = !empty($row['fecha_salida']) ? date('Y-m-d H:i:s', strtotime($row['fecha_salida'])) : "En sesión";
    $accesos[] = $row;
}

// Cerrar la conexión
$stmt->close();
$conn->close();
// Devolver los datos en formato JSON
echo json_encode([
    "success" => true,
    "session" => [
        "usuario_id" => $_SESSION['usuario_id'],
        "nombre_usuario" => $_SESSION['nombre_usuario'],
        "rol" => $_SESSION['rol']
    ],
    "accesos" => $accesos
]);
exit;
?>
