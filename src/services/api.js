export const fetchUsers = async () => {
    const response = await fetch('http://localhost:5001/usuario');
    return response.json();
  };
  