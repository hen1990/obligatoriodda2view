export const fetchUsers = async () => {
    const response = await fetch('https://obligatorio2dda.onrender.com/usuario');
    return response.json();
  };
  