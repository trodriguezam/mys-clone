import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, CircularProgress } from '@mui/material';

const UserConfig = () => {

  const [user, setUser] = useState({
    username: "No user found",
    email: "No user found",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem('user'));
    const fetchUser = () => {
      if (currentUser) {
        setUser({
          username: currentUser.username,
          email: currentUser.email,
        });
      }
      setLoading(false);
    };

    fetchUser();
  }, []); // Empty dependency array

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
      </Paper>
    </Box>
  );
};

export default UserConfig;
