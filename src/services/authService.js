export const authService = {
    login: async (nombre_usuario, contrasena) => {
      try {
        const response = await fetch('http://localhost/2da%20copia%20backend/backend/login3/login.php', { // Cambia la URL según corresponda
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ nombre_usuario, contrasena }),
          credentials: 'include', // Para manejar sesiones en PHP
        });
  
        return await response.json();
      } catch (error) {
        console.error('Error en la autenticación:', error);
        return { success: false, message: 'Error en la conexión con el servidor' };
      }
    }
  };
  