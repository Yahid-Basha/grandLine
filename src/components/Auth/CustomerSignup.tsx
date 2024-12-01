import React, { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { Link, Typography } from '@mui/material';
import { useDispatch } from 'react-redux';
import { authAPI } from '../../services/api';
import { setCredentials } from '../../redux/slices/authSlice';
import AuthLayout from './AuthLayout';
import AuthForm from './AuthForm';

const CustomerSignup: React.FC = () => {
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (data: any) => {
    try {
      setIsLoading(true);
      setError('');
      const response = await authAPI.customerSignup(data);
      dispatch(setCredentials({
        user: response.data.user,
        token: response.data.token,
        role: 'customer'
      }));
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Signup failed');
    } finally {
      setIsLoading(false);
    }
  };

  const fields = [
    { name: 'name', label: 'Full Name' },
    { name: 'email', label: 'Email Address', type: 'email' },
    { name: 'password', label: 'Password', type: 'password' }
  ];

  return (
    <AuthLayout title="Customer Sign Up">
      <AuthForm
        onSubmit={handleSubmit}
        fields={fields}
        error={error}
        isLoading={isLoading}
        submitText="Sign Up"
      />
      <Typography variant="body2" align="center" sx={{ mt: 2 }}>
        Already have an account?{' '}
        <Link component={RouterLink} to="/customer/login">
          Sign In
        </Link>
      </Typography>
    </AuthLayout>
  );
};

export default CustomerSignup;