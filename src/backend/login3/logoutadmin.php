<?php
session_start();
include '../db.php';

if (isset($_SESSION['id_usuario']) && $_SESSION['rol'] === 'administrador') {
    $id_admin = $_SESSION['id_usuario'];

    // Actualizar la fecha de salida del último acceso
    $stmt = $conn->prepare("UPDATE accesos_admin SET fecha_salida = NOW() WHERE id_admin = ? AND fecha_salida IS NULL ORDER BY fecha_entrada DESC LIMIT 1");
    $stmt->bind_param("i", $id_admin);
    $stmt->execute();
    $stmt->close();
}
// Cerrar sesión
session_destroy();
header("Location: login.php");
exit();
?>