import React, { useEffect, useState } from "react";
import "../css/videojuego.css";
import VideojuegoCard from "../componentes/videojuegoCard";

const Videojuegos = ({ user }) => {
  //Verificacion en el local Storage
  const [existeUsuario, setexisteUsuario] = useState(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  if (!existeUsuario) {
    window.location.href = '/';
  }

  const [videojuegos, setVideojuegos] = useState([]);
  const isPremium = user.tipoUsuario.id === 2;
  ;
  useEffect(() => {
    const getVideojuegos = async () => {
      try {
        const response = await fetch("https://obligatorio2dda.onrender.com/videojuego");
        if (response.ok) {
          const data = await response.json();
          setVideojuegos(data);
        } else {
          console.error("Error al obtener videojuegos");
        }
      } catch (error) {
        console.error("Error en la conexión:", error);
      }
    };

    console.log("usuario" + user)
    getVideojuegos();
  }, []);

  return (
    <div className="videojuegos-container body-fondo">
      <h1 className="videojuegos-title">Catálogo de Videojuegos</h1>
      <div className="cards-container">
      {videojuegos.map((juego) => (
        <VideojuegoCard key={juego.id} juego={juego} isPremium={isPremium} />
      ))}
      </div>
    </div>
  );
};

export default Videojuegos;
