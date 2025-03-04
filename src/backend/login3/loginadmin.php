<?php
session_start();
include '../db.php'; // Asegúrate de incluir la conexión a la base de datos

if (isset($_SESSION['id_usuario']) && $_SESSION['rol'] === 'administrador') {
    $id_admin = $_SESSION['id_usuario'];

    // Insertar un nuevo acceso (entrada)
    $stmt = $conn->prepare("INSERT INTO accesos_admin (id_admin, fecha_entrada) VALUES (?, NOW())");
    $stmt->bind_param("i", $id_admin);
    $stmt->execute();
    $stmt->close();
}
?>