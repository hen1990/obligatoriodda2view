import React from 'react';
import { Link } from 'react-router-dom';
import './css/navbar.css';

function Navbar({ user }) {
  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to="/">Mi App</Link>
      </div>
      <ul className="navbar-links">
        {!user ? (
          <>
            <li>
              <Link to="/">Iniciar sesión</Link>
            </li>
            <li>
              <Link to="/registro">Registro</Link>
            </li>
          </>
        ) : (
          <>
            <li>
              <Link to="/videojuego">Videojuegos</Link>
            </li>
            <li>
              <button
                className="logout-button"
                onClick={() => {
                  localStorage.removeItem('user');
                  window.location.href = '/';
                }}
              >
                Cerrar sesión
              </button>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
}

export default Navbar;
