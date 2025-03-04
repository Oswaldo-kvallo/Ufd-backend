import React, { useState, useEffect } from 'react'
import '../StylesAdmin/admin_acceso.css'
import {accessService} from '../services/api';

{/* Iconos */}
import { FaHome } from "react-icons/fa";
import { TfiWorld } from "react-icons/tfi";
import { RiLogoutCircleLine } from "react-icons/ri";
import { Link } from 'react-router-dom';
import { RxLapTimer } from "react-icons/rx";
import { FaUsers } from "react-icons/fa";

const AdminAcceso = () => {
  
// Estados para manejar los accesos, loading y errores
const [accesos, setAccesos] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);

// Cargar los accesos del administrador al montar el componente
useEffect(() => {
  const fetchAdminAccess = async () => {
    try {
      const data = await accessService.getAdminAccess();
      setAccesos(data);
    } catch (err) {
      setError(err.message || "Error al cargar los accesos");
    } finally {
      setLoading(false);
    }
  };

  fetchAdminAccess();
}, []);
// Funcion para limpiar filtros
const [dia, setDia] = useState('');
const [mes, setMes] = useState('');
const [año, setAño] = useState('');
const handleClear = (setter) => {
  setter('');
};

  return (
    <div>
      {/* Menú */}
      <div className="w-screen h-screen bg-baseazul flex">
        <div className='w-[6%] h-screen bg-baseazul flex items-center justify-center relative'> 
          <div className="action-wrap z-10 flex flex-col items-start absolute">
            <Link to={'/admin_inicio'} className="action" type="button">
              <FaHome className="action-icon" color="#353866" />
              <span className="action-content" data-content="Inicio" />
            </Link>
            
            <Link to={'/admin_areas'} className="action" type="button">
              <TfiWorld className="action-icon" color="#353866" />
              <span className="action-content" data-content="Áreas" />
            </Link>
            
            <Link to={'/admin_acceso'} className="action" type="button">
              <RxLapTimer className="action-icon" color="#353866" />
              <span className="action-content" data-content="Mis Accesos" />
            </Link>

            <Link to={'/admin_registros'} className="action" type="button">
              <FaUsers className="action-icon" color="#353866" />
              <span className="action-content" data-content="Registro de Accesos" />
            </Link>
            
            <Link to={'/'} className="action" type="button">
              <RiLogoutCircleLine className="action-icon" color="#353866" />
              <span className="action-content" data-content="Salir" />
            </Link>
            
            <div className="backdrop" />
          </div>

        </div>

        {/* Titulo */}
        <div className='w-[94%] h-screen'>
          <div className='w-[100%] h-[15%] flex'>
            <h1 id='titulo'>Últimos Accesos Registrados</h1>
          </div>

          {/* Buscador */}
          <div className='w-[100%] h-[10%] flex items-center justify-center'>
            <div className="search-panels flex">
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
                <th className='border-2 border-basenaranja w-[20%]'>Registro de ingreso</th>
                <th className='border-2 border-basenaranja w-[20%]'>Regitro de salida</th>
              </tr>
            </thead>
            <tbody>
            {loading ? (
            <tr>
              <td colSpan="3" className="border-2 border-basenaranja text-center">Cargando...</td>
            </tr>
          ) : error ? (
            <tr>
              <td colSpan="3" className="border-2 border-basenaranja text-center text-red-500">
                Error: {error}
              </td>
            </tr>
          ) : accesos.length > 0 ? (
            accesos.map((acceso, index) => (
              <tr key={index}>
                <td className='border-2 border-basenaranja'>{acceso.id}</td>
                <td className='border-2 border-basenaranja'>{acceso.fecha_ingreso}</td>
                <td className='border-2 border-basenaranja'>{acceso.fecha_salida}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3" className="border-2 border-basenaranja text-center">
                No hay registros disponibles
              </td>
            </tr>
          )}
            </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminAcceso