import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  console.log('Login component rendered');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        'http://localhost:3000/api/auth/login',
        { username, password }, // Datos enviados en JSON
        { headers: { 'Content-Type': 'application/json' } } // Asegura que el backend lo reciba correctamente
      );

      console.log(response.data); // Ver qué responde el backend
      navigate('/streams'); // Redirigir a streams después de registrar
    } catch (err) {
      console.error(err.response?.data || err.message);
      setError('Credenciales incorrectas');
    }
  };

  return (
    <div>
      <h1>Login</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
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