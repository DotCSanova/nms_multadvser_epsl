import { useState } from 'react';
import axios from 'axios';

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState('');  // Agregar el estado para los errores

  // Verificar si el usuario está autenticado
  const checkAuth = () => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token); // Convierte el token en un booleano
    return(!!token); // Resuelve la promesa con el estado de autenticación
  };

  // Manejo de login
  const login = async (username, password) => {
    const API_URL = import.meta.env.VITE_BACKEND_URI || 'http://localhost:3000';
    try {
      const response = await axios.post(
        `${API_URL}/api/auth/login`,
        { username, password },
        { headers: { 'Content-Type': 'application/json' } }
      );

      localStorage.setItem('token', response.data.token); // Guardar token en localStorage
      setIsAuthenticated(true);  // Actualizamos el estado de autenticación
      setError('');  // Limpiamos cualquier error previo
      return true;

    } catch (error) {
      console.error(error.response?.data || error.message);
      setError('Credenciales incorrectas');  // Establecemos el error si la autenticación falla
      setIsAuthenticated(false);  // Aseguramos que el estado de autenticación se pone en falso
      return false;
    }
  };

  // Manejo de logout
  const logout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
  };

  return { isAuthenticated, login, logout, checkAuth, error };  // Retornamos también el error
};
