import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, CircularProgress, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const UserConfig = () => {

  const [user, setUser] = useState({
    username: "No user found",
    email: "No user found",
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

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

  const handleNavigate = () => {
    navigate('/preferences'); // Correct way to handle navigation
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '20px', marginTop: '4%' }}>
      <Paper elevation={3} sx={{ padding: '20px', maxWidth: '400px', width: '100%' }}>
        <Typography variant="h4" gutterBottom>
          {user.username}
        </Typography>
        <Typography variant="body1" gutterBottom>
          <strong>Email:</strong> {user.email}
        </Typography>
      </Paper>
      
      {/* Button placed below the Paper */}
      <Button
        variant="contained"
        color="primary"
        onClick={handleNavigate}
        sx={{ '&:hover': { backgroundColor: '#555' }, fontFamily: "Montserrat, sans-serif", backgroundColor: "#fd7b7b", color: "#ffffff", marginTop: '20px', alignSelf: 'center' }}
      >
        Go to Preferences
      </Button>
    </Box>
  );
};

export default UserConfig;
