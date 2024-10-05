import React, { useState, useEffect } from 'react';

const Home = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/users');
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error("Error al obtener los usuarios:", error);
    }
  };

  const saveUser = async (user) => {
    try {
      const response = await fetch('http://localhost:8000/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
      });
      if (response.ok) {
        const newUser = await response.json();
        setUsers(prevUsers => [...prevUsers, newUser]);
      } else {
        console.error("Error al guardar el usuario");
      }
    } catch (error) {
      console.error("Error al guardar el usuario:", error);
    }
  };

  // Función de ejemplo para usar saveUser
  const handleAddUser = () => {
    const newUser = { nombre: 'Nuevo Usuario', email: 'nuevo@ejemplo.com' };
    saveUser(newUser);
  };

  return (
    <div>
      <h1>Usuarios</h1>
      <button onClick={handleAddUser}>Agregar Usuario</button>
      <ul>
        {users.map(user => (
          <li key={user.id}>{user.nombre} - {user.email}</li>
        ))}
      </ul>
    </div>
  );
};

export default Home;