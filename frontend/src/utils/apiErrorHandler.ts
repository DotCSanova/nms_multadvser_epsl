
import { toast } from 'sonner';
import { NavigateFunction } from 'react-router-dom';

/**
 * Handles API errors consistently across the application
 * @param error - The error object from the API call
 * @param navigate - React Router's navigate function
 * @param t - Translation function
 * @param fallbackMessage - Fallback error message if not provided by the API
 */
export const handleApiError = (
  error: any, 
  navigate: NavigateFunction, 
  t: (key: string) => string,
  fallbackMessage: string
) => {
  console.error('API error:', error);
  
  // Extract error message from response if available
  const errorMessage = error.response?.data?.error || fallbackMessage;
  toast.error(errorMessage);
  
  // Handle auth errors
  if (error.response?.status === 401) {
    localStorage.removeItem('token');
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('username');
    navigate('/login');
  }
  
  return errorMessage;
};
