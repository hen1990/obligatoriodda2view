import React from 'react';
import { useState } from 'react';
import '../css/miCarrito.css';

function MiCarrito({ user, carrito, setCarrito }) {
    //Verificacion en el local Storage
    const [existeUsuario, setexisteUsuario] = useState(() => {
        const storedUser = localStorage.getItem('user');
        return storedUser ? JSON.parse(storedUser) : null;
    });

    if (!existeUsuario) {
        window.location.href = '/';
    }

    const isPremium = user.tipoUsuario.id === 2;

    const eliminarDelCarrito = (id) => {
        setCarrito((prevCarrito) => 
            prevCarrito.map((juego) =>
                juego.id === id 
                    ? { ...juego, cantidad: juego.cantidad - 1 }
                    : juego
            ).filter((juego) => juego.cantidad > 0) // Eliminar juegos con cantidad <= 0
        );
    };

    const agregarCopia = (id) => {
        setCarrito((prevCarrito) => 
            prevCarrito.map((juego) =>
                juego.id === id 
                    ? { ...juego, cantidad: juego.cantidad + 1 }
                    : juego
            )
        );
    };

    const calcularPrecioConDescuento = (precio, descuento) => {
        return (precio - (precio * descuento) / 100).toFixed(2);
    };

    const calcularTotal = () => {
        return carrito.reduce((total, item) => {
            // Si el usuario es Premium, aplica el descuento, de lo contrario usa el precio normal
            const precioFinal = isPremium 
                ? item.precio * (1 - (item.descuento || 0) / 100) 
                : item.precio;
            return total + precioFinal * item.cantidad;
        }, 0).toFixed(2);
    };

    const realizarCompra = () => {
        if (!carrito.length) {
            alert("El carrito está vacío.");
            return;
        }

        const body = {
            usuarioId: user.id,
            videojuegos: carrito.map((juego) => ({
                id: juego.id,
                cantidad: juego.cantidad,
            })),
        };

        fetch("http://localhost:5001/compra", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Error al realizar la compra");
                }
                return response.json();
            })
            .then(() => {
                alert("Compra realizada con éxito");
                setCarrito([]); // Vaciar carrito tras la compra
                localStorage.removeItem("carrito"); // Limpiar localStorage
            })
            .catch((error) => {
                console.error("Error al realizar la compra:", error);
                alert("Hubo un error al realizar la compra");
            });
    };


    return (
        <div className="mi-carrito">
            <h1>Mi Carrito</h1>
            {carrito.length === 0 ? (
                <p>Tu carrito está vacío.</p>
            ) : (
                <>
                    <ul className="lista-juegos">
                        {carrito.map((juego) => (
                            <li key={juego.id} className="juego-item">
                                <img src={juego.imagen} alt={juego.nombre} className="juego-imagen" />
                                <div className="juego-detalles">
                                    <h2>{juego.nombre}</h2>
                                    <p>
                                        {isPremium ? (
                                            <>
                                                {juego.descuento > 0 ? (
                                                    <>
                                                        {"$U" +
                                                            calcularPrecioConDescuento(juego.precio, juego.descuento) +
                                                            ` (-${juego.descuento}% Premium)`}
                                                    </>
                                                ) : (
                                                    "$U" + juego.precio
                                                )}
                                            </>
                                        ) : (
                                            "$U" + juego.precio
                                        )}
                                    </p>
                                    <button onClick={() => eliminarDelCarrito(juego.id)}>Eliminar</button>
                                    <span> {juego.cantidad} copia/s </span>
                                    <button onClick={() => agregarCopia(juego.id)}> + </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                    <div className="carrito-footer">
                        <button className="realizar-compra" onClick={realizarCompra}>
                            Realizar Compra
                        </button>
                        <span className="total-pagar">
                            Total: $U {calcularTotal()}
                        </span>
                    </div>

                </>
            )}
        </div>

    );
}

export default MiCarrito;
