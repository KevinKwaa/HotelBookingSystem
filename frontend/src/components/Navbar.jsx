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
      <Link 
        to={user == null? "/" : user.role == 'STAFF'? "/staff" : user.role == 'CUSTOMER' && "/customer"}
        className="text-xl font-bold text-blue-700">🏨 Royal Hotel
      </Link>
      <div className="flex items-center gap-4 text-sm">
        {user ? (
          <>
            <Link to="/userProfile" className="hover:text-blue-600">{user.name}</Link>
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