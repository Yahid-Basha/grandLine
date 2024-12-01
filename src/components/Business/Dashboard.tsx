import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Grid,
  Typography,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { Edit, Trash2, Plus } from 'lucide-react';
import { RootState } from '../../redux/store';
import { fetchProducts, deleteProduct } from '../../redux/slices/productSlice';
import { businessAPI } from '../../services/api';

const Dashboard: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items: products, loading } = useSelector((state: RootState) => state.products);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchProducts('business') as any);
  }, [dispatch]);

  const handleEdit = (productId: string) => {
    navigate(`/business/product/${productId}`);
  };

  const handleDelete = async () => {
    if (selectedProductId) {
      try {
        await businessAPI.deleteProduct(selectedProductId);
        dispatch(deleteProduct(selectedProductId));
        setDeleteDialogOpen(false);
      } catch (error) {
        console.error('Failed to delete product:', error);
      }
    }
  };

  const openDeleteDialog = (productId: string) => {
    setSelectedProductId(productId);
    setDeleteDialogOpen(true);
  };

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
        <Typography variant="h4" component="h1">
          Products Dashboard
        </Typography>
        <Button
          variant="contained"
          startIcon={<Plus />}
          onClick={() => navigate('/business/product/new')}
        >
          Add New Product
        </Button>
      </Box>

      <Grid container spacing={3}>
        {products.map((product) => (
          <Grid item xs={12} sm={6} md={4} key={product.id}>
            <Card>
              <CardMedia
                component="img"
                height="200"
                image={product.image}
                alt={product.name}
              />
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {product.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {product.description}
                </Typography>
                <Typography variant="h6" color="primary">
                  ${product.price.toFixed(2)}
                </Typography>
                <Typography variant="body2">
                  Stock: {product.stock}
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                  <IconButton
                    onClick={() => handleEdit(product.id)}
                    color="primary"
                  >
                    <Edit />
                  </IconButton>
                  <IconButton
                    onClick={() => openDeleteDialog(product.id)}
                    color="error"
                  >
                    <Trash2 />
                  </IconButton>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this product?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDelete} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Dashboard;