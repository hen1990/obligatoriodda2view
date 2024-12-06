import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../css/login.css';

const Login = ({ setUser }) => {
  
  //Verificacion en el local Storage
  const [existeUsuario, setexisteUsuario] = useState(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });
  
  if(existeUsuario) {
    setUser(existeUsuario);
    window.location.href = '/videojuego';
  }

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  console.log(email, password);
  const handleLogin = async (e) => {
    e.preventDefault();

    try {
    const response = await fetch('http://localhost:5001/usuario/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });


    
    if (response.ok) {console.log("response: " + response)
      const userData = await response.json();
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);

      window.location.href = '/videojuego';
    
    } else {
      alert('Credenciales incorrectas');
    }
  }catch (error) {
    console.error('Error en la conexión:', error);
  }
};

  return (
    <div className="login-container body-fondo">
      <div className="login-form-container">
        <h2>Iniciar Sesión</h2>
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Iniciar Sesión</button>
        </form>
        <p>¿No tienes cuenta? <Link to="/registro">Regístrate aquí</Link></p>
      </div>
    </div>
  );
};

export default Login;
