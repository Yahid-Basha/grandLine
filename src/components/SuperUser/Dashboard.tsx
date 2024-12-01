import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  CircularProgress,
} from '@mui/material';
import { Ban, CheckCircle } from 'lucide-react';
import { superUserAPI } from '../../services/api';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

interface Business {
  id: string;
  name: string;
  email: string;
  businessName: string;
  businessCategory: string;
  status: 'active' | 'suspended';
  createdAt: string;
}

interface Customer {
  id: string;
  name: string;
  email: string;
  status: 'active' | 'suspended';
  createdAt: string;
  orderCount: number;
}

const Dashboard: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [actionType, setActionType] = useState<'suspend' | 'activate'>();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError('');
      const [businessesRes, customersRes] = await Promise.all([
        superUserAPI.getBusinesses(),
        superUserAPI.getCustomers(),
      ]);
      setBusinesses(businessesRes.data);
      setCustomers(customersRes.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleActionClick = (user: any, type: 'suspend' | 'activate') => {
    setSelectedUser(user);
    setActionType(type);
    setDialogOpen(true);
  };

  const handleConfirmAction = async () => {
    try {
      // In a real application, you would call the API to suspend/activate the user
      // await superUserAPI.updateUserStatus(selectedUser.id, actionType);
      setDialogOpen(false);
      await fetchData(); // Refresh the data
    } catch (err: any) {
      setError(err.response?.data?.message || 'Action failed');
    }
  };

  if (loading) return <CircularProgress />;
  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Admin Dashboard
      </Typography>

      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <Typography variant="h6" gutterBottom>
                Total Businesses
              </Typography>
              <Typography variant="h3">{businesses.length}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="h6" gutterBottom>
                Total Customers
              </Typography>
              <Typography variant="h3">{customers.length}</Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab label="Businesses" />
          <Tab label="Customers" />
        </Tabs>
      </Box>

      <TabPanel value={tabValue} index={0}>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Business Name</TableCell>
                <TableCell>Owner</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Created At</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {businesses.map((business) => (
                <TableRow key={business.id}>
                  <TableCell>{business.businessName}</TableCell>
                  <TableCell>{business.name}</TableCell>
                  <TableCell>{business.email}</TableCell>
                  <TableCell>{business.businessCategory}</TableCell>
                  <TableCell>
                    <Typography
                      color={business.status === 'active' ? 'success.main' : 'error.main'}
                    >
                      {business.status}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    {new Date(business.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    {business.status === 'active' ? (
                      <Button
                        startIcon={<Ban />}
                        color="error"
                        onClick={() => handleActionClick(business, 'suspend')}
                      >
                        Suspend
                      </Button>
                    ) : (
                      <Button
                        startIcon={<CheckCircle />}
                        color="success"
                        onClick={() => handleActionClick(business, 'activate')}
                      >
                        Activate
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Orders</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Created At</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {customers.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell>{customer.name}</TableCell>
                  <TableCell>{customer.email}</TableCell>
                  <TableCell>{customer.orderCount}</TableCell>
                  <TableCell>
                    <Typography
                      color={customer.status === 'active' ? 'success.main' : 'error.main'}
                    >
                      {customer.status}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    {new Date(customer.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    {customer.status === 'active' ? (
                      <Button
                        startIcon={<Ban />}
                        color="error"
                        onClick={() => handleActionClick(customer, 'suspend')}
                      >
                        Suspend
                      </Button>
                    ) : (
                      <Button
                        startIcon={<CheckCircle />}
                        color="success"
                        onClick={() => handleActionClick(customer, 'activate')}
                      >
                        Activate
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </TabPanel>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle>
          {actionType === 'suspend' ? 'Suspend User' : 'Activate User'}
        </DialogTitle>
        <DialogContent>
          Are you sure you want to {actionType}{' '}
          {selectedUser?.businessName || selectedUser?.name}?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleConfirmAction}
            color={actionType === 'suspend' ? 'error' : 'success'}
            variant="contained"
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Dashboard;