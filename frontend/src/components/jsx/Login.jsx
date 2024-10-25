import React from 'react';
import { Box, Typography, TextField, CssBaseline, Button } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as yup from 'yup';
import { useNavigate } from 'react-router-dom';

const theme = createTheme({
  palette: {
    primary: {
      main: '#51bdb6',
    },
    secondary: {
      main: '#000000',
    },
  },
  typography: {
    fontFamily: 'Arial, sans-serif',
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
      const response = await fetch('http://localhost:8000/api/login/', {
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
      localStorage.setItem('user', data.user_id);
      navigate('/home');
    } catch (error) {
      console.error("Error during login:", error);
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: '70px 0' }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box sx={{ width: '100%', maxWidth: '400px', padding: '20px', backgroundColor: 'lightblue', borderRadius: '8px', boxShadow: '0 0 10px rgba(0,0,0,0.1)' }}>
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
                      borderColor: '#51bdb6', // Border color on hover
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#51bdb6', // Border color when focused
                    },
                  },
                  '& .MuiInputLabel-root': {
                    color: 'black', // Label color
                  },
                  '& .MuiInputLabel-root.Mui-focused': {
                    color: '#51bdb6', // Label color when focused
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
                      borderColor: '#51bdb6', // Border color on hover
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#51bdb6', // Border color when focused
                    },
                  },
                  '& .MuiInputLabel-root': {
                    color: 'black', // Label color
                  },
                  '& .MuiInputLabel-root.Mui-focused': {
                    color: '#51bdb6', // Label color when focused
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
              <Button type="submit" sx={{ backgroundColor: 'white', '&:hover': { backgroundColor: '#51bdb6' }, mt: 2 }} variant="contained" fullWidth>
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