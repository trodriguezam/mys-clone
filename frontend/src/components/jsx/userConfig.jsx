import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, CircularProgress } from '@mui/material';

const UserConfig = () => {
  const [user, setUser] = useState({
    username: "No user found",
    email: "No user found",
    phone: "No user found",
    address: "No user found"
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/users/');
        const data = await response.json();
        console.log(data);
        const currentUser = data.find(u => u.id === parseInt(localStorage.getItem('user')));
        if (currentUser) {
          setUser({
            username: currentUser.username,
            email: currentUser.email,
            phone: currentUser.phone,
            address: currentUser.address
          });
        }
      } catch (error) {
        console.error("Error al obtener los usuarios:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []); 

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', padding: '20px' }}>
      <Paper elevation={3} sx={{ padding: '20px', maxWidth: '400px', width: '100%' }}>
        <Typography variant="h4" gutterBottom>
          {user.username}
        </Typography>
        <Typography variant="body1" gutterBottom>
          <strong>Email:</strong> {user.email}
        </Typography>
        <Typography variant="body1" gutterBottom>
          <strong>Phone:</strong> {user.phone}
        </Typography>
      </Paper>
    </Box>
  );
};

export default UserConfig;