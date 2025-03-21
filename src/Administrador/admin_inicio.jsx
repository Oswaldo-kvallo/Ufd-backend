import React, { useCallback } from 'react';
import { useNavigate } from "react-router-dom";
import '../StylesAdmin/admin_inicio.css';
import { Link } from 'react-router-dom';

// Iconos
import { FaHome, FaUsers } from "react-icons/fa";
import { TfiWorld } from "react-icons/tfi";
import { RiLogoutCircleLine } from "react-icons/ri";
import { RxLapTimer } from "react-icons/rx";

const AdminInicio = () => {
  console.log("🔥 AdminInicio se ha renderizado!");
  const navigate = useNavigate();

  // 🔥 useCallback para evitar recreación innecesaria
  const handleLogout = useCallback(async () => {
    console.log("🔥 handleLogout() fue llamado!");

    try {
      console.log("🔍 Verificando sesión antes de cerrar...");
      const authResponse = await fetch('http://localhost/2da%20copia%20backend/backend/login3/auth.php', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });

      console.log("🔍 authResponse recibido:", authResponse);
      if (!authResponse.ok) throw new Error("Error en la autenticación");

      const authResult = await authResponse.json();
      console.log("🔍 authResult:", authResult);

      if (!authResult.success) {
        alert("No hay sesión activa.");
        return;
      }

      console.log("✅ Sesión activa, procediendo con logout...");

      const logoutResponse = await fetch('http://localhost/2da%20copia%20backend/backend/login3/logout.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });

      console.log("🔍 Respuesta del logout:", logoutResponse);
      if (!logoutResponse.ok) throw new Error("Error en el logout");

      const logoutResult = await logoutResponse.json();
      console.log("✅ Respuesta JSON del logout:", logoutResult);

      if (logoutResult.success) {
        alert(logoutResult.message);
        localStorage.removeItem('userRole'); // 🔥 Asegurar limpiar localStorage
        navigate('/'); // 🔥 Redirigir correctamente con React Router
      } else {
        alert("❌ Error en logout: " + logoutResult.message);
      }

    } catch (error) {
      console.error("❌ Error en logout:", error);
      alert("Hubo un error al intentar cerrar sesión.");
    }
  }, [navigate]); // ✅ Dependencia correcta para mantener la referencia

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

          <Link to={'/admin_acceso'} className="action">
            <RxLapTimer className="action-icon" color="#353866" />
            <span className="action-content" data-content="Mis Accesos" />
          </Link>

          <Link to={'/admin_registros'} className="action">
            <FaUsers className="action-icon" color="#353866" />
            <span className="action-content" data-content="Registro de Accesos" />
          </Link>

          {/* 🔥 Reemplazar button+ref por un onClick directo */}
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