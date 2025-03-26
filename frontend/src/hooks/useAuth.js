import { useState } from 'react';
import axios from 'axios';

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState('');  // Agregar el estado para los errores

  // Verificar si el usuario está autenticado
  const checkAuth = () => {
    const token = localStorage.getItem('token');
    const authenticated = !!token;
    setIsAuthenticated(authenticated);
    return authenticated;
  };

  // Manejo de registro
  const register = async (username, password) => {
    const API_URL = import.meta.env.VITE_BACKEND_URI || 'http://localhost:3000';
    try {
      const response = await axios.post(
        `${API_URL}/api/auth/register`,
        { username, password },
        { headers: { 'Content-Type': 'application/json' } }
      );
      setError('');
      return true;
    } catch (error) {
      console.error(error.response?.data || error.message);
      setError('Error al registrar usuario');
      return false;
    }
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

      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        setIsAuthenticated(true);
        setError('');
        return true;
      }
      return false;

    } catch (error) {
      console.error(error.response?.data || error.message);
      setError('Credenciales incorrectas');
      setIsAuthenticated(false);
      return false;
    }
  };

  // Manejo de logout
  const logout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
  };

  return { isAuthenticated, login,register, logout, checkAuth, error, setIsAuthenticated };  // Retornamos también el error
};
