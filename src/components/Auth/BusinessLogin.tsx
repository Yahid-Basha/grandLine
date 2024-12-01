import React, { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { Link, Typography } from '@mui/material';
import { useDispatch } from 'react-redux';
import { authAPI } from '../../services/api';
import { setCredentials } from '../../redux/slices/authSlice';
import AuthLayout from './AuthLayout';
import AuthForm from './AuthForm';

const BusinessLogin: React.FC = () => {
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (data: any) => {
    try {
      setIsLoading(true);
      setError('');
      const response = await authAPI.businessLogin(data);
      dispatch(setCredentials({
        user: response.data.user,
        token: response.data.token,
        role: 'business'
      }));
      navigate('/business/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const fields = [
    { name: 'email', label: 'Email Address', type: 'email' },
    { name: 'password', label: 'Password', type: 'password' }
  ];

  return (
    <AuthLayout title="Business Login">
      <AuthForm
        onSubmit={handleSubmit}
        fields={fields}
        error={error}
        isLoading={isLoading}
        submitText="Sign In"
      />
      <Typography variant="body2" align="center" sx={{ mt: 2 }}>
        Don't have an account?{' '}
        <Link component={RouterLink} to="/business/signup">
          Sign Up
        </Link>
      </Typography>
    </AuthLayout>
  );
};

export default BusinessLogin;