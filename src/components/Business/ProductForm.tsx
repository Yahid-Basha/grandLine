import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Alert,
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { businessAPI } from '../../services/api';
import { addProduct, updateProduct } from '../../redux/slices/productSlice';
import { RootState } from '../../redux/store';
import type { ProductData } from '../../services/api';

const ProductForm: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const products = useSelector((state: RootState) => state.products.items);
  const existingProduct = products.find(p => p.id === id);

  const { control, handleSubmit, reset } = useForm<ProductData>({
    defaultValues: {
      name: '',
      price: 0,
      description: '',
      stock: 0,
      image: '',
    },
  });

  useEffect(() => {
    if (existingProduct) {
      reset(existingProduct);
    }
  }, [existingProduct, reset]);

  const onSubmit = async (data: ProductData) => {
    try {
      setIsLoading(true);
      setError('');

      if (id) {
        const response = await businessAPI.updateProduct(id, data);
        dispatch(updateProduct(response.data));
      } else {
        const response = await businessAPI.addProduct(data);
        dispatch(addProduct(response.data));
      }

      navigate('/business/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save product');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Paper sx={{ p: 4, maxWidth: 600, mx: 'auto' }}>
      <Typography variant="h5" gutterBottom>
        {id ? 'Edit Product' : 'Add New Product'}
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Box component="form" onSubmit={handleSubmit(onSubmit)}>
        <Controller
          name="name"
          control={control}
          rules={{ required: 'Product name is required' }}
          render={({ field, fieldState: { error } }) => (
            <TextField
              {...field}
              fullWidth
              label="Product Name"
              margin="normal"
              error={!!error}
              helperText={error?.message}
            />
          )}
        />

        <Controller
          name="price"
          control={control}
          rules={{ required: 'Price is required', min: 0 }}
          render={({ field, fieldState: { error } }) => (
            <TextField
              {...field}
              fullWidth
              label="Price"
              type="number"
              margin="normal"
              error={!!error}
              helperText={error?.message}
            />
          )}
        />

        <Controller
          name="description"
          control={control}
          rules={{ required: 'Description is required' }}
          render={({ field, fieldState: { error } }) => (
            <TextField
              {...field}
              fullWidth
              label="Description"
              multiline
              rows={4}
              margin="normal"
              error={!!error}
              helperText={error?.message}
            />
          )}
        />

        <Controller
          name="stock"
          control={control}
          rules={{ required: 'Stock is required', min: 0 }}
          render={({ field, fieldState: { error } }) => (
            <TextField
              {...field}
              fullWidth
              label="Stock"
              type="number"
              margin="normal"
              error={!!error}
              helperText={error?.message}
            />
          )}
        />

        <Controller
          name="image"
          control={control}
          rules={{ required: 'Image URL is required' }}
          render={({ field, fieldState: { error } }) => (
            <TextField
              {...field}
              fullWidth
              label="Image URL"
              margin="normal"
              error={!!error}
              helperText={error?.message}
            />
          )}
        />

        <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
          <Button
            type="submit"
            variant="contained"
            disabled={isLoading}
          >
            {isLoading ? 'Saving...' : 'Save Product'}
          </Button>
          <Button
            variant="outlined"
            onClick={() => navigate('/business/dashboard')}
          >
            Cancel
          </Button>
        </Box>
      </Box>
    </Paper>
  );
};

export default ProductForm;