import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';

export default function Register() {
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [registerForm, setRegisterForm] = useState({
        name: '',
        email: '',
        phoneNumber: '',
        password: '',
    })
    const navigate = useNavigate();
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await api.post('/auth/register', registerForm);
            navigate('/login');
        } catch {
            setError('Registration failed. Please try again.');
        }
    };

    return (
    <div className="max-w-130 mx-auto mt-16">
      <h1 className="text-2xl font-bold mb-6">Welcome to Royal Hotel</h1>
      <h2 className="text-2xl font-bold mb-6">Get an account and enjoy booking!</h2>
      <h3 className="text-2xl font-bold mb-6">Register</h3>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Name"
          className="w-full border rounded px-3 py-2"
          value={registerForm.name}
          onChange={(e) => setRegisterForm({ ...registerForm, name: e.target.value })}
          required
        />
        <input
          type="email"
          placeholder="Email"
          className="w-full border rounded px-3 py-2"
          value={registerForm.email}
          onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Phone Number"
          className="w-full border rounded px-3 py-2"
          value={registerForm.phoneNumber}
          onChange={(e) => setRegisterForm({ ...registerForm, phoneNumber: e.target.value })}
          required
        />
        <div className="relative">
            <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className="w-full border rounded px-3 py-2"
                value={registerForm.password}
                onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
                required
            />

            <button
                type="button"
                className="absolute right-2 top-1/2 -translate-y-1/2 text-sm"
                onClick={() => setShowPassword(!showPassword)}
            >
                {showPassword ? "Hide" : "Show"}
            </button>
        </div>
        <button className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
          Register
        </button>
      </form>
      <p className="mt-4 text-sm">
        Have an account? <Link to="/login" className="text-blue-600">Login</Link>
      </p>
    </div>
  );
}