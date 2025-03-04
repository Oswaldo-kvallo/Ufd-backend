import React from 'react'
import '../StylesAdmin/admin_areas.css'
import { useEffect, useState } from "react"; //agregue esto: useEffect,
//Importar el api 
import {areaService} from '../services/api';
//importar axios
import axios from 'axios';

{/* Iconos */}
import { FaHome } from "react-icons/fa";
import { TfiWorld } from "react-icons/tfi";
import { RiLogoutCircleLine } from "react-icons/ri";
import { Link } from 'react-router-dom';
import { RxLapTimer } from "react-icons/rx";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { FaUsers } from "react-icons/fa";

const AdminAreas = () => {
  const [areas, setAreas] = useState([]); // Estado para almacenar las áreas
  const [selectedArea, setSelectedArea] = useState(null); // Guarda el área seleccionada para editar

  // Función Modal
  const [isOpen, setIsOpen] = useState(false);
  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);
  //Modifique esto hoy 27 de febrero const openModalEdit = () => setIsEditOpen(true); linea 28
  const [isEditOpen, setIsEditOpen] = useState(false);
  const openModalEdit = (area) => {
    console.log("Área recibida:", area); 
    if (!area || !area.id ) {
    console.error("Error: el área seleccionada es inválida", area);
    return;
  }
  console.log(selectedArea);
    setSelectedArea({
      id_area: area.id, // Asigna id correctamente
      id: area.id || "SIN_ID",
      nombre_area: area.nombre_area,
      nombre_usuario: area.nombre_usuario,
      contrasena: area.contrasena || "", // Evita valores undefined
    }); // Asigna el área seleccionada
    //setIdArea(area.id_area || area.id);  Asigna el ID del área al estado
    setNombreArea(area.nombre_area|| ""); // Asigna el nombre del área
    setNombreUsuario(area.nombre_usuario|| ""); // Asigna el nombre de usuario
    setContrasena(area.contrasena || ""); // Limpia la contraseña (si lo deseas)
    setIsEditOpen(true); // Abre el modal de edición
  };
  const closeModalEdit = () => setIsEditOpen(false);

  // Funcion de la X en los filtros
  const [filtroArea, setfiltroArea] = useState ('');
  const handleInputChange = (e) => {
    setfiltroArea(e.target.value);
  };
  // Estado para los inputs del modal (Agregado 26 de febrero)
  /*const [idarea, setIdarea] = useState('');
  const [area, setArea] = useState('');
  const [usuario, setUsuario] = useState('');
  const [contraseña, setContraseña] = useState('');*/
  const [idArea, setIdArea] = useState('');
  const [nombreArea, setNombreArea] = useState('');
  const [nombreUsuario, setNombreUsuario] = useState('');
  const [contrasena, setContrasena] = useState('');


  const clearInput = () => {
    setfiltroArea('');
  };
  //Funcion para obtener las areas (eliminar si no sale bien empieza aqui)
  const fetchAreas = async () => {
    try {
      const data = await areaService.getAreas(); // Llamada a `api.js`
      console.log("🔍 Datos recibidos del backend:", data);
      setAreas(data);
    } catch (error) {
      console.error("Error obteniendo las áreas:", error);
    }
  };
  
  useEffect(() => {
    fetchAreas();
  }, []);
  //Funcion para obtener las areas (eliminar si no sale bien hasta aqui)

  //Funcion para agregar las areas (eliminar si no sale bien empieza aqui) (hoy 26 de febrero agregue esta funcion despues de try)
  //Esto fue lo que agregue await areaService.createArea(nombre, usuario, contraseña); y tenia esto await createArea(nombre, usuario, contraseña);
  const handleAddArea = async () => {
    try {
      await areaService.createArea({
        id_area: idArea,       // ID del área
        nombre_area: nombreArea, // Nombre del área
        nombre_usuario: nombreUsuario, // Nombre de usuario
        contrasena: contrasena, // Contraseña del usuario
      });
      fetchAreas(); // Recargar la lista de áreas
      setIsOpen(false); // Cerrar modal
    } catch (error) {
      console.error("Error al agregar área:", error);
    }
  };  
  //Funcion para agregar las areas (eliminar si no sale bien hasta aqui)

  //Funcion para editar las areas (eliminar si no sale bien empieza aqui) lo voy a comentar hoy 27 de febrreo nunca se pronbo pero bueno
  {/*const handleEditArea = async (id, nombre, usuario, contraseña) => {
    try {
      await updateArea(id, { nombre, usuario, contraseña });
      fetchAreas(); // Recargar la lista de áreas
      setIsEditOpen(false); // Cerrar modal
    } catch (error) {
      console.error("Error al actualizar área:", error);
    }
  };*/}
  //Funcion para editar las areas (eliminar si no sale bien hasta aqui)
  //Nueva funcion para editar area hoy 27 de febrero
  const handleEditArea = async () => {
    try {
      console.log("ID del área:", selectedArea?.id_area);
    console.log("Nombre del usuario:", nombreUsuario);
    console.log("ID del usuario:", selectedArea?.id);

    // Verificar que el ID del área y del usuario existen
    if (!selectedArea?.id_area) {
      console.error("Error: El ID del área es obligatorio");
      return;
    }
    if (!selectedArea?.id) {
      console.error("Error: El ID del usuario es obligatorio");
      return;
    }
      // Llamada al servicio para actualizar el usuario y el área
      await areaService.updateUserAndArea(
        {
          id: selectedArea.id, // Asegúrate de que el id del usuario esté seleccionado correctamente
          nombre_usuario: nombreUsuario, // Nuevo nombre de usuario
          contrasena: contrasena, // Nueva contraseña contrasena: contrasena || null, // No enviar si está vacío
        },
        {
          id_area: selectedArea.id_area, // ID original del área
          nombre_area: nombreArea, // Nuevo nombre del área
          // estado: selectedArea.estado,  Estado actual del área
        }
      );
  
      // Recargar la lista de áreas después de la actualización
      fetchAreas();
      //Otra opcion de cerrar modal closeModalEdit();
       // Cerrar el modal
      setIsEditOpen(false);
    } catch (error) {
      console.error("Error al actualizar área y usuario:", error);
    }
  };
  
  //LO agregue hoy 26 de febrero jaja es el primero si no sirve el dos usar este
  // Función para manejar el cambio de estado del checkbox
  /*const handleCheckboxChange = (id) => {
  // Actualiza el estado del área con el id correspondiente
  setAreas(prevAreas =>
    prevAreas.map(area =>
      area.id === id ? { ...area, isActive: !area.isActive } : area
    )
  );
};*/
//Nuevo compinente 2si no srive usar 1
const handleRadioChange = (id, estado) => {
  // Actualiza el estado del área con el id correspondiente
  setAreas(prevAreas =>
    prevAreas.map(area =>
      area.id === id ? { ...area, estado } : area
    )
  );
};

