import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function BookingHistory(){
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const [bookingData, setBookingData] = useState([])
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }
        console.log(user);
        fetchBookingHistory();
    }, []);

    // api calls
    const fetchBookingHistory = async () => {
        try {
            if(user.role === 'STAFF'){
                const { data } = await api.get(`/bookings`);
                setBookingData(data);
            } else {
                const { data } = await api.get(`/bookings/getBookingbyUser/${user.userId}`);
                setBookingData(data);
            }
        } catch {
            setError('Failed to load profile.');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="mx-auto mt-16">
            <h2 className="text-2xl font-bold mb-6">Booking History</h2>
            <div className="rounded-xl border-t border-slate-700 p-6">
                <table className="w-full text-lg border-collapse">
                    <thead className="bg-slate-700">
                        <tr>
                            <th className="px-4 py-3 text-left font-semibold text-slate-400">Room</th>
                            <th className="px-4 py-3 text-left font-semibold text-slate-400">Category</th>
                            <th className="px-4 py-3 text-left font-semibold text-slate-400">Check In Date</th>
                            <th className="px-4 py-3 text-left font-semibold text-slate-400">Check Out Date</th>
                            <th className="px-4 py-3 text-left font-semibold text-slate-400">Booking Status</th>
                            <th className="px-4 py-3 text-left font-semibold text-slate-400">Price per Night (RM)</th>
                            <th className="px-4 py-3 text-left font-semibold text-slate-400">Total Price (RM)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {bookingData?.length > 0 ? (
                            bookingData.map((booking) => (
                            <tr key={booking.id} className="border-t border-slate-700">
                                <td className="px-4 py-3 text-left text-white">
                                    {booking.room?.roomNumber ?? '—'}
                                </td>
                                <td className="px-4 py-3 text-left text-white">
                                    {booking.room?.category ?? '—'}
                                </td>
                                <td className="px-4 py-3 text-left text-white">
                                    {booking.checkIn ? booking.checkIn.split('T')[0] : '—'}
                                </td>
                                <td className="px-4 py-3 text-left text-white">
                                    {booking.checkOut ? booking.checkOut.split('T')[0] : '—'}
                                </td>
                                <td className="px-4 py-3 text-left text-white">
                                    {booking.bookingStatus}
                                </td>
                                <td className="px-4 py-3 text-right text-white">
                                    {booking.room?.pricePerNight ? booking.room.pricePerNight.toFixed(2) : '—'}
                                </td>
                                <td className="px-4 py-3 text-right text-white">
                                    {booking.totalPrice.toFixed(2)}
                                </td>
                            </tr>
                            ))
                        ) : (
                            <tr>
                            <td colSpan="5" className="px-4 py-6 text-center text-white">
                                Oops, looks like there are no bookings yet. Make one now!
                            </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}