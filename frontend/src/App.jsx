import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import LoginPage from './pages/Login';
import RegisterPage from './pages/Register';
// import SearchPage from './pages/SearchPage';
// import MyBookingsPage from './pages/MyBookingsPage';
// import StaffDashboard from './pages/StaffDashboard';
// import ProtectedRoute from './components/ProtectedRoute';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <main className="max-w-6xl mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
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