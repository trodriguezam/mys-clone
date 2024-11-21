import React from 'react';
import { Box, Typography, TextField, CssBaseline, Button } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as yup from 'yup';
import { useNavigate } from 'react-router-dom';

const theme = createTheme({
  palette: {
    primary: {
      main: '#fd7b7b', // Color principal del Navbar y Matches
    },
    secondary: {
      main: '#000000',
    },
  },
  typography: {
    fontFamily: 'Montserrat, sans-serif', // Fuente utilizada en Matches
  },
});

const validationSchema = yup.object({
  email: yup.string().email('Enter a valid email').required('Email is required'),
  password: yup.string().required('Password is required'),
});

const Login = () => {
  const navigate = useNavigate();

  const handleLogin = async (values) => {
    console.log("Login values:", values); // Verificar los datos enviados
    try {
      const response = await fetch('https://mys-backend-de75ad11f796.herokuapp.com/api/login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Login successful:", data);
      localStorage.setItem('user', JSON.stringify(data));
      if (!data.preferred_colores?.length || !data.preferred_marcas?.length || !data.preferred_tipos?.length) {
        navigate('/preferences');
      } else {
      navigate('/home');
      }
      window.location.reload();
    } catch (error) {
      console.error("Error during login:", error);
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: '70px 0' }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box sx={{ width: '100%', maxWidth: '400px', padding: '20px', backgroundColor: '#FFF', borderRadius: '8px', boxShadow: '0 0 10px rgba(0,0,0,0.1)' }}>
          <Typography variant="h4" sx={{ color: 'black', mb: 2, textAlign: 'center' }}>
            Login
          </Typography>
          <Formik
            initialValues={{ email: '', password: '' }}
            validationSchema={validationSchema}
            onSubmit={handleLogin}
          >
            <Form>
              <Field
                as={TextField}
                name="email"
                type="email"
                label="Email"
                fullWidth
                margin="normal"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: 'black', // Border color
                    },
                    '&:hover fieldset': {
                      borderColor: '#fd7b7b', // Border color on hover
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#fd7b7b', // Border color when focused
                    },
                  },
                  '& .MuiInputLabel-root': {
                    color: 'black', // Label color
                  },
                  '& .MuiInputLabel-root.Mui-focused': {
                    color: '#fd7b7b', // Label color when focused
                  },
                  '& .MuiOutlinedInput-input': {
                    color: 'black', // Text color
                  },
                }}
                InputLabelProps={{
                  style: { color: 'black' }, // Initial label color
                }}
                InputProps={{
                  style: { color: 'black' }, // Initial text color
                }}
              />
              <Typography color='black'>
                <ErrorMessage name="email" component="div" />
              </Typography>
              <Field
                as={TextField}
                name="password"
                type="password"
                label="Password"
                fullWidth
                margin="normal"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: 'black', // Border color
                    },
                    '&:hover fieldset': {
                      borderColor: '#fd7b7b', // Border color on hover
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#fd7b7b', // Border color when focused
                    },
                  },
                  '& .MuiInputLabel-root': {
                    color: 'black', // Label color
                  },
                  '& .MuiInputLabel-root.Mui-focused': {
                    color: '#fd7b7b', // Label color when focused
                  },
                  '& .MuiOutlinedInput-input': {
                    color: 'black', // Text color
                  },
                }}
                InputLabelProps={{
                  style: { color: 'black' }, // Initial label color
                }}
                InputProps={{
                  style: { color: 'black' }, // Initial text color
                }}
              />
              <Typography color='black'>
                <ErrorMessage name="password" component="div" />
              </Typography>
              <Button type="submit" sx={{ color: "white", backgroundColor: '#fd7b7b', '&:hover': { backgroundColor: '#fd7b7b' }, mt: 2 }} variant="contained" fullWidth>
                Login
              </Button>
            </Form>
          </Formik>
        </Box>
      </ThemeProvider>
    </Box>
  );
};

export default Login;
