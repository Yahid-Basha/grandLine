import axios from 'axios';

const BASE_URL = 'https://test.onrender.com';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  businessSignup: (data: BusinessSignupData) => 
    api.post('/business/signup', data),
  businessLogin: (data: LoginData) => 
    api.post('/business/login', data),
  customerSignup: (data: CustomerSignupData) => 
    api.post('/customer/signup', data),
  customerLogin: (data: LoginData) => 
    api.post('/customer/login', data),
  superUserLogin: (data: LoginData) => 
    api.post('/superUser/login', data),
};

export const businessAPI = {
  getProducts: () => api.get('/business/products'),
  addProduct: (data: ProductData) => 
    api.post('/business/products', data),
  updateProduct: (id: string, data: ProductData) => 
    api.put(`/business/products/${id}`, data),
  deleteProduct: (id: string) => 
    api.delete(`/business/products/${id}`),
};

export const customerAPI = {
  getProducts: () => api.get('/customer/products'),
  getCart: () => api.get('/customer/cart'),
  updateCart: (data: CartData) => 
    api.post('/customer/cart', data),
  checkout: (data: CheckoutData) => 
    api.post('/customer/checkout', data),
  getOrders: () => api.get('/customer/orders'),
};

export const superUserAPI = {
  getBusinesses: () => api.get('/superUser/businesses'),
  getCustomers: () => api.get('/superUser/customers'),
};

// Types
interface BusinessSignupData {
  name: string;
  email: string;
  password: string;
  businessName: string;
  businessCategory: string;
}

interface CustomerSignupData {
  name: string;
  email: string;
  password: string;
}

interface LoginData {
  email: string;
  password: string;
}

interface ProductData {
  name: string;
  price: number;
  description: string;
  stock: number;
  image: string;
}

interface CartData {
  products: Array<{
    productId: string;
    quantity: number;
  }>;
}

interface CheckoutData {
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
  paymentMethod: string;
}

export type { 
  BusinessSignupData, 
  CustomerSignupData, 
  LoginData, 
  ProductData, 
  CartData, 
  CheckoutData 
};