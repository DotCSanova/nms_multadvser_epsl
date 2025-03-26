import { Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useAuth } from './hooks/useAuth';
import Login from './views/Login';
import Register from './views/Register';
import Streams from './views/Streams';

const AppRouter = () => {
  const { isAuthenticated, checkAuth } = useAuth();
  const [loading, setLoading] = useState(true); // Estado de carga

  useEffect(() => {
    checkAuth(); // Verificamos si el usuario está autenticado
    setLoading(false); // Cuando termine la verificación, dejamos de mostrar "loading"
  }, [checkAuth]);

  // Si estamos cargando, no renderizamos nada aún
  if (loading) {
    return <div>Loading...</div>;
  }

  return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/streams"
          element={
            isAuthenticated ? (
              <Streams />
            ) : (
              <Navigate to="/login" /> // Si no está autenticado, redirige a login
            )
          }
        />
        <Route path="/" element={<Navigate to="/register" />} />
      </Routes>
  );
};

export default AppRouter;
