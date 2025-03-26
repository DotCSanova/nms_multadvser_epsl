import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth'; 

const Login = () => {
  console.log('Login component rendered');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login, setIsAuthenticated, error } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const success = await login(username, password);
      if (success) {
        setIsAuthenticated(true);
        setTimeout(() => {
          navigate('/streams');
        }, 100);
      }
    } catch (error) {
      console.error('Error durante el login:', error);
    }
  };

  return (
    <div>
      <h1>Login</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>} {/* Mostrar mensaje de error si hay */}
      <form onSubmit={handleLogin}>
        <input
          type="text"
          placeholder="Usuario"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Iniciar Sesión</button>
      </form>
    </div>
  );
};

export default Login;
