import React, { useState, useEffect } from 'react';
import '../css/administrarjuego.css';

const RegistroVideojuego = () => {
  const [videojuegoData, setVideojuegoData] = useState({
    nombre: '',
    descripcion: '',
    precio: 0,
    imagen: '',
    cantidadCopias: 0,
    descuento: 0,
    categoria: { id: 1 },
  });

  const [videojuegos, setVideojuegos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [editingVideojuego, setEditingVideojuego] = useState(null);
  const [filtroCantidad, setFiltroCantidad] = useState(50);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriasRes, videojuegosRes] = await Promise.all([
          fetch('http://localhost:5001/categoria'),
          fetch('http://localhost:5001/videojuego'),
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
        ? `http://localhost:5001/videojuego/${editingVideojuego}`
        : 'http://localhost:5001/videojuego';

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

        const updatedVideojuegos = await fetch('http://localhost:5001/videojuego').then((res) =>
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
      const response = await fetch(`http://localhost:5001/videojuego/${id}`, {
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

  const filteredVideojuegos = videojuegos.filter(
    (videojuego) => videojuego.cantidadCopias <= filtroCantidad
  );

  return (
    <div className="register-container">
      <div className="register-form-container">
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
              <div>
                <strong>{videojuego.nombre}</strong> - {videojuego.precio} $
                <p>Cantidad de copias: {videojuego.cantidadCopias}</p>
                <button onClick={() => handleEdit(videojuego)}>Editar</button>
                <button onClick={() => handleDelete(videojuego.id)}>Eliminar</button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default RegistroVideojuego;
