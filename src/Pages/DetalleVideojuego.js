import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import "../css/detalleVideoJuego.css";

function DetalleVideojuego({ user, agregarAlCarrito }) {
    
    const { id } = useParams();
    const [juego, setJuego] = useState(null);

    //Verificacion en el local Storage
    const [existeUsuario, setexisteUsuario] = useState(() => {
        const storedUser = localStorage.getItem('user');
        return storedUser ? JSON.parse(storedUser) : null;
    });

    if (!existeUsuario) {
        window.location.href = '/';
    }
    
    const isPremium = user.tipoUsuario.id === 2;

    useEffect(() => {
        fetch(`http://localhost:5001/videojuego/${id}`)
            .then((response) => response.json())
            .then((data) => setJuego(data))
            .catch((error) => console.error('Error fetching videojuego:', error));
    }, [id]);

    if (!juego) {
        return <p>Loading...</p>;
    }

    return (

        <div className="detalle-videojuego">
            <div className="contenido-videojuego">
                {/* Imagen del videojuego */}
                <div className="imagen-container">
                    <img src={juego.imagen} alt={juego.nombre} className="imagen" />
                </div>

                {/* Información del videojuego */}
                <div className="info-container">
                    <div className="titulo">
                        <h1>{juego.nombre}</h1>
                    </div>

                    <div className="precio-container">
                        <div className="precio">
                            {isPremium ? (
                                <span className="precio-oferta">
                                    {"$U" + (juego.precio * (1 - juego.descuento / 100)).toFixed(2) + " "}
                                    <span className="precio-original">{"$U" + juego.precio}</span>
                                </span>
                            ) : (
                                <span className="precio-normal">{"$U" + juego.precio}</span>
                            )}

                        </div>
                        <button className="agregar-carrito"
                            onClick={() => agregarAlCarrito(juego)}>
                            Agregar al carrito
                        </button>
                    </div>

                    <div className="descripcion-container">
                        <p>{juego.descripcion}</p>
                        <span className="categoria">{juego.categoria.nombre}</span>
                    </div>
                </div>
            </div>
        </div>

    );
}

export default DetalleVideojuego;
