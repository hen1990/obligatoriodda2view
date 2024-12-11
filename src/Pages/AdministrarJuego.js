import React, { useState, useEffect } from 'react';
import '../css/administrarjuego.css';

const RegistroVideojuego = () => {
  const [videojuegoData, setVideojuegoData] = useState({
    nombre: '',
    descripcion: '',
    precio: '',
    imagen: '',
    cantidadCopias: '',
    descuento: '',
    categoria: { id: 1 },
  });

  const [videojuegos, setVideojuegos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [editingVideojuego, setEditingVideojuego] = useState(null);
  const [filtroCantidad, setFiltroCantidad] = useState(50);
  const [editando, setEditando] = useState(false);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriasRes, videojuegosRes] = await Promise.all([
          fetch('https://obligatorio2dda.onrender.com/categoria'),
          fetch('https://obligatorio2dda.onrender.com/videojuego'),
        ]);

        if (categoriasRes.ok && videojuegosRes.ok) {
          const categoriasData = await categoriasRes.json();
          const videojuegosData = await videojuegosRes.json();
          setCategorias(categoriasData);
          setVideojuegos(videojuegosData);
        } else {
          console.error('Error al obtener datos');
        }
      } catch (error) {
        console.error('Error al conectar con el servidor:', error);
      }
    };

    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setVideojuegoData({ ...videojuegoData, [name]: value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const url = editingVideojuego
        ? `https://obligatorio2dda.onrender.com/videojuego/${editingVideojuego}`
        : 'https://obligatorio2dda.onrender.com/videojuego';

      const method = editingVideojuego ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(videojuegoData),
      });

      if (response.ok) {
        alert(editingVideojuego ? 'Videojuego actualizado exitosamente' : 'Videojuego registrado exitosamente');
        setVideojuegoData({
          nombre: '',
          descripcion: '',
          precio: 0,
          imagen: '',
          cantidadCopias: 0,
          descuento: 0,
          categoria: { id: 1 },
        });
        setEditingVideojuego(null);

        const updatedVideojuegos = await fetch('https://obligatorio2dda.onrender.com/videojuego').then((res) =>
          res.json()
        );
        setVideojuegos(updatedVideojuegos);
      } else {
        const errorText = await response.text();
        alert(`Error al registrar/actualizar videojuego: ${errorText}`);
      }
    } catch (error) {
      console.error('Error al registrar/actualizar videojuego:', error);
      alert('Error al conectar con el servidor');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar este videojuego?')) return;

    try {
      const response = await fetch(`https://obligatorio2dda.onrender.com/videojuego/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        alert('Videojuego eliminado exitosamente');
        setVideojuegos(videojuegos.filter((v) => v.id !== id));
      } else {
        alert('Error al eliminar el videojuego');
      }
    } catch (error) {
      console.error('Error al eliminar videojuego:', error);
      alert('Error al conectar con el servidor');
    }
  };

  const handleEdit = (videojuego) => {
    setEditingVideojuego(videojuego.id);
    setVideojuegoData(videojuego);
  };

  const handleCancelar = () => {
    setEditingVideojuego('');
setVideojuegoData({
  nombre: '',
  descripcion: '',
  precio: 0,
  imagen: '',
  cantidadCopias: 0,
  descuento: 0,
  categoria: { id: 1 },})

  };

  const filteredVideojuegos = videojuegos.filter(
    (videojuego) => videojuego.cantidadCopias <= filtroCantidad
  );

  return (
    <div className="register-container">
       <h1>Gestión de Juegos</h1>
   
    <div className="register-container2">
      <div className="register-form-container">
      <h2>Agregar Videojuego</h2>
        <form onSubmit={handleRegister}>
          <input
            type="text"
            name="nombre"
            placeholder="Nombre"
            value={videojuegoData.nombre}
            onChange={handleChange}
            required
          />
          <textarea
            name="descripcion"
            placeholder="Descripción"
            value={videojuegoData.descripcion}
            onChange={handleChange}
          />
          <input
            type="number"
            name="precio"
            placeholder="Precio"
            value={videojuegoData.precio}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="imagen"
            placeholder="URL de Imagen"
            value={videojuegoData.imagen}
            onChange={handleChange}
            required
          />
          <input
            type="number"
            name="cantidadCopias"
            placeholder="Cantidad de Copias"
            value={videojuegoData.cantidadCopias}
            onChange={handleChange}
            required
          />
          <input
            type="number"
            name="descuento"
            placeholder="Descuento (opcional)"
            value={videojuegoData.descuento}
            onChange={handleChange}
          />
          <select
            name="categoria"
            onChange={(e) =>
              setVideojuegoData({ ...videojuegoData, categoria: { id: parseInt(e.target.value) } })
            }
            value={videojuegoData.categoria.id}
            required
          >
            {categorias.map((categoria) => (
              <option key={categoria.id} value={categoria.id}>
                {categoria.nombre}
              </option>
            ))}
          </select>

          <button type="submit">{editingVideojuego ? 'Actualizar' : 'Registrar'} Videojuego</button>
        </form>

        <div className="filter-container">
          <label>Filtrar por cantidad de copias menores o iguales a:</label>
          <input
            type="number"
            value={filtroCantidad}
            onChange={(e) => setFiltroCantidad(parseInt(e.target.value))}
          />
        </div>
      </div>

      <div className="videojuegos-list">
        <h2>Lista de Videojuegos</h2>
        <ul>
          {filteredVideojuegos.map((videojuego) => (
            <li key={videojuego.id}>
                <img src={videojuego.imagen} alt={videojuego.nombre} className="juego-list-imagen" />
              <div className='videojuegos-list-item'>
                <strong>{videojuego.nombre}</strong> {videojuego.precio} $
                <p>Copias: {videojuego.cantidadCopias}</p>
                </div>
                <div className='videojuegos-list-contenedor-botones'>
                  
                {videojuegoData.id != videojuego.id ? 
                <>
                 <button className='editar' onClick={() => handleEdit(videojuego)}>Editar</button>
                 <button className='eliminar' onClick={() => handleDelete(videojuego.id)}>Eliminar</button>
                </>
                 :
                <button className='editar' onClick={() => handleCancelar()}>Cancelar</button>
                }
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
    </div>
  );
};

export default RegistroVideojuego;
