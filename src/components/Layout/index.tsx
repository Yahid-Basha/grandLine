import React from 'react';
import { useSelector } from 'react-redux';
import { AppBar, Toolbar, Typography, Button, Container, Box } from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { ShoppingCart, Store, User } from 'lucide-react';
import { RootState } from '../../redux/store';
import { useDispatch } from 'react-redux';
import { logout } from '../../redux/slices/authSlice';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { isAuthenticated, role } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography
            variant="h6"
            component={RouterLink}
            to="/"
            sx={{ flexGrow: 1, textDecoration: 'none', color: 'inherit' }}
          >
            E-Commerce Platform
          </Typography>

          <Box sx={{ display: 'flex', gap: 2 }}>
            {!isAuthenticated ? (
              <>
                <Button
                  color="inherit"
                  component={RouterLink}
                  to="/customer/login"
                  startIcon={<User />}
                >
                  Customer Login
                </Button>
                <Button
                  color="inherit"
                  component={RouterLink}
                  to="/business/login"
                  startIcon={<Store />}
                >
                  Business Login
                </Button>
              </>
            ) : (
              <>
                {role === 'customer' && (
                  <>
                    <Button
                      color="inherit"
                      component={RouterLink}
                      to="/cart"
                      startIcon={<ShoppingCart />}
                    >
                      Cart
                    </Button>
                    <Button
                      color="inherit"
                      component={RouterLink}
                      to="/orders"
                    >
                      Orders
                    </Button>
                  </>
                )}
                {role === 'business' && (
                  <Button
                    color="inherit"
                    component={RouterLink}
                    to="/business/dashboard"
                  >
                    Dashboard
                  </Button>
                )}
                {role === 'superuser' && (
                  <Button
                    color="inherit"
                    component={RouterLink}
                    to="/superuser/dashboard"
                  >
                    Dashboard
                  </Button>
                )}
                <Button
                  color="inherit"
                  onClick={handleLogout}
                >
                  Logout
                </Button>
              </>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        {children}
      </Container>
    </>
  );
};

export default Layout;