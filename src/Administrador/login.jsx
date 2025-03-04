import React, { useState } from 'react';//Le agregue esto , { useState }
import '../StylesAdmin/login.css';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/api'; //Le implemente esto
/*import { useHistory } from 'react-router-dom';*///Le implemente esto

// Iconos
import { FaUserCircle } from "react-icons/fa";
import { MdOutlinePassword } from "react-icons/md";

const Login = () => {
  //Modificacion de acuerdo a chat
  const [nombre_usuario, setNombreUsuario] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  //Hasta aqui la modificacion
  const navigate = useNavigate();

  //handleSubmit anterior con claude
  /* const handleSubmit = (event) => {
    event.preventDefault();
    navigate("/admin_inicio");
  }; */
  //Este es el nuevo de acuerdo con chat
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      // Llamamos al servicio de login
      const response = await authService.login(nombre_usuario, contrasena);
      console.log(response);//lo agregue si no funciona borrar
      //Modificacion
      
      // Si la respuesta es exitosa, redirigimos
      if (response.success) {
        // Si la autenticación es exitosa, almacenar los datos en localStorage
        localStorage.setItem('token', response.token);  // Guarda el token (Nueva implementacion)  
      localStorage.setItem('userRole', response.rol);
      localStorage.setItem('userName', response.nombre_usuario);
      localStorage.setItem('userId', response.usuario_id);
        navigate('/admin_inicio');
      } else {
        setErrorMessage('Usuario o contraseña incorrectos');
      }
    } catch (error) {
      // Si ocurre un error, mostramos un mensaje de error
      setErrorMessage('Usuario o contraseña incorrectos');
    }
  };

  return (
    <div>
      <div className='flex w-screen'>
        {/* Lado izquierdo con logo */}
        <div className='w-[50%] h-screen bg-baseazul flex items-center justify-center'>
          <img src="./public/Logo.png" alt="Logo" />
        </div>

        {/* Lado derecho con formulario de sesion */}
        <div className='w-[50%] h-screen bg-basenaranja flex items-center justify-center'>
          <form className="form_main" onSubmit={handleSubmit}>
            <p className="heading">Acceso Administrador</p>
            <div className="inputContainer">
              <FaUserCircle className="inputIcon" width={20} height={20} fill="#ED6B06" />
              <input type="text" className="inputField" id="username" placeholder="Usuario" value={nombre_usuario} onChange={(e)=> setNombreUsuario(e.target.value)}/>
            </div>
            <div className="inputContainer">
              <MdOutlinePassword className="inputIcon" width={20} height={20} fill="#ED6B06" />
              <input type="password" className="inputField" id="password" placeholder="Contraseña" value={contrasena} onChange={(e)=> setContrasena(e.target.value)}/>
            </div>
            {errorMessage && <p className="error">{errorMessage}</p>} {/* Muestra mensaje de error */}
            <button id="button" type="submit">Acceder</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;