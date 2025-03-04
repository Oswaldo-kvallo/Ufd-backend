<?php
session_start();
include 'db.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $nombre_usuario = $_POST["nombre_usuario"];
    $contrasena = $_POST["contrasena"];

    $sql = "SELECT * FROM usuarios WHERE nombre_usuario = ? AND estado = 'Activo'";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("s", $nombre_usuario);
    $stmt->execute();
    $resultado = $stmt->get_result();

    if ($resultado->num_rows == 1) {
        $usuario = $resultado->fetch_assoc();
        
        // Verifica la contraseña
        if (password_verify($contrasena, $usuario["contrasena"])) {
            $_SESSION["admin"] = $usuario["id"];
            echo json_encode(["success" => true, "message" => "Login exitoso"]);
        } else {
            echo json_encode(["success" => false, "message" => "Contraseña incorrecta"]);
        }
    } else {
        echo json_encode(["success" => false, "message" => "Usuario no encontrado o inactivo"]);
    }

    $stmt->close();
    $conn->close();
}
?>
