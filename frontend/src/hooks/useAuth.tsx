
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface AuthResponse {
  token: string;
}

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  
  // Check authentication when the component loads
  useEffect(() => {
    checkAuth();
  }, []);

  // Verify if the user is authenticated
  const checkAuth = (): boolean => {
    const token = localStorage.getItem('token');
    const authenticated = !!token;
    setIsAuthenticated(authenticated);
    // Also update localStorage to ensure consistency
    if (authenticated) {
      localStorage.setItem('isAuthenticated', 'true');
    }
    return authenticated;
  };

  // Handle registration
  const register = async (username: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    const API_URL = import.meta.env.VITE_BACKEND_URI || 'http://localhost:3000';
    
    try {
      await axios.post(
        `${API_URL}/api/auth/register`,
        { username, password },
        { headers: { 'Content-Type': 'application/json' } }
      );
      
      setError('');
      toast.success('Registro exitoso. Por favor inicia sesión.');
      setIsLoading(false);
      return true;
    } catch (error: any) {
      console.error(error.response?.data || error.message);
      const errorMessage = error.response?.data?.message || 'Error al registrar usuario';
      setError(errorMessage);
      toast.error(errorMessage);
      setIsLoading(false);
      return false;
    }
  };

  // Handle login
  const login = async (username: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    const API_URL = import.meta.env.VITE_BACKEND_URI || 'http://localhost:3000';
    
    try {
      const response = await axios.post<AuthResponse>(
        `${API_URL}/api/auth/login`,
        { username, password },
        { headers: { 'Content-Type': 'application/json' } }
      );

      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('username', username); // Store username on successful login
        setIsAuthenticated(true);
        setError('');
        toast.success('Inicio de sesión exitoso');
        setIsLoading(false);
        return true;
      }
      
      setIsLoading(false);
      return false;
    } catch (error: any) {
      console.error(error.response?.data || error.message);
      const errorMessage = error.response?.data?.message || 'Credenciales incorrectas';
      setError(errorMessage);
      toast.error(errorMessage);
      setIsAuthenticated(false);
      setIsLoading(false);
      return false;
    }
  };

  // Handle logout
  const logout = (): void => {
    localStorage.removeItem('token');
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('username'); // Remove username on logout
    setIsAuthenticated(false);
    toast.success('Sesión cerrada correctamente');
    navigate('/');
  };

  return { 
    isAuthenticated, 
    login, 
    register, 
    logout, 
    checkAuth, 
    error, 
    setIsAuthenticated,
    isLoading
  };
};
