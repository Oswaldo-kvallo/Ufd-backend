<?php
//4 de marzo
error_reporting(E_ALL);
ini_set('display_errors', 1);

include '../db.php';
require '/../xampp/htdocs/UFD Proyecto/Proyecto/backend/headers.php';

header("Access-Control-Allow-Origin: *"); 
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS"); 
header("Access-Control-Allow-Headers: Content-Type, Authorization"); 
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// 📌 DEBUG: Verifica que el método PUT está siendo reconocido
if ($_SERVER['REQUEST_METHOD'] !== 'PUT') {
    echo json_encode(["error" => "Método no permitido", "method" => $_SERVER['REQUEST_METHOD']]);
    http_response_code(405);
    exit();
}

// 📌 Lee el JSON del cuerpo de la solicitud
$input = file_get_contents("php://input");
$data = json_decode($input, true);

// 🔍 Guarda los datos en un archivo para depuración
file_put_contents(__DIR__ . "/log_backend.txt", print_r($data, true));

if (!$data) {
    echo json_encode(["success" => false, "message" => "Error: No se recibieron datos JSON"]);
    exit;
}

// 📌 Obtenemos los datos (pueden ser opcionales)
$id_area = $data["id_area"] ?? null;
$nombre_area = $data["nombre_area"] ?? null;
$id = $data["id"] ?? null;
$nombre_usuario = $data["nombre_usuario"] ?? null;
$contrasena = $data["contrasena"] ?? null;

// 📌 Validar que al menos se envíe `id_area` o `id_usuario`
if (!$id_area && !$id) {
    echo json_encode(["success" => false, "message" => "Error: Debes enviar al menos un ID de área o de usuario"]);
    exit;
}

// Iniciar transacción
$conn->begin_transaction();

try {
    // 🔄 Actualizar `nombre_area` si fue enviado
    if ($id_area && $nombre_area) {
        // Verificar que el nuevo nombre no exista en otra área
        $query = "SELECT id FROM areas WHERE nombre_area = ? AND id != ?";
        $stmt = $conn->prepare($query);
        $stmt->bind_param("si", $nombre_area, $id_area);
        $stmt->execute();
        $stmt->store_result();

        if ($stmt->num_rows > 0) {
            echo json_encode(["success" => false, "message" => "Error: El nombre de área ya está en uso"]);
            $stmt->close();
            exit;
        }
        $stmt->close();

        // Si pasó la validación, actualizar el área
        $query = "UPDATE areas SET nombre_area = ? WHERE id = ?";
        $stmt = $conn->prepare($query);
        $stmt->bind_param("si", $nombre_area, $id_area);
        $stmt->execute();
        $stmt->close();
    }

    // 🔄 Actualizar solo el usuario especificado
    if ($id) {
        $query_partes = [];
        $parametros = [];
        $tipos = "";

        if (!empty($nombre_usuario)) {
            // Modificacion para que deje que haya usuarios con los mismos nombres
            //4 de marzo
            // Verificar que el nuevo nombre de usuario no exista en otro usuario
            /*
            $query_verificar = "SELECT id FROM usuarios WHERE nombre_usuario = ? AND id != ?";
            $stmt_verificar = $conn->prepare($query_verificar);
            $stmt_verificar->bind_param("si", $nombre_usuario, $id);
            $stmt_verificar->execute();
            $stmt_verificar->store_result();

            if ($stmt_verificar->num_rows > 0) {
                echo json_encode(["success" => false, "message" => "Error: El nombre de usuario ya está en uso"]);
                $stmt_verificar->close();
                exit;
            }
            $stmt_verificar->close();
*/
            $query_partes[] = "nombre_usuario = ?";
            $parametros[] = $nombre_usuario;
            $tipos .= "s";
        }

        if (!empty($contrasena)) {
            $query_partes[] = "contrasena = ?";
            // Asegura la contraseña correctamente $parametros[] = password_hash($contrasena, PASSWORD_DEFAULT); 
            $parametros[] = $contrasena; 
            $tipos .= "s";
        }

        if (!empty($query_partes)) {
            $query = "UPDATE usuarios SET " . implode(", ", $query_partes) . " WHERE id = ?";
            $parametros[] = $id;
            $tipos .= "i";

            $stmt_usuario = $conn->prepare($query);
            $stmt_usuario->bind_param($tipos, ...$parametros);
            $stmt_usuario->execute();
            $stmt_usuario->close();
        }
        //4 de marzo
        // 🔍 Agregar debug para ver si se actualizó algo
    if ($stmt_usuario->affected_rows > 0) {
        echo json_encode(["success" => true, "message" => "Usuario actualizado correctamente"]);
    } else {
        echo json_encode(["success" => false, "message" => "No se realizaron cambios en el usuario"]);
    }

    $stmt_usuario->close();
    }

    // ✅ Confirmar transacción
    $conn->commit();
    echo json_encode(["success" => true, "message" => "Actualización completada"]);

} catch (Exception $e) {
    // ❌ Si hay error, revertir cambios
    $conn->rollback();
    echo json_encode(["success" => false, "message" => "Error en la actualización", "error" => $e->getMessage()]);
}

// 🔄 Cerrar conexión
$conn->close();
?>
