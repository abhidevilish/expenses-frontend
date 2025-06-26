import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
} from '@mui/material';
import { BASE_URL } from '../../constants/constants';
import * as jwtDecode from 'jwt-decode';
import { setUser } from '../../store/userSlice';
import { useNavigate } from 'react-router';


type DecodedToken = {
  email: string;
  role: string;
  exp?: number;
  id: number;
};

const LoginCard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate()

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [loginError, setLoginError] = useState('');

  const validateEmail = (value: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    let valid = true;

    if (!email) {
      setEmailError('Email is required');
      valid = false;
    } else if (!validateEmail(email)) {
      setEmailError('Please enter a valid email');
      valid = false;
    } else {
      setEmailError('');
    }

    if (!password) {
      setPasswordError('Password is required');
      valid = false;
    } else {
      setPasswordError('');
    }

    if (valid) {
      const response = await fetch(`${BASE_URL}/api/user/auth`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password })
      })
      if (!response.ok) {
        let errorMessage = await response.json()
        setLoginError(errorMessage.message)
      } else {
        const { message } = await response.json();
        localStorage.setItem('token', message)
        setLoginError('')
        const decoded: DecodedToken = jwtDecode.jwtDecode(message);
        dispatch(setUser({
          role: decoded.role,
          email: decoded.email,
          userId: decoded.id
        }));
        if (decoded.role === 'admin') navigate('/admin/dashboard');
        else if (decoded.role === 'employee') navigate('/employee/dashboard');

      }

    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(to right, #ece9e6, #ffffff)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 2,
      }}
    >
      <Paper
        elevation={6}
        sx={{
          padding: 5,
          borderRadius: 3,
          width: '100%',
          maxWidth: 420,
        }}
      >
        <Typography
          variant="h4"
          align="center"
          gutterBottom
          sx={{ fontWeight: 'bold', color: '#1976d2' }}
        >
          Expense Tracker
        </Typography>

        <Typography
          variant="subtitle1"
          align="center"
          gutterBottom
          sx={{ color: 'text.secondary' }}
        >
          Log in to continue
        </Typography>

        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <TextField
            label="Email"
            type="email"
            fullWidth
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={!!emailError}
            helperText={emailError}
          />

          <TextField
            label="Password"
            type="password"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={!!passwordError}
            helperText={passwordError}
          />

          <Button
            type="submit"
            //fullWidth
            variant="contained"

            sx={{
              mt: 3,
              py: 1.5,
              borderRadius: '9999px',
              fontWeight: 'bold',
              backgroundColor: '#1976d2',
              '&:hover': {
                backgroundColor: '#115293',
              },
            }}
          >
            Login
          </Button>
          {loginError ? <p style={{color:"red"}}>{loginError}</p> : ''}

        </Box>
      </Paper>
    </Box>
  );
};

export default LoginCard;
