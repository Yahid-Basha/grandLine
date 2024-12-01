import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { store } from './redux/store';
import theme from './theme';
import Layout from './components/Layout';
import ProtectedRoute from './components/common/ProtectedRoute';

// Auth Components
import BusinessLogin from './components/Auth/BusinessLogin';
import CustomerLogin from './components/Auth/CustomerLogin';
import SuperUserLogin from './components/Auth/SuperUserLogin';
import BusinessSignup from './components/Auth/BusinessSignup';
import CustomerSignup from './components/Auth/CustomerSignup';

// Business Components
import BusinessDashboard from './components/Business/Dashboard';
import ProductForm from './components/Business/ProductForm';

// Customer Components
import Homepage from './components/Customer/Homepage';
import Cart from './components/Customer/Cart';
import Checkout from './components/Customer/Checkout';
import OrderHistory from './components/Customer/OrderHistory';

// SuperUser Components
import SuperUserDashboard from './components/SuperUser/Dashboard';

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <BrowserRouter>
          <Layout>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Homepage />} />
              
              {/* Auth Routes */}
              <Route path="/business/login" element={<BusinessLogin />} />
              <Route path="/business/signup" element={<BusinessSignup />} />
              <Route path="/customer/login" element={<CustomerLogin />} />
              <Route path="/customer/signup" element={<CustomerSignup />} />
              <Route path="/superuser/login" element={<SuperUserLogin />} />

              {/* Protected Business Routes */}
              <Route element={<ProtectedRoute role="business" />}>
                <Route path="/business/dashboard" element={<BusinessDashboard />} />
                <Route path="/business/product/new" element={<ProductForm />} />
                <Route path="/business/product/:id" element={<ProductForm />} />
              </Route>

              {/* Protected Customer Routes */}
              <Route element={<ProtectedRoute role="customer" />}>
                <Route path="/cart" element={<Cart />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/orders" element={<OrderHistory />} />
              </Route>

              {/* Protected SuperUser Routes */}
              <Route element={<ProtectedRoute role="superuser" />}>
                <Route path="/superuser/dashboard" element={<SuperUserDashboard />} />
              </Route>
            </Routes>
          </Layout>
        </BrowserRouter>
      </ThemeProvider>
    </Provider>
  );
}

export default App;