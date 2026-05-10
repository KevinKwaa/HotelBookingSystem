import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function UserProfile(){
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const [userData, setUserData] = useState(null)
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }
        console.log(user);
        fetchProfile();
    }, []);

    // api calls
    const fetchProfile = async () => {
        try {
            const { data } = await api.get(`/users/getUserById/${user.userId}`);
            setUserData(data);
        } catch {
            setError('Failed to load profile.');
        } finally {
            setLoading(false);
        }
    }

    const deleteAccount = async () => {
        try {
            await api.delete(`/users/deleteUser/${user.userId}`);
            logout();
            navigate('/login');
            setUserData(null);
        } catch {
            setError('Failed to delete profile.');
        } finally {
            setLoading(false);
        }
    }

    if (loading) return <p className="text-center mt-16">Loading...</p>;
    if (!userData) return <p className="text-center mt-16">No data found.</p>;

    return (
        <div className="max-w-md mx-auto mt-16">
            <h2 className="text-2xl font-bold mb-6">My Profile</h2>
            <div className="p-6 space-y-4">
                <table className="w-full text-lg">
                    <tbody>
                        <tr>
                            <td className="py-2 pr-6 text-left font-medium text-gray-500">Name</td>
                            <td>:</td>
                            <td className="px-4 py-2 text-left">{user.name}</td>
                        </tr>
                        <tr>
                            <td className="py-2 pr-6 text-left font-medium text-gray-500">Email</td>
                            <td>:</td>
                            <td className="px-4 py-2 text-left">{user.email}</td>
                        </tr>
                        <tr>
                            <td className="py-2 pr-6 text-left font-medium text-gray-500">Phone Number</td>
                            <td>:</td>
                            <td className="px-4 py-2 text-left">
                                {user.phoneNumber ?? '—'}
                            </td>
                        </tr>
                        <tr>
                            <td className="py-2 pr-6 text-left font-medium text-gray-500">Joined Date</td>
                            <td>:</td>
                            <td className="px-4 py-2 text-left">
                                {user.createdAt ? user.createdAt.split('T')[0] : '—'}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div className="relative">
                <button
                    type="button"
                    className="border border-red-600 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-500 transition-colors"
                    onClick={() => deleteAccount()}
                >
                    Deactivate Account
                </button>
            </div>
        </div>
    );
};
