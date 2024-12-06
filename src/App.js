import React from 'react';
import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Register from './Login/Registro';
import Login from './Login/Login';
import Videojuegos from "./Pages/Videojuego";
import Navbar from './navbar';


function App() {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  return (
    <Router>
      <Navbar user={user} />
      <Routes>
        <Route path="/" element={<Login setUser={setUser}  />} />
        <Route path="/registro" element={<Register />} />
        <Route path="/videojuego" element={<Videojuegos user={user} />} />
      </Routes>
    </Router>
  );
}

export default App;
