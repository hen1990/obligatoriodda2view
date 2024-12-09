import React, { useState, useEffect } from 'react';
import '../css/registro.css';
import { Link } from 'react-router-dom';

const Registro = () => {
  const [userData, setUserData] = useState({
    nombre: '',
    apellido: '',
    email: '',
    password: '',
    fechaNacimiento: '',
    tipoUsuario: { id: 1 }, // Valor predeterminado: Estandar
    tarjetaCredito: '',
    descuento: 0,
  });

  const [tiposUsuario, setTiposUsuario] = useState([]); // Estado para guardar los tipos de usuario

  // Obtener los tipos de usuario desde el backend
  useEffect(() => {
    const fetchTiposUsuario = async () => {
      try {
        const response = await fetch('http://localhost:5001/tipoUsuario');
        if (response.ok) {
          const data = await response.json();
          setTiposUsuario(data); // Guardar los tipos de usuario en el estado
        } else {
          console.error('Error al obtener los tipos de usuario');
        }
      } catch (error) {
        console.error('Error al conectar con el servidor:', error);
      }
    };

    fetchTiposUsuario();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    const dataToSend = { ...userData };

    if (userData.tipoUsuario.id === 2) { // Validación si es premium
      if (!userData.tarjetaCredito) {
        alert('Debes ingresar una tarjeta de crédito para usuarios premium');
        return;
      }
    } else {
      delete dataToSend.tarjetaCredito;
      delete dataToSend.descuento;
    }

    try {
      const response = await fetch('http://localhost:5001/usuario', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSend),
      });

      if (response.ok) {
        alert('Usuario registrado exitosamente');
        window.location.href = '/';
      } else {
        const errorText = await response.text();
        alert(`Error al registrar usuario. ${errorText}`);
      }
    } catch (error) {
      console.error('Error al registrar usuario.', error);
      alert('Error al conectar con el servidor.');
    }
  };

  return (
    <div className="registro-container">
      <div className="registro-form-container">
        <form onSubmit={handleRegister}>
          <input type="text" name="nombre" placeholder="Nombre" onChange={handleChange} required />
          <input type="text" name="apellido" placeholder="Apellido" onChange={handleChange} required />
          <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
          <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
          <input type="date" name="fechaNacimiento" onChange={handleChange} required />

          {/* Select dinámico para los tipos de usuario */}
          <select
            name="tipoUsuario"
            onChange={(e) => setUserData({ ...userData, tipoUsuario: { id: parseInt(e.target.value) } })}
            required
          >
            {tiposUsuario.map((tipo) => (
              <option key={tipo.id} value={tipo.id}>
                {tipo.nombreTipoUsuario}
              </option>
            ))}
          </select>

          {/* Campos adicionales para usuarios premium */}
          {userData.tipoUsuario.id === 2 && (
            <>
              <input type="text" name="tarjetaCredito" placeholder="Tarjeta de Crédito" onChange={handleChange} required />
            </>
          )}

          <button type="submit">Registrarse</button>
        </form>
        <p>¿Ya tienes una cuenta? <Link to="/">Iniciar Sesión</Link></p>
      </div>
    </div>
  );
};

export default Registro;
