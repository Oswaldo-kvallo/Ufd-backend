import React, { useCallback } from 'react';
import { useNavigate } from "react-router-dom";
import '../StylesAdmin/admin_inicio.css';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';

// Iconos
import { FaHome, FaUsers } from "react-icons/fa";
import { TfiWorld } from "react-icons/tfi";
import { RiLogoutCircleLine } from "react-icons/ri";

const AdminInicio = () => {
  console.log("🔥 AdminInicio se ha renderizado!");
  const navigate = useNavigate();

  const handleLogout = useCallback(async () => {
    console.log("🔥 handleLogout() fue llamado!");

    try {
      console.log("🔍 Verificando sesión antes de cerrar...");
      const authResponse = await fetch('http://localhost/2da%20copia%20backend/backend/login3/auth.php', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });

      if (!authResponse.ok) throw new Error("Error en la autenticación");

      const authResult = await authResponse.json();
      if (!authResult.success) {
        Swal.fire({
          title: 'No hay sesión activa',
          text: 'Parece que ya habías cerrado sesión.',
          icon: 'info',
          confirmButtonText: 'Aceptar'
        });
        return;
      }

      console.log("✅ Sesión activa, procediendo con logout...");

      const logoutResponse = await fetch('http://localhost/2da%20copia%20backend/backend/login3/logout.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });

      if (!logoutResponse.ok) throw new Error("Error en el logout");

      const logoutResult = await logoutResponse.json();

      if (logoutResult.success) {
        // Mostrar alerta de cierre de sesión exitoso
        Swal.fire({
          title: 'Sesión cerrada',
          text: 'Tu sesión se ha cerrado correctamente.',
          icon: 'success',
          confirmButtonText: 'Aceptar'
        }).then(() => {
          localStorage.removeItem('userRole'); // Limpiar localStorage
          navigate('/'); // Redirigir a la página de inicio
        });
      } else {
        Swal.fire({
          title: 'Error al cerrar sesión',
          text: logoutResult.message,
          icon: 'error',
          confirmButtonText: 'Intentar de nuevo'
        });
      }

    } catch (error) {
      console.error("❌ Error en logout:", error);
      Swal.fire({
        title: 'Error',
        text: 'Hubo un error al intentar cerrar sesión.',
        icon: 'error',
        confirmButtonText: 'Aceptar'
      });
    }
  }, [navigate]);

  return (
    <div>
      <div className="w-screen h-screen bg-baseazul flex items-center justify-center relative">
        <img src="./public/Logo.png" alt="Logo" className="absolute inset-0 m-auto object-cover z-0" />

        {/* Menú izquierdo */}
        <div className="action-wrap bg-basenaranja z-10 flex flex-col items-start absolute left-3">

          <Link to={'/admin_inicio'} className="action">
            <FaHome className="action-icon" color="#353866" />
            <span className="action-content" data-content="Inicio" />
          </Link>

          <Link to={'/admin_areas'} className="action">
            <TfiWorld className="action-icon" color="#353866" />
            <span className="action-content" data-content="Áreas" />
          </Link>

          <Link to={'/admin_registros'} className="action">
            <FaUsers className="action-icon" color="#353866" />
            <span className="action-content" data-content="Registro de Accesos" />
          </Link>

          {/* Botón de logout con alerta */}
          <button className="action" onClick={handleLogout}>
            <RiLogoutCircleLine className="action-icon" color="#353866" />
            <span className="action-content" data-content="Salir" />
          </button>
        </div>
      </div>  
    </div>
  );
};

export default AdminInicio;
