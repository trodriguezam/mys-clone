import React, { useState, useEffect } from 'react';
import axiosInstance from '../PageElements/axiosInstance.jsx';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { TextField, Button, CssBaseline, ThemeProvider, createTheme, Typography } from '@mui/material';
import * as yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { Box, color } from '@mui/system';

const theme = createTheme({
  palette: {
    primary: {
      main: '#666666',  // Example for primary color (green)
    },
    secondary: {
      main: '#FF5722',  // Example for secondary color (orange)
    },
    text: {
      primary: '#111111',  // Custom text color
    }
  },
});

const validationSchema = yup.object({
  username: yup.string().required('Username is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  phone: yup.string()
    .matches(/^\+569[0-9]{8}$/, 'Phone number must start with +569 and be followed by 8 digits')
    .required('Phone number is required'),
  password: yup.string()
    .matches(/^.{6,}$/, 'The password must be at least 6 characters')
    .required('Password is required'),
  confirmPassword: yup.string()
    .oneOf([yup.ref('password'), null], 'Passwords must match')
    .required('Confirm Password is required'),
});

function SignupForm({ setCurrentUser }) {
  const navigate = useNavigate();
  const [colores, setColores] = useState([]);
  const [tipos, setTipos] = useState([]);
  const [marcas, setMarcas] = useState([]);
  const [loading, setLoading] = useState(true);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: '70px 0' }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box sx={{ width: '100%', maxWidth: '400px', padding: '20px', backgroundColor: 'fff', borderRadius: '8px', boxShadow: '0 0 10px rgba(0,0,0,0.1)' }}>
          <Typography variant="h4" sx={{ color: 'black', mb: 2, textAlign: 'center' }}>
            Sign Up
          </Typography>
          <Formik
            initialValues={{ username: '', email: '', phone: '', password: '', confirmPassword: '' }}
            validationSchema={validationSchema}
            onSubmit={(values, { setSubmitting, isValid, validateForm }) => {
              validateForm().then(errors => {
                if (Object.keys(errors).length) {
                  alert('Please correct the errors before submitting.');
                } else {
                  alert('User created successfully'); 
                  axiosInstance.post('/signup/', values)
                    .then((response) => {
                        navigate('/');
                    })
                    .catch((error) => {
                      console.error(error);
                    });
                }
                setSubmitting(false);
              });
            }}
          >
            <Form>
              <Field
                as={TextField}
                name="username"
                type="text"
                label="Username"
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
                <ErrorMessage name="username" component="div" />
              </Typography>
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
                name="phone"
                type="text"
                label="Phone"
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
                <ErrorMessage name="phone" component="div" />
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
              <Field
                as={TextField}
                name="confirmPassword"
                type="password"
                label="Confirm Password"
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
                <ErrorMessage name="confirmPassword" component="div" />
              </Typography>
              <Button type="submit" sx={{ backgroundColor: '#fd7b7b', '&:hover': { backgroundColor: '#fd7b7b' }, mt: 2 }} variant="contained" fullWidth>
                Sign Up
              </Button>
            </Form>
          </Formik>
        </Box>
      </ThemeProvider>
    </Box>
  );
}

export default SignupForm;