import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import DashboardLayout from './pages/DashboardLayout';
import CustomerDetailModal from './components/CustomerDetailModal';
import CustomerDetailPage from './pages/CustomerDetailPage';
import EditCustomerPage from './pages/EditCustomerPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<DashboardLayout />}>
          <Route path="customer/:id" element={<CustomerDetailModal />} />
        </Route>
        <Route path="/customer-detail/:id" element={<CustomerDetailPage />} />
        <Route path="/edit-customer/:id" element={<EditCustomerPage />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}
