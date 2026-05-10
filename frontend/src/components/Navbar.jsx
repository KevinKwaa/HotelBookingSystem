import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white border-b px-6 py-3 flex justify-between items-center">
      <Link to="/" className="text-xl font-bold text-blue-700">🏨 HotelBook</Link>
      <div className="flex items-center gap-4 text-sm">
        <Link to="/" className="hover:text-blue-600">Search</Link>
        {user ? (
          <>
            <Link to="/my-bookings" className="hover:text-blue-600">My Bookings</Link>
            {user.role === 'STAFF' && (
              <Link to="/staff" className="hover:text-blue-600">Dashboard</Link>
            )}
            <span className="text-gray-400">|</span>
            <span className="text-gray-600">{user.name}</span>
            {user.role === 'CUSTOMER' && (
              <span className="text-yellow-600 font-medium">⭐ {user.loyaltyPoints} pts</span>
            )}
            <button onClick={handleLogout} className="text-red-500 hover:underline">Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" className="hover:text-blue-600">Login</Link>
            <Link to="/register" className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}