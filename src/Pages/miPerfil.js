import React, { useState } from "react";
import "../css/miPerfil.css";

function MiPerfil({ user, setUser }) {
    //Verificacion en el local Storage
    const [existeUsuario, setexisteUsuario] = useState(() => {
        const storedUser = localStorage.getItem('user');
        return storedUser ? JSON.parse(storedUser) : null;
    });

    if (!existeUsuario) {
        window.location.href = '/';
    }

    const [nombre, setNombre] = useState(user.nombre);
    const [apellido, setApellido] = useState(user.apellido);
    const [tipoUsuario, setTipoUsuario] = useState(user.tipoUsuario.id);
    const [tarjetaCredito, setTarjetaCredito] = useState("");

    const actualizarPerfil = () => {
        const body = {
            nombre,
            apellido,
            tipoUsuario: { id: tipoUsuario },
            ...(tipoUsuario === 2 && { tarjetaCredito }), // Agregar tarjeta si es Premium
        };

        fetch(`https://obligatorio2dda.onrender.com/usuario/${user.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
        })
            .then((response) => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error("Error al actualizar el perfil");
                }
            })
            .then((data) => {
                // Actualizar el estado global del usuario
                const updatedUser = {
                    ...user,
                    nombre: data.nombre,
                    apellido: data.apellido,
                    tipoUsuario: data.tipoUsuario,
                };

                // Guardar en el estado y en localStorage
                setUser(updatedUser);
                localStorage.setItem("user", JSON.stringify(updatedUser));
                alert("Perfil actualizado exitosamente");
            })
            .catch((error) => {
                console.error(error);
                alert("Hubo un error al actualizar el perfil");
            });
    };

    return (
        <div className="mi-perfil-container">
            <div className="mi-perfil-form-container">
                <h1>Mi Perfil</h1>
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        actualizarPerfil();
                    }}
                >
                    <div className="form-group">
                        <label>Nombre:</label>
                        <input
                            type="text"
                            value={nombre}
                            onChange={(e) => setNombre(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Apellido:</label>
                        <input
                            type="text"
                            value={apellido}
                            onChange={(e) => setApellido(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Tipo de Usuario:</label>
                        <select
                            value={tipoUsuario}
                            onChange={(e) => setTipoUsuario(Number(e.target.value))}
                        >
                            <option value={1}>Estándar</option>
                            <option value={2}>Premium</option>
                        </select>
                    </div>
                    {tipoUsuario === 2 && (
                        <div className="form-group">
                            <label>Tarjeta de Crédito:</label>
                            <input
                                type="text"
                                value={tarjetaCredito}
                                onChange={(e) => setTarjetaCredito(e.target.value)}
                                required
                            />
                        </div>
                    )}
                    <button type="submit" className="btn-actualizar">
                        Actualizar Perfil
                    </button>
                </form>
            </div>
        </div>
    );
}

export default MiPerfil;