//agregado 27 de febrero
const handleSaveChanges = async () => {
  try {
    console.log("ID del área:", idArea);
    console.log("Nombre del usuario:", nombreUsuario);
    console.log("ID del usuario:", selectedArea.id_usuario);

    // Verifica que el id_usuario esté disponible
    if (!selectedArea.id_usuario) {
      console.error("ID de usuario no encontrado en el área seleccionada");
      return; // Si no se encuentra, no continúes con la operación
    }

    // Llamada al servicio para actualizar el área y el usuario
    await areaService.updateUserAndArea(
      {
        id_usuario: selectedArea.id_usuario, // Asegúrate de que el id del usuario esté seleccionado correctamente
        nombre_usuario: nombreUsuario,
        contrasena: contrasena,
      },
      {
        id_area_original: selectedArea.id_area,
        nombre_area: nombreArea,
        //estado: selectedArea.estado,
      }
    );

    fetchAreas(); // Recarga la lista de áreas
    setIsEditOpen(false); // Cierra el modal
  } catch (error) {
    console.error("Error al actualizar área y usuario:", error);
  }
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
            <h1 id='titulo-areas'>Áreas Registradas</h1>

            <button onClick={openModal}>
              <span className="box">
              Registrar Área
              </span>
            </button>
          </div>

          {/* Buscador */}
          <div className='w-[100%] h-[10%] flex items-center justify-center'>
            <div className="search-panels-filtro">
              <div className="search-group">
                <input required type="text" name="text" autoComplete="on" className="input" value={filtroArea} onChange={handleInputChange} />
                <label className="enter-label">Filtrar Área</label>
                <div className="btn-box">
                  <button className="btn-search">
                    <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512"><path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z" /><circle id="svg-circle" cx={208} cy={208} r={144} /></svg>
                  </button>
                </div>
                <div className="btn-box-x">
                  <button className="btn-cleare" onClick={clearInput}>
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
        <th className='border-2 border-basenaranja w-[10%]'>ID Área</th>
        <th className='border-2 border-basenaranja w-[20%]'>Área</th>
        <th className='border-2 border-basenaranja w-[20%]'>Usuario</th>
        <th className='border-2 border-basenaranja w-[20%]'>Contraseña</th>
        <th className='border-2 border-basenaranja w-[30%]'>Acción</th>
      </tr>
    </thead>
    <tbody>
      {areas.map((area, index) => (
        <tr key={`${area.id}-${index}`}>
          <td className='border-2 border-basenaranja'>{area.id}</td>
          <td className='border-2 border-basenaranja'>{area.nombre_area}</td>
          <td className='border-2 border-basenaranja'>{area.nombre_usuario}</td>
          <td className='border-2 border-basenaranja'>{area.contrasena}</td>
          <td className='border-2 border-basenaranja w-[100%]'>
            <div className='flex'>
              {/* Botón Editar */}
              <button
                className="Btn w-[50%]"
                onClick={() => {
                  console.log("Área seleccionada antes de abrir modal:", area);
                  openModalEdit(area);
                }}
              >
                Editar
                <svg className="svg" viewBox="0 0 512 512">
                  <path d="M410.3 231l11.3-11.3-33.9-33.9-62.1-62.1L291.7 89.8l-11.3 11.3-22.6 22.6L58.6 322.9c-10.4 10.4-18 23.3-22.2 37.4L1 480.7c-2.5 8.4-.2 17.5 6.1 23.7s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L387.7 253.7 410.3 231zM160 399.4l-9.1 22.7c-4 3.1-8.5 5.4-13.3 6.9L59.4 452l23-78.1c1.4-4.9 3.8-9.4 6.9-13.3l22.7-9.1v32c0 8.8 7.2 16 16 16h32zM362.7 18.7L348.3 33.2 325.7 55.8 314.3 67.1l33.9 33.9 62.1 62.1 33.9 33.9 11.3-11.3 22.6-22.6 14.5-14.5c25-25 25-65.5 0-90.5L453.3 18.7c-25-25-65.5-25-90.5 0zm-47.4 168l-144 144c-6.2 6.2-16.4 6.2-22.6 0s-6.2-16.4 0-22.6l144-144c6.2-6.2 16.4-6.2 22.6 0s6.2 16.4 0 22.6z" />
                </svg>
              </button>
                {/*Hoy 26 de febrero voy a  agregar onChange*/}  
              {/* Switch de estado */}
              <fieldset id="switch" className="radio w-[50%] flex items-center">
                <input
                  name={`switch-${area.id}`}
                  id={`on-${area.id}`}
                  type="radio"
                  checked={area.estado === "activo"}
                  onChange={() => handleRadioChange(area.id, "activo")} // Cambiar estado a "activo"
                />
                <label htmlFor={`on-${area.id}`} className='text-[18px]'>Activo</label>
                <br />
                {/*Hoy 26 de febrero voy a  agregar onChange*/}
                <input
                  name={`switch-${area.id}`}
                  id={`off-${area.id}`}
                  type="radio"
                  checked={area.estado === "inactivo"}
                  onChange={() => handleRadioChange(area.id, "inactivo")} // Cambiar estado a "inactivo"
                />
                <label htmlFor={`off-${area.id}`} className='text-[18px]'>Inactivo</label>
              </fieldset>
            </div>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>

        </div>

        {/* Modal Registrar */}
          {isOpen && (
            <div id="modal" className="fixed inset-0 flex justify-center items-center">
              <div className="">

                <div className='x flex items-center justify-end pr-3 pt-2'>
                  <button className="BotonCerrar" onClick={closeModal}>
                  <IoIosCloseCircleOutline className='text-2xl' />
                  </button>
                </div>

                <div className='Registrar'>
                  <h1>Registrar Nueva Área</h1>
                </div>

                <div className='Inputs'>
  <div className="input-container">
    <input required type="text" name="idarea" autoComplete="off" className="InputRegistro1" value={idArea}
                  onChange={(e) => setIdArea(e.target.value)}/>
    <label className="LabelRegistro1">ID Área</label>
  </div>

  <div className="input-container">
    <input required type="text" name="area" autoComplete="off" className="InputRegistro2" value={nombreArea}
                  onChange={(e) => setNombreArea(e.target.value)}/>
    <label className="LabelRegistro2">Área</label>
  </div>

  <div className="input-container">
    <input required type="text" name="usuario" autoComplete="off" className="InputRegistro3" value={nombreUsuario}
                  onChange={(e) => setNombreUsuario(e.target.value)} />
    <label className="LabelRegistro3">Usuario</label>
  </div>

  <div className="input-container">
    <input required type="password" name="constraseña" autoComplete="off" className="InputRegistro4" value={contrasena}
                  onChange={(e) => setContrasena(e.target.value)}/>
    <label className="LabelRegistro4">Contraseña</label>
  </div>
</div>

                <div className='BotonRegistro flex items-center justify-center'>
                  <button onClick={handleAddArea}>
                    <a href="#"><span>Registrar</span></a> 
                  </button>
                </div>

              </div>
            </div>
          )}
{/*Hoy 27 de febreo agregue funcionalidad a los inputs*/}
          {/* Modal editar */}
          {isEditOpen && (
            <div id="modal" className="fixed inset-0 flex justify-center items-center">
              <div className="">

                <div className='x flex items-center justify-end pr-3 pt-2'>
                  <button className="BotonCerrar" onClick={closeModalEdit}>
                  <IoIosCloseCircleOutline className='text-2xl' />
                  </button>
                </div>

                <div className='Registrar'>
                  <h1>Editar Área</h1>
                </div>

                <div className='Inputs'>
  <div className="input-container">
    <input required type="text" name="idarea" value={selectedArea?.id_area || ""} readOnly autoComplete="off" className="InputRegistro1" />
    <label className="LabelRegistro1">ID Área</label>
  </div>

  <div className="input-container">
    <input required type="text" name="area" value={nombreArea} 
    onChange={(e) => setNombreArea(e.target.value)} autoComplete="off" className="InputRegistro2" />
    <label className="LabelRegistro2">Área</label>
  </div>

  <div className="input-container">
    <input required type="text" name="usuario" value={nombreUsuario} 
    onChange={(e) => setNombreUsuario(e.target.value)} autoComplete="off" className="InputRegistro3" />
    <label className="LabelRegistro3">Usuario</label>
  </div>

  <div className="input-container">
    <input required type="password" name="constraseña" value={contrasena}
    onChange={(e) => setContrasena(e.target.value)} autoComplete="off" className="InputRegistro4" />
    <label className="LabelRegistro4">Contraseña</label>
  </div>
</div>

                <div className='BotonRegistro flex items-center justify-center'>
                  <button onClick={handleEditArea}>
                    <a href="#"><span>Guardar</span></a> 
                  </button>
                </div>

              </div>  
            </div>
          )}



      </div>
    </div>
  )
}

export default AdminAreas