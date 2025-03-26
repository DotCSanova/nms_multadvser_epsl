import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { register, error } = useAuth();
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    const success = await register(username, password);
    if (success) {
      navigate('/login');
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
        <button type="submit">Registrarse aqui</button>
      </form>
    </div>
  );
};

export default Register;