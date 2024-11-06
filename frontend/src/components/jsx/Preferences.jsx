import React, { useState, useEffect } from 'react';
import '../css/Home.css';
import axiosInstance from '../PageElements/axiosInstance';
import { useNavigate } from 'react-router-dom';
import { TextField, MenuItem, FormControl, InputLabel, Select, Checkbox, FormControlLabel, Button, Container, Paper, Typography, Grid } from '@mui/material';

const Preferences = () => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || {});
  const ID = user ? parseInt(user.user_id, 10) : null;
  const [ready, setReady] = useState(true);
  const navigate = useNavigate();

  const [preferences, setPreferences] = useState({
    colores: [],
    tipos: [],
    marcas: [],
  });

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    const storedPreferences = JSON.parse(localStorage.getItem('preferences'));

    if (storedUser) {
      setUser(storedUser);
    }

    if (storedPreferences) {
      setPreferences(storedPreferences);
      if (storedPreferences.colores.length === 0 || storedPreferences.tipos.length === 0 || storedPreferences.marcas.length === 0) {
        setReady(false);
      } else {
        setReady(true);
      }
    }
  }, []);

  useEffect(() => {
    const preferredColors = JSON.parse(user?.preferred_colores || "[]");
    const preferredBrands = JSON.parse(user?.preferred_marcas || "[]");
    const preferredTypes = JSON.parse(user?.preferred_tipos || "[]");

    const newPreferences = {
      colores: preferredColors,
      tipos: preferredTypes,
      marcas: preferredBrands,
    };

    setPreferences(newPreferences);

    if (preferredColors.length === 0 || preferredBrands.length === 0 || preferredTypes.length === 0) {
      setReady(false);
    } else {
      setReady(true);
    }

    localStorage.setItem('preferences', JSON.stringify(newPreferences));
  }, [user]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === 'checkbox') {
      setPreferences((prevState) => {
        const newColor = checked
          ? [...prevState.colores, value]
          : prevState.colores.filter((item) => item !== value);
        return { ...prevState, colores: newColor };
      });
    } else if (name === "tipos" || name === "marcas") {
      setPreferences((prevState) => ({
        ...prevState,
        [name]: typeof value === "string" ? value.split(",") : value,
      }));
    } else {
      setPreferences((prevState) => ({ ...prevState, [name]: value }));
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await axiosInstance.put(`/users/${user.user_id}/`, {
        preferred_colores: JSON.stringify(preferences.colores),
        preferred_tipos: JSON.stringify(preferences.tipos),
        preferred_marcas: JSON.stringify(preferences.marcas),
      });
      user.preferred_colores = JSON.stringify(preferences.colores);
      user.preferred_tipos = JSON.stringify(preferences.tipos);
      user.preferred_marcas = JSON.stringify(preferences.marcas);

      localStorage.setItem('user', JSON.stringify(user));
      navigate('/home');
    } catch (error) {
      console.error("Error updating preferences:", error);
    }
  };

  return (
    <Container component="main" maxWidth="xs" >
      <Paper sx={{ padding: 3, display: 'flex', flexDirection: 'column', marginTop: 10 }}>
        <Typography variant="h5" gutterBottom>
          Filter Clothes
        </Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            {/* Category Filter (Multiple Selection) */}
            <Grid item xs={12}>
              <FormControl fullWidth variant="outlined">
                <InputLabel>Category</InputLabel>
                <Select
                  label="Category"
                  name="tipos"
                  value={preferences.tipos}
                  onChange={handleChange}
                  multiple
                >
                  <MenuItem value="shirts">Shirts</MenuItem>
                  <MenuItem value="pants">Pants</MenuItem>
                  <MenuItem value="jackets">Jackets</MenuItem>
                  <MenuItem value="shoes">Shoes</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* Color Filter */}
            <Grid item xs={12}>
              <Typography variant="body1">Color</Typography>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={preferences.colores.includes('red')}
                    onChange={handleChange}
                    value="red"
                    name="colores"
                    sx={{color: '#fd7b7b','&.Mui-checked': {color: '#fd7b7b'}}}
                  />
                }
                label="Red"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={preferences.colores.includes('blue')}
                    onChange={handleChange}
                    value="blue"
                    name="colores"
                    sx={{color: '#fd7b7b','&.Mui-checked': {color: '#fd7b7b'}}}
                  />
                }
                label="Blue"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={preferences.colores.includes('green')}
                    onChange={handleChange}
                    value="green"
                    name="colores"
                    sx={{color: '#fd7b7b','&.Mui-checked': {color: '#fd7b7b'}}}
                  />
                }
                label="Green"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={preferences.colores.includes('black')}
                    onChange={handleChange}
                    value="black"
                    name="colores"
                    sx={{color: '#fd7b7b','&.Mui-checked': {color: '#fd7b7b'}}}
                  />
                }
                label="Black"
              />
            </Grid>

            {/* Brand Filter (Multiple Selection) */}
            <Grid item xs={12}>
              <FormControl fullWidth variant="outlined">
                <InputLabel>Brand</InputLabel>
                <Select
                  label="Brand"
                  name="marcas"
                  value={preferences.marcas}
                  onChange={handleChange}
                  multiple
                >
                  <MenuItem value="zara">Zara</MenuItem>
                  <MenuItem value="basement">Basement</MenuItem>
                  <MenuItem value="nike">Nike</MenuItem>
                  <MenuItem value="adidas">Adidas</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* Submit Button */}
            <Grid item xs={12}>
              <Button type="submit" variant="contained" color="primary" sx={{ '&:hover': { backgroundColor: '#555' }, fontFamily: "Montserrat, sans-serif", backgroundColor: "#fd7b7b", color: "#ffffff", marginTop: '20px', alignSelf: 'center' }} fullWidth>
                Apply preferences
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
};

export default Preferences;
