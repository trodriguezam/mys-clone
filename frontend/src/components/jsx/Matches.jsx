import React, { useState, useEffect } from 'react';
import { Container, Box, TextField, IconButton, List, ListItem, ListItemText, Divider, Typography, Paper, Button, useTheme, useMediaQuery } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useNavigate } from 'react-router-dom';
import '../css/Matches.css';

function Matches() {
  const [searchTerm, setSearchTerm] = useState('');
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const current_user = JSON.parse(localStorage.getItem('current_user'));

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const isMediumScreen = useMediaQuery(theme.breakpoints.down('md'));

  const handleSearchMatch = async () => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:8000/api/match-user-products`);
      const data = await response.json();
      
      console.log('Datos recibidos:', data);  // Debug
  
      // Verifica si data.matches es un array
      if (Array.isArray(data.matches)) {
        const filteredMatches = data.matches.filter(match => 
          match.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        
        console.log('Matches filtrados:', filteredMatches);  // Debug
        
        setMatches(filteredMatches);
      } else {
        console.error('Los datos recibidos no contienen un array de matches:', data);
      }
    } catch (error) {
      console.error('Error fetching matches:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    handleSearchMatch();
  }, []);

  const handleChange = (event) => {
    setSearchTerm(event.target.value);
  };

  useEffect(() => {
  }, [matches]);

  const handleViewClick = (id) => {
    navigate(`/matches/${id}`);
  };

  return (
    current_user ? (
      <Container sx={{ height: '100vh', overflowY: 'auto', marginTop: isSmallScreen ? '30%' : '0', marginTop: isMediumScreen ? "30%" : "0" }}>
        <Typography variant="h4" sx={{ fontFamily: "Belwe" }}>
          Matches
        </Typography>
        <Box className="boxTodo">
          <Box 
            sx={{
              position: 'sticky',
              top: 0,
              zIndex: 1,
              display: 'flex',
              alignItems: 'center',
              backgroundColor: '#d7b49e',
              padding: '10px',
              borderRadius: '8px',
              marginBottom: '10px',
              marginTop: '15px',
              border: '1px solid black'  // Add border style
            }}
          >
            <TextField
              label="Search"
              variant="outlined"
              className="searchInput"
              value={searchTerm}
              onChange={handleChange}
            />
            <IconButton onClick={handleSearchMatch} sx={{ marginLeft: 1 }}>
              <SearchIcon />
            </IconButton>
          </Box>

          <Paper elevation={3} sx={{ backgroundColor: '#F8F4E1', fontFamily: "Belwe", overflowY: 'auto', maxHeight: '70vh' }}>
            <List>
              {loading && <Typography>Loading...</Typography>}
              {!loading && matches.length === 0 && <Typography>No matches found.</Typography>}
              {matches.map((match) => (
                <React.Fragment key={match.id}>
                  <ListItem>
                    <ListItemText
                      primary={match.name}
                      secondary={
                        match.address ? (
                          <>
                            <Typography component="span" variant="body2" color="text.primary">
                              {match.address.line1 || 'N/A'} , {match.address.line2 || 'N/A'}
                            </Typography>
                            <br />
                            <Typography component="span" variant="body2" color="text.secondary">
                              {match.address.country ? match.address.country.name : 'N/A'} , {match.address.city || 'N/A'}
                            </Typography>
                          </>
                        ) : (
                          <Typography component="span" variant="body2" color="text.secondary">
                            Address not available
                          </Typography>
                        )
                      }
                    />
                    <Button variant="contained" class="buttonView" onClick={() => handleViewClick(match.id)}>
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
      <Container sx={{ height: '100vh', overflowY: 'auto', marginTop: isSmallScreen ? '30%' : '0', marginTop: isMediumScreen ? "30%" : "0" }}>
        <Box className="boxTodo">
          <Typography variant="h3" sx={{ fontFamily: "Belwe", color: "#000000", padding: "20px", marginTop: "50px"}}>
            Error 401
          </Typography>
        </Box>
      </Container>
    )
  );
}

export default Matches;