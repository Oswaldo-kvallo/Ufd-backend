import React, { useCallback } from 'react';
import { useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';
import '../StylesAlimentador/alimentador_recopilacion.css';
import { Link } from 'react-router-dom';

{/* Iconos Menu */}
import { FaHome } from "react-icons/fa";
import { BiSolidCollection } from "react-icons/bi";
import { IoMdCloudUpload } from "react-icons/io";
import { TbCategoryPlus } from "react-icons/tb";
import { RiLogoutCircleLine } from "react-icons/ri";

// Iconos Recopilacion
import { VscFileSubmodule } from "react-icons/vsc"; 
import { GrDocumentUpdate } from "react-icons/gr";
import { CiLink } from "react-icons/ci";
import { TbTextRecognition } from "react-icons/tb";

const AlimentadorRecopilacion = () => {
  console.log("🔥 AlimentadorRecopilacion se ha renderizado!");
  const navigate = useNavigate();

  // ✅ useCallback para optimizar
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
        Swal.fire({
          title: 'Sesión cerrada',
          text: 'Has cerrado sesión exitosamente.',
          icon: 'success',
          confirmButtonText: 'Aceptar'
        }).then(() => {
          localStorage.removeItem('userRole');
          navigate('/');
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
      <div className='w-screen h-screen bg-baseazul flex'>
        <div className="w-[6%] h-screen bg-baseazul flex items-center justify-center relative">

          {/* Menú izquierdo */}
          <div className="action-wrap bg-basenaranja z-10 flex flex-col items-start absolute left-3">

            <Link to={'/alimentador_inicio'} className="action">
              <FaHome className="action-icon" color="#353866" />
              <span className="action-content" data-content="Inicio" />
            </Link>

            <Link to={'/alimentador_recopilacion'} className="action">
              <BiSolidCollection className="action-icon" color="#353866" />
              <span className="action-content" data-content="Recopilación" />
            </Link>

            <Link to={''} className="action">
              <IoMdCloudUpload className="action-icon" color="#353866" />
              <span className="action-content" data-content="Publicaciones" />
            </Link>

            <Link to={''} className="action">
              <TbCategoryPlus className="action-icon" color="#353866" />
              <span className="action-content" data-content="Categorías" />
            </Link>

            <button className="action" onClick={handleLogout}>
              <RiLogoutCircleLine className="action-icon" color="#353866" />
              <span className="action-content" data-content="Salir" />
            </button>

          </div>
        </div>

        <div className='w-[94%] h-screen'>
          {/* Título */}
          <div className='titulo-recopilacion w-[100%] h-[15%]'>
            <h1 className='titulo-recopilaciones'>Recopilaciones del Usuario</h1>
          </div>

          {/* Sección de Recopilación */}
          <div className='w-[100%] h-[40%] flex justify-center'>
            <div className="cards w-[75%] h-[65%] mt-10">

              <div className="card resumen">
                <div>
                  <IoMdCloudUpload className='w-[50px] h-[50px] ml-[65px] text-basenaranja' />
                  <p className="tip">Publicaciones</p>
                  <p className="second-text">120 publicaciones actualmente</p>
                </div>
              </div>

              <div className="card resumen">
                <div>
                  <TbCategoryPlus className='w-[40px] h-[40px] ml-[58px] text-basenaranja' />
                  <p className="tip">Categorías</p>
                  <p className="second-text">20 categorías actualmente</p>
                </div>
              </div>

              <div className="card resumen">
                <div>
                  <VscFileSubmodule className='w-[40px] h-[40px] ml-[45px] text-basenaranja' />
                  <p className="tip">Temas</p>
                  <p className="second-text">59 temas actualmente</p>
                </div>
              </div>

            </div>
          </div>

          <div className='w-[100%] h-[40%] flex justify-center'>
            <div className="cards w-[75%] h-[65%] mt-10">

              <div className="card resumen">
                <div>
                  <GrDocumentUpdate className='w-[35px] h-[35px] ml-[65px] text-basenaranja' />
                  <p className="tip">Documentos</p>
                  <p className="second-text">32 documentos actualmente</p>
                </div>
              </div>

              <div className="card resumen">
                <div>
                  <CiLink className='w-[40px] h-[40px] ml-[40px] text-basenaranja' />
                  <p className="tip">Enlaces</p>
                  <p className="second-text">49 enlaces actualmente</p>
                </div>
              </div>

              <div className="card resumen">
                <div>
                  <TbTextRecognition className='w-[40px] h-[40px] ml-[70px] text-basenaranja' />
                  <p className="tip">Palabras Clave</p>
                  <p className="second-text">87 palabras clave actualmente</p>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlimentadorRecopilacion;
