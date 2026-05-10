import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';

export default function BookingHistory(){
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const [userData, setUserData] = useState([])
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }
        console.log(user);
        fetchCustomerList();
    }, []);

    // api calls
    const fetchCustomerList = async () => {
        try {
            const { data } = await api.get(`/users`);
            setUserData(data);
        } catch {
            setError('Failed to load profile.');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="mx-auto mt-16">
            <h2 className="text-2xl font-bold mb-6">Customer List</h2>
            <div className="rounded-xl border-t border-slate-700 p-6">
                <table className="w-full text-lg border-collapse">
                    <thead className="bg-slate-700">
                        <tr>
                            <th className="px-4 py-3 text-left font-semibold text-slate-400">Customer ID</th>
                            <th className="px-4 py-3 text-left font-semibold text-slate-400">Name</th>
                            <th className="px-4 py-3 text-left font-semibold text-slate-400">Email</th>
                            <th className="px-4 py-3 text-left font-semibold text-slate-400">Phone Number</th>
                            <th className="px-4 py-3 text-left font-semibold text-slate-400">Joined Date</th>
                            <th className="px-4 py-3 text-left font-semibold text-slate-400">Loyalty Points</th>
                        </tr>
                    </thead>
                    <tbody>
                        {userData?.length > 0 ? (
                            userData.map((user) => (
                            <tr key={user.userId} className="border-t border-slate-700">
                                <td className="px-4 py-3 text-center text-white">
                                    {user.userId ?? '—'}
                                </td>
                                <td className="px-4 py-3 text-left text-white">
                                    {user.name ?? '—'}
                                </td>
                                <td className="px-4 py-3 text-left text-white">
                                    {user.email ?? '—'}
                                </td>
                                <td className="px-4 py-3 text-left text-white">
                                    {user.phoneNumber ?? '—'}
                                </td>
                                <td className="px-4 py-3 text-left text-white">
                                    {user.createdAt.split('T')[0] ?? '—'}
                                </td>
                                <td className="px-4 py-3 text-center text-white">
                                    {user.loyaltyPoint ?? '—'}
                                </td>
                            </tr>
                            ))
                        ) : (
                            <tr>
                            <td colSpan="5" className="px-4 py-6 text-center text-white">
                                No customer record yet.
                            </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}