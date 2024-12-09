import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './css/navbar.css';

function Navbar({ admin, user, carrito }) {
    const [isOpen, setIsOpen] = useState(false);
    const [cantidad, setCantidad] = useState(0);

    useEffect(() => {
        if (!admin && carrito) {
            // Suma todas las cantidades de los juegos en el carrito
            const totalCantidad = carrito.reduce((contador, juego) => contador + juego.cantidad, 0);
            setCantidad(totalCantidad);
        }
    }, [carrito, admin]);

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
            <Link to="/videojuego" className="navbar-logo">
                EmiGamesHG
            </Link>
            {user && (
                <li className="user-initials">
                    {getIniciales()}
                </li>
            )}
            <div className="navbar-container">
                <button className="navbar-toggle" onClick={toggleMenu}>
                    ☰
                </button>
                <ul className={`navbar-links ${isOpen ? 'open' : ''}`}>
                    {!admin ? (
                        <>
                            {!user ? (
                                <>
                                    <li>
                                        <Link to="/">Iniciar sesión</Link>
                                    </li>
                                    <li>
                                        <Link to="/registro">Registro</Link>
                                    </li>
                                    <li>
                                        <Link to="/administrador">Administración</Link>
                                    </li>
                                </>
                            ) : (
                                <>
                                    <li>
                                        <Link to="/videojuego">Videojuegos</Link>
                                    </li>
                                    <li>
                                        <Link to={`/mis-compras/${user.id}`}>Mis Compras</Link>
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
                        </>
                    ) : (
                        <>
                            <li>
                                <Link to="/administrarjuego">Videojuegos</Link>
                            </li>
                            <li>
                                <Link to="/categoria">Categorias</Link>
                            </li>
                            <li>
                                <Link to="/gestionarusuario">Usuarios</Link>
                            </li>
                            <button
                                className="logout-button"
                                onClick={() => {
                                    localStorage.removeItem('admin');
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