// src/Screens/Landing.jsx
import React, { useState } from 'react';
import {
  Button,
  TextField,
  Typography,
  Box,
  Container,
  Paper,
} from '@mui/material';
import './Landing.css';
import { useNavigate } from 'react-router-dom';

const Landing = () => {
  const navigation = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validate = () => {
    let tempErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.email) tempErrors.email = 'Email is required';
    else if (!emailRegex.test(formData.email))
      tempErrors.email = 'Enter a valid email';

    if (!formData.password) tempErrors.password = 'Password is required';
    else if (formData.password.length < 6)
      tempErrors.password = 'Minimum 6 characters required';

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      if (
        formData.email === 'staff@clinic.com' &&
        formData.password === '123456'
      ) {
        alert('Login Successful!');
        navigation('/Calender');
        // Redirect to /calendar or any route
      } else {
        alert('Invalid credentials');
      }
    }
  };

  return (
    <Container className='Container'>
      <Paper elevation={3} className="login-paper">
        <Typography variant="h5" align="center" gutterBottom>
          Clinic Staff Login
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate>
          <TextField
            fullWidth
            label="Email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            margin="normal"
            error={!!errors.email}
            helperText={errors.email}
          />
          <TextField
            fullWidth
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            margin="normal"
            error={!!errors.password}
            helperText={errors.password}
          />
          <Button
            fullWidth
            variant="contained"
            color="primary"
            type="submit"
            className="login-button"
          >
            Login
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default Landing;
