<?php
session_start();
header('Content-Type: application/json');

if (!isset($_SESSION['usuario_id'])) {
    echo json_encode(["success" => false, "message" => "Acceso no autorizado"]);
    exit;
}

// Si llega aquí, la sesión está activa
echo json_encode(["success" => true, "message" => "Sesión activa"]);
?>

