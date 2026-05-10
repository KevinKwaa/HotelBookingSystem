import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import LoginPage from './pages/Login';
import RegisterPage from './pages/Register';
import UserProfile from './pages/UserProfile';
import Customer from './pages/Customer';
import Staff from './pages/Staff';
import BookingHistory from './pages/BookingHistory';
import BookHotel from './pages/BookHotel';
// import ProtectedRoute from './components/ProtectedRoute';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
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
            {/* <Route path="/my-bookings" element={
              <ProtectedRoute><MyBookingsPage /></ProtectedRoute>
            } /> */}
            {/* <Route path="/staff" element={
              <ProtectedRoute role="STAFF"><StaffDashboard /></ProtectedRoute>
            } /> */}
          </Routes>
        </main>
      </BrowserRouter>
    </AuthProvider>
  );
}