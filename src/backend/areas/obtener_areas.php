<?php
session_start();
include '../db.php';
//require '../headers.php';
header('Content-Type: application/json');
//ya habia quedado pero ahora tuve que poner los headers y los dos ifs, ah el session start al inicio
// ✅ Configurar CORS correctamente
header("Access-Control-Allow-Origin: http://localhost:5173"); // Especifica el origen exacto
header("Access-Control-Allow-Credentials: true"); // Permitir envío de cookies y sesiones
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
// 🔹 Manejo de preflight (opcional pero recomendable)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

// Verificar sesión
if (!isset($_SESSION['usuario_id'])) {
    echo json_encode(["success" => false, "message" => "Acceso no autorizado"]);
    exit;
}

$conn = new mysqli("localhost", "root", "", "baseconbackend");

if ($conn->connect_error) {
    die(json_encode([
"success" => false, "message" => "Error de conexión a la base de datos"]));
}

//El anterior si no sirve el nuevo descomenta este
/*$sql = "SELECT * FROM areas";
 */
//El nuevo(hoy 26 de febrero voy a modificar la linea sql ya que nomas agrega datos de la tabla areas y de usuarion no manda nada)
//Asi estaba antes ($sql = "SELECT id, nombre_area FROM areas";)
$sql = "SELECT areas.id, areas.nombre_area, usuarios.nombre_usuario, usuarios.contrasena 
        FROM areas 
        LEFT JOIN usuarios ON areas.id = usuarios.id_area";
$result = $conn->query($sql);

$areas = [];
while ($row = $result->fetch_assoc()) {
    $areas[] = $row;
}
//Nuevo codigo (cambie esto: $result->num_rows, por esto:count($areas))
if (count($areas) > 0) {
    /*while ($row = $result->fetch_assoc()) {
        $areas[] = $row;
    }*/
    echo json_encode(["success" => true, "areas" => $areas]);
} else {
    echo json_encode(["success" => false, "message" => "No se encontraron áreas"]);
}
//comentare esto
// echo json_encode(["success" => true, "areas" => $areas]);

$conn->close();
?>
