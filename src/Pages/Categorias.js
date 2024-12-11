import React, { useState, useEffect } from "react";
import "../css/categoria.css";

function Categorias() {
    const [categorias, setCategorias] = useState([]);
    const [nuevaCategoria, setNuevaCategoria] = useState("");
    const [categoriaEditando, setCategoriaEditando] = useState(null);
    const [nombreEditado, setNombreEditado] = useState("");

    useEffect(() => {
        // Cargar las categorías al montar el componente
        fetch("https://obligatorio2dda.onrender.com/categoria")
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Error al obtener categorías");
                }
                return response.json();
            })
            .then((data) => setCategorias(data))
            .catch((error) => console.error("Error:", error));
    }, []);

    // Crear una nueva categoría
    const agregarCategoria = () => {
        if (!nuevaCategoria.trim()) {
            alert("El nombre de la categoría no puede estar vacío");
            return;
        }

        fetch("https://obligatorio2dda.onrender.com/categoria", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ nombre: nuevaCategoria }),
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Error al agregar categoría");
                }
                alert(`Categoría Agregada.`);
                return response.json();
            })
            .then((nueva) => {
                setCategorias([...categorias, nueva]);
                setNuevaCategoria("");
            })
            .catch((error) => console.error("Error al agregar categoría:", error));
    };

    // Eliminar una categoría
    const eliminarCategoria = (id) => {
        fetch(`https://obligatorio2dda.onrender.com/categoria/${id}`, {
            method: "DELETE",
        })
            .then((response) => {
                if (!response.ok) {
                    alert(`No se puede eliminar la Categoría. Verifique que no esté asociada a ningún Juego.`);
                    throw new Error("Error al eliminar categoría");
                }
                setCategorias(categorias.filter((categoria) => categoria.id !== id));
                alert(`Categoría eliminada.`);
            })
            .catch((error) => console.error("Error al eliminar categoría:", error));
    };

    // Editar una categoría
    const guardarEdicion = (id) => {
        if (!nombreEditado.trim()) {
            alert("El nombre de la categoría no puede estar vacío");
            return;
        }

        fetch(`https://obligatorio2dda.onrender.com/categoria/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ nombre: nombreEditado }),
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Error al editar categoría");
                }
                setCategorias(
                    categorias.map((categoria) =>
                        categoria.id === id ? { ...categoria, nombre: nombreEditado } : categoria
                    )
                );
                setCategoriaEditando(null);
                setNombreEditado("");
            })
            .catch((error) => console.error("Error al editar categoría:", error));
    };

    return (
        <div className="categorias-container">
            <h1>Gestión de Categorías</h1>
            <div className="agregar-categoria">
                <input
                    type="text"
                    value={nuevaCategoria}
                    onChange={(e) => setNuevaCategoria(e.target.value)}
                    placeholder="Nueva categoría"
                />
                <button onClick={agregarCategoria}>Agregar</button>
            </div>

            <ul className="lista-categorias">
                {categorias.map((categoria) => (
                    <li key={categoria.id} className="categoria-item">
                        {categoriaEditando === categoria.id ? (
                            <div className="categoria-detalles">
                                <input className="input"
                                    type="text"
                                    value={nombreEditado}
                                    onChange={(e) => setNombreEditado(e.target.value)}
                                    placeholder="Editar nombre"
                                />
                                <div className="categoria-contenedor-botones">
                                <button  className="editar" onClick={() => 
                                    guardarEdicion(categoria.id)}>Guardar</button>
                                <button  className="eliminar" onClick={() => 
                                    setCategoriaEditando(null)}>Cancelar</button>
                            
                               </div>
                            </div>
                        ) : (
                            <div className="categoria-detalles">
                                <p className="categoria-nombre">{categoria.nombre}</p>
                                <div className="categoria-contenedor-botones">
                                <button className="editar" onClick={() => {
                                    setCategoriaEditando(categoria.id);
                                    setNombreEditado(categoria.nombre);
                                }}>Editar</button>
                                <button className="eliminar" onClick={() => eliminarCategoria(categoria.id)}>Eliminar</button>
                                </div>
                            </div>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default Categorias;
