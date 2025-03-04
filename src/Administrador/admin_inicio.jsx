import React, { useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import '../StylesAdmin/admin_inicio.css';
import { authService } from '../services/api';
import { Link } from 'react-router-dom';

// Iconos
import { FaHome, FaUsers } from "react-icons/fa";
import { TfiWorld } from "react-icons/tfi";
import { RiLogoutCircleLine } from "react-icons/ri";
import { RxLapTimer } from "react-icons/rx";

const AdminInicio = () => {
  const navigate = useNavigate();

  const handleLogout = async (e) => {
    e.preventDefault();
    try {
      await authService.logout(); // Llama a la función de logout en api.js
      navigate("/"); // Redirige al login después de cerrar sesión
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  useEffect(() => {
    const checkSession = async () => {
      try {
        const userRole = localStorage.getItem('userRole');
        if (!userRole) {
          throw new Error('Acceso no autorizado');
        }
        
        if (userRole !== 'Administrador') {
          throw new Error('Acceso no autorizado');
        }
      } catch (error) {
        console.error('Error en autenticación:', error);
        navigate('/'); // Redirigir al login
      }
    };
  
    checkSession();
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

          <Link to={'/admin_acceso'} className="action">
            <RxLapTimer className="action-icon" color="#353866" />
            <span className="action-content" data-content="Mis Accesos" />
          </Link>

          <Link to={'/admin_registros'} className="action">
            <FaUsers className="action-icon" color="#353866" />
            <span className="action-content" data-content="Registro de Accesos" />
          </Link>

          <Link to={'/'} className="action" onClick={handleLogout}>
            <RiLogoutCircleLine className="action-icon" color="#353866" />
            <span className="action-content" data-content="Salir" />
          </Link>

        </div>
      </div>  
    </div>
  );
};

export default AdminInicio;
