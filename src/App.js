import React from 'react';
import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Register from './Login/Registro';
import Login from './Login/Login';
import Videojuegos from "./Pages/Videojuego";
import DetalleVideojuego from './Pages/DetalleVideojuego';
import MiCarrito from './Pages/MiCarrito';
import MisCompras from './Pages/MisCompras';
import MiPerfil from './Pages/miPerfil';
import Navbar from './navbar';


function App() {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const agregarAlCarrito = (juego) => {
    setCarrito((prevCarrito) => {
        const existe = prevCarrito.find((item) => item.id === juego.id);
        if (existe) {
            // Si ya existe, incrementar la cantidad
            return prevCarrito.map((item) =>
                item.id === juego.id
                    ? { ...item, cantidad: item.cantidad + 1 }
                    : item
            );
        } else {
            // Si no existe, agregarlo con cantidad inicial de 1
            return [...prevCarrito, { ...juego, cantidad: 1 }];
        }
    });
    alert(`${juego.nombre} ha sido agregado al carrito`);
};

  const [carrito, setCarrito] = useState(() => {
    const storedCarrito = localStorage.getItem('carrito');
    return storedCarrito ? JSON.parse(storedCarrito) : [];
});

// Guardar carrito en localStorage cada vez que cambie
useEffect(() => {
    localStorage.setItem('carrito', JSON.stringify(carrito));
}, [carrito]);


  return (
    <Router>
      <Navbar user={user} carrito={carrito}/>
      <Routes>
        <Route path="/" element={<Login setUser={setUser}  />} />
        <Route path="/registro" element={<Register />} />
        <Route path="/videojuego" element={<Videojuegos user={user} />} />
        <Route path="/videojuego/:id" element={<DetalleVideojuego user={user} agregarAlCarrito={agregarAlCarrito} />} />
        <Route path="/miCarrito" element={<MiCarrito user={user} carrito={carrito} setCarrito={setCarrito} />} />
        <Route path="/mis-compras" element={<MisCompras user={user} />} />
        <Route path="/miPerfil" element={<MiPerfil user={user} setUser={setUser} />} />
       
      </Routes>
    </Router>
  );
}

export default App;
