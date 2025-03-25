import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useAuth } from './hooks/useAuth';
import Login from './views/Login';
import Register from './views/Register';
import Streams from './views/Streams';

const AppRouter = () => {
  const { isAuthenticated, checkAuth } = useAuth();
  const [loading, setLoading] = useState(true); // Estado de carga

  // Ejecutamos checkAuth al cargar el componente
  useEffect(() => {
    checkAuth();
    setLoading(false); // Después de verificar, dejamos de mostrar el "loading"
  }, [checkAuth]);

  // Si estamos cargando, no renderizamos nada aún
  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Ruta protegida para /streams */}
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
        <Route path="/" element={<Register />} /> {/* Ruta por defecto */}
      </Routes>
    </Router>
  );
};

export default AppRouter;
