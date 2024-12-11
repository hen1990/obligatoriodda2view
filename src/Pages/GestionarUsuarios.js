import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../css/gestionarusuarios.css';

const UsuariosPage = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [filtro, setFiltro] = useState('todos');

  // Obtener usuarios desde el servidor
  useEffect(() => {
    fetch('https://obligatorio2dda.onrender.com/usuario')
      .then(response => response.json())
      .then(data => setUsuarios(data))
      .catch(error => console.error('Error al obtener usuarios:', error));
  }, []);

  // Manejo de filtro
  const handleFiltroChange = (e) => {
    setFiltro(e.target.value);
  };

  const usuariosFiltrados = usuarios.filter(usuario => {
    if (filtro === 'todos') return true;
    if (filtro === 'premium') return usuario.tipoUsuario.nombreTipoUsuario === 'Premium';
    if (filtro === 'noPremium') return usuario.tipoUsuario.nombreTipoUsuario !== 'Premium';
    return true;
  });

  return (
    <div className="usuarios-container">
      <h1>Lista de Usuarios</h1>
      <div className="filtro-container">
        <label htmlFor="filtro">Filtrar usuarios: </label>
        <select id="filtro" value={filtro} onChange={handleFiltroChange}>
          <option value="todos">Todos</option>
          <option value="premium">Premium</option>
          <option value="noPremium">No Premium</option>
        </select>
      </div>

      <div className="usuarios-list">
        {usuariosFiltrados.length > 0 ? (
          usuariosFiltrados.map(usuario => (
            <div className="usuario-item" key={usuario.id}>
              <div className="usuario-detalles">
                <h2>{usuario.nombre} {usuario.apellido}</h2>
                <p>Email: {usuario.email}</p>
                <p>Tipo Usuario: {usuario.tipoUsuario.nombreTipoUsuario}</p>
              </div>
              <div className="usuario-boton">
              <Link to={`/mis-compras/${usuario.id}`}>
                  <button className="ver-compras">Ver Compras</button>
                </Link>
              </div>
            </div>
          ))
        ) : (
          <h3 className="vacio_h3">No hay usuarios para mostrar</h3>
        )}
      </div>
    </div>
  );
};

export default UsuariosPage;
