import React, { useEffect, useState } from "react";
import "../css/misCompras.css";

function MisCompras({ user }) {
    //Verificacion en el local Storage
    const [existeUsuario, setexisteUsuario] = useState(() => {
        const storedUser = localStorage.getItem('user');
        return storedUser ? JSON.parse(storedUser) : null;
    });

    if (!existeUsuario) {
        window.location.href = '/';
    }
    
    const [compras, setCompras] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user && user.id) {
            fetch(`http://localhost:5001/compra/${user.id}`)
                .then((response) => {
                    if (!response.ok) {
                        throw new Error("Error al obtener las compras");
                    }
                    return response.json();
                })
                .then((data) => {
                    setCompras(data);
                    setLoading(false);
                })
                .catch((error) => {
                    console.error("Error al cargar compras:", error);
                    setLoading(false);
                });
        }
    }, [user]);

    if (loading) {
        return <p>Cargando...</p>;
    }

    if (!compras || compras.length === 0) {
        return <p>No tienes compras registradas.</p>;
    }

    return (
        <div className="mis-compras-container">
            <h1>Mis Compras</h1>
            {compras.map((compra, index) => (
                <div key={index} className="compra-card">
                    <h2>Compra realizada el: {new Date(compra.fechaCompra).toLocaleString()}</h2>
                    <p>Total: $U{compra.totalCompra.toFixed(2)}</p>
                    <div className="compras-videojuegos">
                        {compra.videojuegos.map((juego) => (
                            <div key={juego.id} className="compra-item">
                                <img src={juego.imagen} alt={juego.nombre} className="compra-imagen" />
                                <div className="compra-info">
                                    <h3>{juego.nombre}</h3>
                                    <p>Género: {juego.categoria.nombre}</p>
                                    <p>Cantidad: {juego.cantidad}</p>
                                    <p>Precio Unitario: $U{juego.precio.toFixed(2)}</p>
                                    <p>
                                        Subtotal: $U
                                        {(juego.precio * juego.cantidad).toFixed(2)}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}

export default MisCompras;
