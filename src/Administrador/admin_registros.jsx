import React, { useState, useEffect } from 'react'
import '../StylesAdmin/admin_registros.css'
import {accessService} from '../services/api';
import NavigationMenu from './NavigationMenu';

{/* Iconos */}
import { FaHome } from "react-icons/fa";
import { TfiWorld } from "react-icons/tfi";
import { RiLogoutCircleLine } from "react-icons/ri";
import { Link } from 'react-router-dom';
import { RxLapTimer } from "react-icons/rx";
import { FaUsers } from "react-icons/fa";

const AdminRegistros = () => {

  // Funcion de la X en los filtros
    const [area, setArea] = useState('');
    const [usuario, setUsuario] = useState('');
    const [dia, setDia] = useState('');
    const [mes, setMes] = useState('');
    const [año, setAño] = useState('');
  
    const handleClear = (setter) => {
      setter('');
    };

    //28 de febrero estado para almacenar los accesos
    const [accesos, setAccesos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [accesosFiltrados, setAccesosFiltrados] = useState([]);


    useEffect(() => {
      const cargarAccesos = async () => {
        try {
          setLoading(true);
          // Usamos el servicio que ya hemos corregido en api.js
          const data = await accessService.getUserAccess();
          console.log("Accesos recibidos:", data);
          setAccesos(data);
          setAccesosFiltrados(data); // Inicialmente todos los accesos están visibles
          setError(null);
        } catch (err) {
          console.error("Error al obtener accesos:", err);
          setError(err.message || "Error al cargar los accesos");
        } finally {
          setLoading(false);
        }
      };
  
      cargarAccesos();
    }, []); // Solo se ejecuta al montar el componente
  
    // Aplicar filtros cuando cambien los valores de los filtros
    useEffect(() => {
      if (!accesos.length) return; // No hacer nada si no hay accesos
  
      let resultado = [...accesos];
  
      // Filtrar por área
      if (area) {
        resultado = resultado.filter(acceso => 
          acceso.area && acceso.area.toLowerCase().includes(area.toLowerCase())
        );
      }
  
      // Filtrar por usuario
      if (usuario) {
        resultado = resultado.filter(acceso => 
          acceso.usuario && acceso.usuario.toLowerCase().includes(usuario.toLowerCase())
        );
      }
  
  // Modificación al filtrado por fecha
  if (dia || mes || año) {
    resultado = resultado.filter(acceso => {
      if (!acceso.fecha_ingreso || acceso.fecha_ingreso === "En sesión") return false;
      
      try {
        // Obtener solo la parte de la fecha (antes de la coma)
        let fechaParts = acceso.fecha_ingreso.split(',')[0]; // Obtiene "14/2/2025"
        
        // Dividir por / en lugar de -
        let [day, month, year] = fechaParts.split('/').map(num => parseInt(num, 10));
        
        // Realizar comparaciones
        if (dia && parseInt(dia, 10) !== day) return false;
        if (mes && parseInt(mes, 10) !== month) return false;
        if (año && parseInt(año, 10) !== year) return false;
        
        return true;
      } catch (error) {
        console.error("Error al procesar fecha:", error, acceso.fecha_ingreso);
        return false;
      }
    });
  }

  
      setAccesosFiltrados(resultado);
    }, [area, usuario, dia, mes, año, accesos]); 
    

  return (
    <div>
      {/* Menú */}
      <div className="w-screen h-screen bg-baseazul flex">
        <div className='w-[6%] h-screen bg-baseazul flex items-center justify-center relative'> 
          <NavigationMenu/>

        </div>

        {/* Titulo */}
        <div className='w-[94%] h-screen'>
          <div className='w-[100%] h-[15%] flex'>
            <h1 id='titulo-registros'>Registros de Accesos Alimentadores</h1>
          </div>

          {/* Buscador */}
          <div className='w-[100%] h-[10%] flex items-center justify-center'>
            <div className="search-panels flex">
            <div className="search-group">
                <input required type="text" name="text" autoComplete="on" className="input-area" value={area} onChange={(e) => setArea(e.target.value)} />
                <label className="enter-label">Área</label>
                <div className="btn-box-x">
                  <button className="btn-cleare" onClick={() => handleClear(setArea)}>
                    <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 384 512"><path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" id="cleare-line" /></svg>
                  </button>
                </div>
              </div>

              <div className="search-group">
                <input required type="text" name="text" autoComplete="on" className="input-usuario" value={usuario} onChange={(e) => setUsuario(e.target.value)} />
                <label className="enter-label">Usuario</label>
                <div className="btn-box-x">
                  <button className="btn-cleare" onClick={() => handleClear(setUsuario)}>
                    <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 384 512"><path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" id="cleare-line" /></svg>
                  </button>
                </div>
              </div>

              <div className="search-group">
                <input required type="text" name="text" autoComplete="on" className="input" value={dia} onChange={(e) => setDia(e.target.value)} />
                <label className="enter-label">Día</label>
                <div className="btn-box-x">
                  <button className="btn-cleare" onClick={() => handleClear(setDia)}>
                    <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 384 512"><path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" id="cleare-line" /></svg>
                  </button>
                </div>
              </div>

              <div className="search-group">
                <input required type="text" name="text" autoComplete="on" className="input" value={mes} onChange={(e) => setMes(e.target.value)} />
                <label className="enter-label">Mes</label>
                <div className="btn-box-x">
                  <button className="btn-cleare" onClick={() => handleClear(setMes)}>
                    <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 384 512"><path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" id="cleare-line" /></svg>
                  </button>
                </div>
              </div>

              <div className="search-group">
                <input required type="text" name="text" autoComplete="on" className="input" value={año} onChange={(e) => setAño(e.target.value)} />
                <label className="enter-label">Año</label>
                <div className="btn-box-x">
                  <button className="btn-cleare" onClick={() => handleClear(setAño)}>
                    <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 384 512"><path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" id="cleare-line" /></svg>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Tabla */}
          <div id='tabla' className='w-[92%] h-[65%] mt-7'>
            <table className='w-[100%]'>
            <thead>
              <tr>
                <th className='border-2 border-basenaranja w-[10%]'>ID</th>
                <th className='border-2 border-basenaranja w-[20%]'>Área</th>
                <th className='border-2 border-basenaranja w-[20%]'>Usuario</th>
                <th className='border-2 border-basenaranja w-[20%]'>Rol</th>
                <th className='border-2 border-basenaranja w-[25%]'>Registro de ingreso</th>
                <th className='border-2 border-basenaranja w-[25%]'>Regitro de salida</th>

              </tr>
            </thead>
            <tbody>
            {loading ? (
    <tr>
      <td colSpan="5" className="border-2 border-basenaranja text-center">
        Cargando...
      </td>
    </tr>
  ) : error ? (
    <tr>
      <td colSpan="5" className="border-2 border-basenaranja text-center text-red-500">
        Error: {error}
      </td>
    </tr>
  ) : accesos.length > 0 ? (
    <>
      {accesosFiltrados.map((acceso, index) => (
        <tr key={index}>
          <td className='border-2 border-basenaranja'>{acceso.id}</td>
          <td className='border-2 border-basenaranja'>{acceso.area}</td>
          <td className='border-2 border-basenaranja'>{acceso.usuario}</td>
          <td className='border-2 border-basenaranja'>{acceso.rol || "Sin rol"}</td>
          <td className='border-2 border-basenaranja'>{acceso.fecha_ingreso}</td>
          <td className='border-2 border-basenaranja'>{acceso.fecha_salida}</td>
        </tr>
      ))}
    </>
  ) : (
    <tr>
      <td colSpan="5" className="border-2 border-basenaranja text-center">
        No hay registros disponibles
      </td>
    </tr>
  )}</tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminRegistros