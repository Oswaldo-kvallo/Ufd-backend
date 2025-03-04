<?php
//28 de enero agregue esto
ini_set('session.cookie_samesite', 'None'); // Permitir compartir la cookie entre dominios
ini_set('session.cookie_secure', '1');      // Asegurar que la cookie solo se envíe en HTTPS (si usas HTTPS)
ini_set('session.cookie_httponly', '1');    // Evitar que JavaScript acceda a la cookie

session_start();
include '../db.php';

header('Content-Type: application/json');

$conn = new mysqli("localhost", "root", "", "baseconbackend");

if ($conn->connect_error) {
    echo json_encode(["success" => false, "message" => "Error de conexión a la base de datos"]);
    exit;
}

// Obtener datos del formulario o JSON
$data = json_decode(file_get_contents("php://input"), true);

if ($data) {
    $nombre_usuario = trim(htmlspecialchars($data['nombre_usuario'] ?? ''));
    $contrasena = $data['contrasena'] ?? '';
} else {
    $nombre_usuario = trim(htmlspecialchars($_POST['nombre_usuario'] ?? ''));
    $contrasena = $_POST['contrasena'] ?? '';
}

// Validar que los campos no estén vacíos
if (empty($nombre_usuario) || empty($contrasena)) {
    echo json_encode(["success" => false, "message" => "Faltan datos"]);
    exit;
}

// Verificar si el usuario existe
$sql = "SELECT id, nombre_usuario, contrasena FROM usuarios WHERE nombre_usuario = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $nombre_usuario);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    $row = $result->fetch_assoc();

    // Verificar la contraseña (si está encriptada en la BD con password_hash)
    if ($contrasena === $row['contrasena']) {
        //28 de enero agregue esto
        session_regenerate_id(true); // 🔥 Regenerar ID de sesión para evitar ataques de fijación de sesión
        $_SESSION['usuario_id'] = $row['id'];
        $_SESSION['nombre_usuario'] = $row['nombre_usuario'];

        echo json_encode(["success" => true, "message" => "Inicio de sesión exitoso"]);
    } else {
        echo json_encode(["success" => false, "message" => "Contraseña incorrecta"]);
    }
} else {
    echo json_encode(["success" => false, "message" => "Usuario no encontrado"]);
}

$stmt->close();
$conn->close();
?>
