
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useLanguage } from '@/contexts/LanguageContext';

/**
 * Hook to check if the user is authenticated
 * @param redirectTo - Optional path to redirect to if not authenticated (defaults to /login)
 * @returns Object containing isAuthenticated status
 */
export const useAuthCheck = (redirectTo: string = '/login') => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
    const token = localStorage.getItem('token');
    
    if (!isAuthenticated || !token) {
      toast.error(t('auth.error'));
      navigate(redirectTo);
    }
  }, [navigate, redirectTo, t]);

  return {
    isAuthenticated: localStorage.getItem('isAuthenticated') === 'true',
    username: localStorage.getItem('username'),
    token: localStorage.getItem('token')
  };
};
