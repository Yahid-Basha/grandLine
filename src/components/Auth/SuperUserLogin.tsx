import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { authAPI } from '../../services/api';
import { setCredentials } from '../../redux/slices/authSlice';
import AuthLayout from './AuthLayout';
import AuthForm from './AuthForm';

const SuperUserLogin: React.FC = () => {
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (data: any) => {
    try {
      setIsLoading(true);
      setError('');
      const response = await authAPI.superUserLogin(data);
      dispatch(setCredentials({
        user: response.data.user,
        token: response.data.token,
        role: 'superuser'
      }));
      navigate('/superuser/dashboard');
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
    <AuthLayout title="Super User Login">
      <AuthForm
        onSubmit={handleSubmit}
        fields={fields}
        error={error}
        isLoading={isLoading}
        submitText="Sign In"
      />
    </AuthLayout>
  );
};

export default SuperUserLogin;