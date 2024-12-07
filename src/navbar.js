import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './css/navbar.css';

function Navbar({ user, carrito }) {
    const [isOpen, setIsOpen] = useState(false);
    const [cantidad, setCantidad] = useState();

    useEffect(() => {
        // Suma todas las cantidades de los juegos en el carrito
        const totalCantidad = carrito.reduce((contador, juego) => contador + juego.cantidad, 0);
        setCantidad(totalCantidad);
    }, [carrito]);
    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    // Función para obtener iniciales
    const getIniciales = () => {
        if (!user || !user.nombre || !user.apellido) return '';
        const nombreInicial = user.nombre.charAt(0).toUpperCase();
        const apellidoInicial = user.apellido.charAt(0).toUpperCase();
        return `${nombreInicial}${apellidoInicial}`;
    };



    return (
        <nav className="navbar">
            <Link to="/" className="navbar-logo">
                EmiGamesHG
            </Link>
            {user ? (
            <li className="user-initials">
                {getIniciales()} 
            </li>)
: ""}
            <div className="navbar-container">

                <button className="navbar-toggle" onClick={toggleMenu}>
                    ☰
                </button>
                <ul className={`navbar-links ${isOpen ? 'open' : ''}`}>
                    <li>
                        <Link to="/">Home</Link>
                    </li>


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
                                <Link to="/miCarrito">Mi carrito ({cantidad})</Link>
                            </li>
                            <li>
                            <Link to="/miPerfil">Mi Perfil</Link>
                            </li>
                            <button
                                className="logout-button"
                                onClick={() => {
                                    localStorage.removeItem('user');
                                    window.location.href = '/';
                                }}
                            >
                                Cerrar sesión
                            </button>
                        </>
                    )}
                </ul>
            </div>
        </nav>
    );
}

export default Navbar;
