import React, { useState } from 'react';
import '../StylesAdmin/login.css';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import Swal from 'sweetalert2';

// Iconos
import { FaUserCircle } from "react-icons/fa";
import { MdOutlinePassword } from "react-icons/md";

const Login = () => {
  const [nombre_usuario, setNombreUsuario] = useState('');
  const [contrasena, setContrasena] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await authService.login(nombre_usuario, contrasena);
      console.log(response); // Para depuración

      if (response.success) {
        // Guardamos datos en localStorage
        localStorage.setItem('token', response.token);
        localStorage.setItem('userRole', response.rol);
        localStorage.setItem('userName', response.nombre_usuario);
        localStorage.setItem('userId', response.usuario_id);

        // Mostrar alerta de éxito
        Swal.fire({
          title: '¡Bienvenido!',
          text: `¡Has iniciado sesión correctamente!.`,
          icon: 'success',
          confirmButtonText: 'Aceptar',
          timer: 2000, // Se cierra automáticamente en 2 segundos
          showConfirmButton: false
        });

        // Redirigir según el rol después de la alerta
        setTimeout(() => {
          if (response.rol === 'Administrador') {
            navigate('/admin_inicio');
          } else if (response.rol === 'Alimentador') {
            navigate('/alimentador_inicio');
          }
        }, 2000);
      } else {
        // Mostrar alerta de error si la autenticación falla
        Swal.fire({
          title: 'Error',
          text: response.message,
          icon: 'error',
          confirmButtonText: 'Intentar de nuevo'
        });
      }
    } catch (error) {
      Swal.fire({
        title: 'Error en la autenticación',
        text: 'Intente nuevamente.',
        icon: 'error',
        confirmButtonText: 'Aceptar'
      });
    }
  };

  return (
    <div>
      <div className='flex w-screen'>
        {/* Lado izquierdo con logo */}
        <div className='w-[50%] h-screen bg-baseazul flex items-center justify-center'>
          <img src="./public/Logo.png" alt="Logo" />
        </div>

        {/* Lado derecho con formulario de sesión */}
        <div className='w-[50%] h-screen bg-basenaranja flex items-center justify-center'>
          <form className="form_main" onSubmit={handleSubmit}>
            <p className="heading">Acceso UFD Sistema</p>
            <div className="inputContainer">
              <FaUserCircle className="inputIcon" width={20} height={20} fill="#ED6B06" />
              <input type="text" className="inputField" id="username" placeholder="Usuario" value={nombre_usuario} onChange={(e)=> setNombreUsuario(e.target.value)}/>
            </div>
            <div className="inputContainer">
              <MdOutlinePassword className="inputIcon" width={20} height={20} fill="#ED6B06" />
              <input type="password" className="inputField" id="password" placeholder="Contraseña" value={contrasena} onChange={(e)=> setContrasena(e.target.value)}/>
            </div>
            <button id="button" type="submit">Acceder</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
