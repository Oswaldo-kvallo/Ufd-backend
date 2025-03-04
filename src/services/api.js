// services/api.js
const API_BASE_URL = 'http://localhost/2da%20copia%20backend/backend/'; // Ajusta según tu configuración

/**
 * Función auxiliar para manejar las peticiones con autenticación
 * @param {string} endpoint - Ruta del endpoint en el backend
 * @param {object} options - Opciones de la petición (método, body, headers)
 * @returns {Promise<object>} - Respuesta en formato JSON o error
 */
//Codigo 1 servia o sirve

const fetchWithAuth = async (endpoint, options = {}) => { //agregare url dentro del parentesis
  try {
    const token = localStorage.getItem('authToken');
    const defaultHeaders = {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    };

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      //28 de enero cree esto
      credentials: 'include', // 🔥 Envía cookies con la solicitud
      headers: { ...defaultHeaders, ...options.headers }
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error('Error en fetchWithAuth:', error);
    return { error: error.message };
  }
};
//Nuevo FetchWithAuth si no sirve volver al 1
/*const fetchWithAuth = async (url, endpoint, options = {}) => {
  try {
    const token = localStorage.getItem('authToken');
    const defaultHeaders = {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    };

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: { ...defaultHeaders, ...options.headers }
    });

    const text = await response.text(); // 🔴 Obtener respuesta como texto para inspección
    console.log('🔍 Respuesta del backend:', text); // 🔍 Imprimir respuesta en consola

    // Intentar convertir a JSON si es posible
    let data;
    try {
      data = JSON.parse(text);
    } catch (jsonError) {
      console.error('❌ Error al parsear JSON:', jsonError);
      throw new Error('La respuesta del servidor no es JSON válido');
    }

    if (!response.ok) {
      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error('❌ Error en fetchWithAuth:', error);
    return { error: error.message };
  }
};*/


/**
 * Servicios de autenticación
 */
