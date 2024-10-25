import React, { useState, useEffect } from 'react';
import { Container, Box, TextField, IconButton, List, ListItem, ListItemText, Divider, Typography, Paper, Button, useTheme, useMediaQuery, Avatar } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useNavigate } from 'react-router-dom';

function Matches() {
  const [searchTerm, setSearchTerm] = useState('');
  const [matches, setMatches] = useState([]);
  const [products, setProducts] = useState([]);
  const [productsMatch, setProductsMatch] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const current_user = JSON.parse(localStorage.getItem('current_user'));
  const ID = parseInt(localStorage.getItem('user'), 10);

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const isMediumScreen = useMediaQuery(theme.breakpoints.down('md'));

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const response = await fetch(`http://localhost:8000/api/match-user-products`);
        const data = await response.json();
        setMatches(data);
        console.log('matches:', data);  // Debug
      } catch (error) {
        console.error('Error fetching matches:', error);
      }
    };

    fetchMatches();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`http://localhost:8000/api/products`);
        const data = await response.json();
        setProducts(data);
        console.log('Products:', data);  // Debug
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    const ProductsMatch = () => {
      let filteredProducts;
      if (searchTerm.trim() === '') {
        // Si el campo de búsqueda está vacío, guarda todos los productos que están en matches y coinciden con el current_user
        filteredProducts = products.filter(product => 
          matches.some(match => match.product === product.id && match.user === ID) // Cambiar el 1 por el current_user
        );
      } else {
        // Filtra los productos según la categoría y que están en matches y coinciden con el current_user
        filteredProducts = products.filter(product => 
          matches.some(match => match.product === product.id && match.user === ID) && // Cambiar el 1 por el current_user
          product.marca.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
      console.log('Filtered products:', filteredProducts);  // Debug
      setProductsMatch(filteredProducts);
    };

    ProductsMatch();
  }, [products, matches, searchTerm]);

  const handleChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleViewClick = (id) => {
    navigate(`/matches`);
  };

  return (
    current_user ? (
      <Container sx={{ height: '100vh', overflowY: 'auto', fontFamily: 'Montserrat, sans-serif' }}>
        <Typography variant="h4" sx={{ fontFamily: "Montserrat, sans-serif", color: "#333" }}>
          Matches
        </Typography>
        <Box sx={{
          backgroundColor: '#f9f9f9',
          padding: '20px',
          borderRadius: '8px',
          boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
          fontFamily: 'Montserrat, sans-serif',
        }}>
          <Box 
            sx={{
              position: 'sticky',
              top: 0,
              zIndex: 1,
              display: 'flex',
              alignItems: 'center',
              backgroundColor: '#add8e6', // Color lightblue
              padding: '10px',
              borderRadius: '8px',
              marginBottom: '10px',
              marginTop: '15px',
              border: '1px solid #ccc',  // Add border style
            }}
          >
            <TextField
              label="Search"
              variant="outlined"
              value={searchTerm}
              onChange={handleChange}
              sx={{
                width: '100%', // Ancho del 100%
                backgroundColor: '#fff', // Fondo blanco
                '& .MuiOutlinedInput-root': {
                  backgroundColor: '#fff', // Fondo blanco
                  '& fieldset': {
                    borderColor: '#ccc',
                  },
                  '&:hover fieldset': {
                    borderColor: '#888',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#555',
                  },
                },
                '& .MuiInputLabel-root': {
                  color: '#555',
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: '#333',
                },
                '& .MuiOutlinedInput-input': {
                  color: '#333',
                },
              }}
            />
            <IconButton onClick={() => setSearchTerm(searchTerm)} sx={{ marginLeft: 1, color: '#333' }}>
              <SearchIcon />
            </IconButton>
          </Box>

          <Paper elevation={3} sx={{ backgroundColor: '#fff', fontFamily: "Montserrat, sans-serif", overflowY: 'auto', maxHeight: '70vh', padding: '2px', width: '100%', margin: '0 auto' }}>
            <List>
              {loading && <Typography>Loading...</Typography>}
              {!loading && productsMatch.length === 0 && <Typography>No products found.</Typography>}
              {productsMatch.map((product) => (
                <React.Fragment key={product.id}>
                  <ListItem alignItems="flex-start">
                    <Avatar
                      src={product.imagen_url}
                      alt={product.name}
                      sx={{ width: 56, height: 56, marginRight: 2 }}
                    />
                    <ListItemText
                      primary={product.name}
                      secondary={
                        <>
                          <Typography component="span" variant="body2" color="text.primary">
                            {product.marca}
                          </Typography>
                          <br />
                          <Typography component="span" variant="body2" color="text.secondary">
                            Precio: ${product.precio_actual}
                          </Typography>
                        </>
                      }
                    />
                    <Button variant="contained" sx={{ backgroundColor: '#333', '&:hover': { backgroundColor: '#555' }, fontFamily: "Montserrat, sans-serif", backgroundColor: "#add8e6", color: "#000000" }} onClick={() => handleViewClick(product.id)}>
                      View
                    </Button>
                  </ListItem>
                  <Divider />
                </React.Fragment>
              ))}
            </List>
          </Paper>
        </Box>
      </Container>
    ) : (
      <Container sx={{ height: '100vh', overflowY: 'auto', marginTop: isSmallScreen ? '30%' : '0', marginTop: isMediumScreen ? "30%" : "0", fontFamily: 'Montserrat, sans-serif' }}>
        <Box sx={{
          backgroundColor: '#f9f9f9',
          padding: '20px',
          borderRadius: '8px',
          boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
          fontFamily: 'Montserrat, sans-serif',
        }}>
          <Typography variant="h3" sx={{ fontFamily: "Montserrat, sans-serif", color: "#000", padding: "20px", marginTop: "50px"}}>
            Error 401
          </Typography>
        </Box>
      </Container>
    )
  );
}

export default Matches;