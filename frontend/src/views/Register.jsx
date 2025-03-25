import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_BACKEND_URI || 'http://localhost:3000';

  const handleRegister = async (e) => { //componente con estado
    e.preventDefault();
    try {
      const response = await axios.post(
        `${API_URL}/api/auth/register`,
        { username, password }, // Datos enviados en JSON
        { headers: { 'Content-Type': 'application/json' } } // Asegura que el backend lo reciba correctamente
      );

      console.log(response.data); // Ver qué responde el backend
      navigate('/login'); // Redirigir al login después de registrar
    } catch (err) {
      console.error(err.response?.data || err.message);
      setError('Error al registrar usuario');
    }
  };

  return (
    <div>
      <h1>Registro</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleRegister}>
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
        <button type="submit">Registrarse</button>
      </form>
    </div>
  );
};

export default Register;