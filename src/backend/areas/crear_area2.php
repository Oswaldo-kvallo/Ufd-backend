<?php
ob_start(); // Inicia el buffer de salida
error_reporting(0); // Oculta advertencias y notices
ini_set('display_errors', 0);
header("Content-Type: application/json");

include '../db.php';
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}


$conn = new mysqli("localhost", "root", "", "baseconbackend");

if ($conn->connect_error) {
    ob_clean();
    die(json_encode(["success" => false, "message" => "Error de conexión a la base de datos"]));
}

// Obtener datos del JSON enviado desde el frontend
$data = json_decode(file_get_contents("php://input"), true);

$nombre_area = isset($data['nombre_area']) ? trim($data['nombre_area']) : '';
$nombre_usuario = isset($data['nombre_usuario']) ? trim($data['nombre_usuario']) : '';
$contrasena = isset($data['contrasena']) ? trim($data['contrasena']) : '';
$id_area = isset($data['id_area']) ? intval($data['id_area']) : null; // Puede ser NULL si no se envía

if (empty($nombre_usuario) || empty($contrasena)) {
    ob_clean();
    echo json_encode(["success" => false, "message" => "El nombre de usuario y la contraseña son obligatorios"]);
    exit;
}

$conn->begin_transaction();

try {
    if (!empty($id_area)) {
        // 🔹 Verificar si el ID de área ya existe
        $sql_check_area = "SELECT nombre_area FROM areas WHERE id = ?";
        $stmt_check = $conn->prepare($sql_check_area);
        $stmt_check->bind_param("i", $id_area);
        $stmt_check->execute();
        $stmt_check->store_result();

        if ($stmt_check->num_rows > 0) { 
            // Si el área ya existe, verificamos si el nombre es diferente
            $stmt_check->bind_result($existing_nombre_area);
            $stmt_check->fetch();
            if ($existing_nombre_area !== $nombre_area) // {
                ob_clean();
                echo json_encode([
                    "success" => false,
                    "message" => "Error: El ID de área ya existe con otro nombre ('$existing_nombre_area')"
                ]);
                exit;
            //}
        } else {
            // 🔹 Si el ID no existe, lo insertamos manualmente en `areas`
            $sql_insert_area = "INSERT INTO areas (id, nombre_area) VALUES (?, ?)";
            $stmt_area = $conn->prepare($sql_insert_area);
            $stmt_area->bind_param("is", $id_area, $nombre_area);
            $stmt_area->execute();
        }
        $stmt_check->close();
    } else {
        if (empty($nombre_area)) {
            ob_clean();
            echo json_encode(["success" => false, "message" => "Debe proporcionar un nombre de área o un ID de área"]);
            exit;
        }

        // 🔹 Insertar el área con un ID automático
        $sql_insert_area = "INSERT INTO areas (nombre_area) VALUES (?)";
        $stmt_area = $conn->prepare($sql_insert_area);
        $stmt_area->bind_param("s", $nombre_area);
        $stmt_area->execute();
        $id_area = $stmt_area->insert_id; // Obtener el ID recién creado
    }

    // 🔹 Insertar el usuario en `usuarios`
    $sql_insert_usuario = "INSERT INTO usuarios (nombre_usuario, contrasena, id_area) VALUES (?, ?, ?)";
    $stmt_usuario = $conn->prepare($sql_insert_usuario);
    $stmt_usuario->bind_param("ssi", $nombre_usuario, $contrasena, $id_area);
    $stmt_usuario->execute();

    $conn->commit();
    ob_clean();
    echo json_encode(["success" => true, "message" => "Área y usuario creados correctamente"]);

} catch (Exception $e) {
    $conn->rollback();
    ob_clean();
    echo json_encode(["success" => false, "message" => "Error al crear área y usuario", "error" => $e->getMessage()]);
}

$conn->close();
?>
