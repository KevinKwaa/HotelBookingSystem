import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import LoginPage from './pages/auth/Login';
import RegisterPage from './pages/auth/Register';
import UserProfile from './pages/auth/UserProfile';
import Customer from './pages/customer/Customer';
import Staff from './pages/staff/Staff';
import BookingHistory from './pages/shareComponents/BookingHistory';
import BookHotel from './pages/shareComponents/BookHotel';
import CustomerList from './pages/staff/CustomerList';
// import ProtectedRoute from './components/ProtectedRoute';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Toaster position="top-right" />
        <main className="mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/userProfile" element={<UserProfile />} />
            <Route path="/customer" element={<Customer />} />
            <Route path="/staff" element={<Staff />} />
            <Route path="/bookingHistory" element={<BookingHistory />} />
            <Route path="/bookHotel" element={<BookHotel />} />
            <Route path="/customerList" element={<CustomerList />} />
          </Routes>
        </main>
      </BrowserRouter>
    </AuthProvider>
  );
}