import React, { useState } from "react";
import PropTypes from "prop-types";
import "../css/videojuego.css";


const VideojuegoCard = ({ juego, isPremium }) => {
    const [hover, setHover] = useState(false);

    const calcularPrecioConDescuento = (precio, descuento) => {
        return (precio - (precio * descuento) / 100).toFixed(2);
    };

    return (
        <div
            className="card"
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
        >
            <img
                src={juego.imagen}
                alt={juego.nombre}
                className={`card-image ${hover ? "blur" : ""}`}
            />
            {hover && (
                <div className="card-hover-info">
                    <h3>{juego.nombre}</h3>
                    <p>{juego.descripcion}</p>
                    <span className="categoria">{juego.categoria.nombre}</span>
                </div>
            )}
            <div className="card-info">
                <p>
                    {isPremium ? (
                        <>
                            {juego.descuento > 0 ? (
                                <span className="precio-oferta">
                                    {"$U" +
                                        calcularPrecioConDescuento(juego.precio, juego.descuento) +
                                        ` (-${juego.descuento}% Premium)`}
                                </span>
                            ) : (
                                "$U" + juego.precio
                            )}
                        </>
                    ) : (
                        "$U" + juego.precio
                    )}
                </p>
            </div>
        </div>
    );
};

VideojuegoCard.propTypes = {
    juego: PropTypes.shape({
        id: PropTypes.number.isRequired,
        nombre: PropTypes.string.isRequired,
        descripcion: PropTypes.string.isRequired,
        imagen: PropTypes.string.isRequired,
        precio: PropTypes.number.isRequired,
        descuento: PropTypes.number.isRequired,
        categoria: PropTypes.shape({
            id: PropTypes.number.isRequired,
            nombre: PropTypes.string.isRequired,
        }).isRequired,
    }).isRequired,
    isPremium: PropTypes.bool.isRequired,
};

export default VideojuegoCard;