export const authService = {
  // Iniciar sesión y guardar token en localStorage
  login: async (nombre_usuario, contrasena) => {
    try {
      const response = await fetchWithAuth('login3/login.php', {
        method: 'POST',
        body: JSON.stringify({ nombre_usuario, contrasena })
      });
      
      if (response.success) {
        // Guardar el token si lo devuelves del backend (si aplica)
      localStorage.setItem('authToken', response.token);
        // Guardamos el rol del usuario
        localStorage.setItem('userRole', response.rol);
        // También podríamos guardar el mensaje de éxito si lo necesitamos
        localStorage.setItem('userName', nombre_usuario);
        return response;
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      console.error('Error en login:', error);
      throw error;
    }
  },
  //solo cambie token por authToken
  checkAuth: async () => {
    try {
        const token = localStorage.getItem('authToken');
        if (!token) {
            throw new Error('No hay token almacenado');
        }

        // Llamada a fetchWithAuth con el token
        const response = await fetchWithAuth('login3/auth.php', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.success) {
            // Guardar nuevamente el token y los datos en localStorage (por seguridad)
            localStorage.setItem('authToken', response.token); // Asegurar que el token se refresca si el backend lo devuelve actualizado
            localStorage.setItem('userRole', response.rol);
            localStorage.setItem('userName', response.nombre_usuario);
            localStorage.setItem('userId', response.usuario_id);
            return response;
        } else {
            throw new Error(response.message);
        }
    } catch (error) {
        // Si la autenticación falla, eliminar el token y datos del usuario
        localStorage.removeItem('authToken');
        localStorage.removeItem('userRole');
        localStorage.removeItem('userName');
        localStorage.removeItem('userId');
        throw error;
    }
}, 
logout: async () => {
  try {
    const response = await fetchWithAuth('login3/logout.php', {
      method: 'GET' //'POST' estaba antes
    });
    
    if (response.success) {
      // Limpiamos el almacenamiento local
      localStorage.removeItem('userRole');
      localStorage.removeItem('userName');
      //modificacion para autenticar
      localStorage.removeItem('userId');
      localStorage.removeItem('authToken'); // ✅ Elimina el token(Moificado con chat)
      //return response;
    } /*else {
      throw new Error(response.message);
    }*/
  } catch (error) {
    console.error('Error en logout:', error);
    throw error;
  }
},

  
  // Cerrar sesión y eliminar token (agregue una funcion dentro de los parentesis despues de async)
  
  //antiguo codigo 1
  /*checkAuth: async () => {
    try {
      const response = await fetchWithAuth('login3/auth.php', {
        method: 'GET'
      });
      
      if (response.success) {
        // Actualizar información del usuario en localStorage
        localStorage.setItem('userRole', response.rol);
        localStorage.setItem('userName', response.nombre_usuario);
        localStorage.setItem('userId', response.usuario_id);
        return response;
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      // Limpiar localStorage si la sesión expiró
      localStorage.removeItem('userRole');
      localStorage.removeItem('userName');
      localStorage.removeItem('userId');
      throw error;
    }
  } */
    
};

/**
 * Servicios de usuarios
 */
export const userService = {
  getUsers: async () => {
    try {
      const response = await fetchWithAuth('obtener2.php', {
        method: 'GET'
      });

      if (response.success) {
        return response.usuarios; // Retorna directamente el array de usuarios
      } else {
        throw new Error(response.message || 'Error al obtener usuarios');
      }
    } catch (error) {
      console.error('Error al obtener usuarios:', error);
      throw error;
    }
  }, // Obtener lista de usuarios
  
  createUser: async (userData) => {
    // Validación de datos requeridos
    const requiredFields = ['nombre_usuario', 'contrasena', 'id_area', 'estado', 'rol'];
    for (const field of requiredFields) {
      if (!userData[field]) {
        throw new Error(`El campo ${field} es requerido`);
      }
    }

    // Validación de estado
    if (!['Activo', 'Inactivo'].includes(userData.estado)) {
      throw new Error("El estado debe ser 'Activo' o 'Inactivo'");
    }

    // Validación de rol
    if (!['Administrador', 'Alimentador'].includes(userData.rol)) {
      throw new Error("El rol debe ser 'Administrador' o 'Alimentador'");
    }

    try {
      return await fetchWithAuth('agregar2.php', {
        method: 'POST',
        body: JSON.stringify({
          nombre_usuario: userData.nombre_usuario,
          contrasena: userData.contrasena,
          id_area: userData.id_area,
          estado: userData.estado,
          rol: userData.rol
        })
      });
    } catch (error) {
      console.error('Error al crear usuario:', error);
      throw error;
    }
  },
  
  updateUser: async (userData) => {
    // Validación de datos requeridos
    const requiredFields = ['id', 'nombre_usuario', 'id_area', 'estado'];
    for (const field of requiredFields) {
      if (!userData[field]) {
        throw new Error(`El campo ${field} es requerido`);
      }
    }

    // Validación de estado (notar que el backend espera minúsculas)
    if (!['activo', 'inactivo'].includes(userData.estado.toLowerCase())) {
      throw new Error("El estado debe ser 'activo' o 'inactivo'");
    }

    try {
      // Crear objeto de datos a enviar
      const updateData = {
        id: userData.id,
        nombre_usuario: userData.nombre_usuario,
        id_area: userData.id_area,
        estado: userData.estado.toLowerCase()
      };

      // Agregar contraseña solo si se proporciona
      if (userData.contrasena) {
        updateData.contrasena = userData.contrasena;
      }

      return await fetchWithAuth('actualizar2.php', {
        method: 'POST', // Cambiamos a POST ya que el backend usa file_get_contents("php://input")
        body: JSON.stringify(updateData)
      });
    } catch (error) {
      console.error('Error al actualizar usuario:', error);
      throw error;
    }
  }
  
};

/**
 * Servicios de áreas
 */
export const areaService = {
  getAreas: async () => {
    try {
      const response = await fetchWithAuth('areas/obtener_areas.php', {
        method: 'GET'
      });
  
      if (!response.success) {
        throw new Error(response.message || 'Error al obtener las áreas');
      }
  
      return response.areas; // Retorna directamente el array de áreas
    } catch (error) {
      console.error('Error al obtener áreas:', error);
      throw error;
    }
  }, // Obtener lista de áreas
  
  createArea: async (areaData) => {
    // Validar que el nombre del área no esté vacío
    if (!areaData.nombre_area?.trim()) {
      throw new Error('El nombre del área es obligatorio');
    }
    //26 febrero cambie lo que sigue despues de body nombre_area: areaData.nombre_area.trim()
    try {
      const response = await fetchWithAuth('areas/crear_area2.php', {
        method: 'POST',
        body: JSON.stringify({
          id_area: areaData.id_area,         // Asegúrate de incluir el id_area
        nombre_area: areaData.nombre_area, // Incluye el nombre_area
        nombre_usuario: areaData.nombre_usuario, // Incluye el nombre_usuario
        contrasena: areaData.contrasena,    // Incluye la contrasena
        }),
      });
      //version claude
      /*if (!response.success) {
        throw new Error(response.message);
      }*/
      if (!response.success) {
      if (response.message === "No hay datos disponibles") {
      return []; // ✅ Retorna un array vacío en lugar de lanzar un error
      }
      throw new Error(response.message || 'Error desconocido');
      }

      return response;
    } catch (error) {
      console.error('Error al crear área:', error);
      throw error;
    }
  },
  //antiguo no supe si funcionaba nunca se probo jaja
  /*updateArea: async (areaData) => {
    // Validar que todos los campos requeridos estén presentes
    if (!areaData.id || !areaData.nombre_area?.trim() || !areaData.estado) {
      throw new Error('El ID, el nombre y el estado del área son obligatorios');
    }
  
    // Validar que el estado sea válido
    if (!['activo', 'inactivo'].includes(areaData.estado.toLowerCase())) {
      throw new Error("El estado debe ser 'activo' o 'inactivo'");
    }
  
    try {
      const response = await fetchWithAuth('editar_area.php', {
        method: 'POST', // Cambiamos a POST ya que el backend usa file_get_contents("php://input")
        body: JSON.stringify({
          id: areaData.id,
          nombre_area: areaData.nombre_area.trim(),
          estado: areaData.estado.toLowerCase()
        })
      });
  
      if (!response.success) {
        throw new Error(response.message || 'Error al actualizar el área');
      }
  
      return response;
    } catch (error) {
      console.error('Error al actualizar área:', error);
      throw error;
    }
  }
  */
 //Nuevo espero y funciones 27 de febrero
 updateUserAndArea: async (userData, areaData) => {
  if (!areaData.id_area) throw new Error("El ID del área es obligatorio");
  if (!userData.id) throw new Error("El ID del usuario es obligatorio");

  const payload = {
    id_area: areaData.id_area,
    nombre_area: areaData.nombre_area?.trim() || null,
    id: userData.id,
    nombre_usuario: userData.nombre_usuario?.trim() || null,
    contrasena: userData.contrasena || null,
  };

  console.log("📌 Enviando datos desde frontend:", payload);

  try {
    const response = await fetch("http://localhost/2da%20copia%20backend/backend/areas/editar_area2.php", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status}`);
    }

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.message || "Error al actualizar usuario y área");
    }

    return result;
  } catch (error) {
    console.error("❌ Error al actualizar usuario y área:", error);
    throw error;
  }
},
  
};

/**
 * Servicios de accesos
 */
export const accessService = {
  getUserAccess: async () => {
    try {
      const response = await fetchWithAuth('accesos/obtener_accesos.php', {
        method: 'GET'
      });

      if (!response.success) {
        throw new Error(response.message || 'Error al obtener los accesos');
      }

      // Procesar las fechas para asegurar formato consistente
      const accesosFormateados = response.accesos.map(acceso => ({
        id: acceso.id,
    usuario: acceso.nombre_usuario || 'Desconocido', // Asegurar que nunca sea undefined
    area: acceso.nombre_area || 'Sin área',
        //...acceso,
        /*fecha_ingreso: new Date(acceso.fecha_ingreso),
        fecha_salida: new Date(acceso.fecha_salida) */ //Este es al antiguo comando sirve
        //Este es con chat, 28 de febrero lo quite y puse otro nuevo
        /*fecha_ingreso: new Date(acceso.fecha_ingreso).toISOString(), // Para backend
        fecha_salida: new Date(acceso.fecha_salida).toLocaleString(), // Para UI*/
        fecha_ingreso: acceso.fecha_ingreso ? new Date(acceso.fecha_ingreso).toISOString() : null,
        //Modificacion fecha_salida: acceso.fecha_salida ? new Date(acceso.fecha_salida).toLocaleString() : 'En sesión',
        fecha_salida: acceso.fecha_salida && acceso.fecha_salida !== "null" 
  ? new Date(acceso.fecha_salida).toLocaleString() 
  : 'En sesión',

      }));

      return accesosFormateados;
    } catch (error) {
      console.error('Error al obtener accesos:', error);
      throw error;
    }
  },

  getAdminAccess: async () => {
    try {
      const response = await fetchWithAuth('accesos/accesosadmin.php', {
        method: 'GET'
      });

      if (!response.success) {
        throw new Error(response.message || 'Error al obtener los accesos del administrador');
      }

      // Procesar las fechas para asegurar formato consistente
      const accesosFormateados = response.accesos.map(acceso => ({
        ...acceso,
        fecha_ingreso: acceso.fecha_ingreso ? new Date(acceso.fecha_ingreso).toISOString() : null, 
        fecha_salida: acceso.fecha_salida && acceso.fecha_salida !== "null"
          ? new Date(acceso.fecha_salida).toLocaleString()
          : 'En sesión', // Evita errores si es null
        //Version claude
        /*fecha_ingreso: new Date(acceso.fecha_ingreso),
        fecha_salida: new Date(acceso.fecha_salida) */
        //version de chat
        // fecha_ingreso: new Date(acceso.fecha_ingreso).toISOString(),  Formato estándar para backend
        // fecha_salida: new Date(acceso.fecha_salida).toLocaleString()  Formato legible para UI
      }));

      return accesosFormateados;
    } catch (error) {
      console.error('Error al obtener accesos del administrador:', error);
      throw error;
    }
  }
};
