import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';

export default function BookingHistory(){
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const [bookingData, setBookingData] = useState([])
    const [roomNumber, setRoomNumber] = useState(null);
    const [userId, setUserId] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }
        console.log(user);
        setRoomNumber(null);
        setUserId(null);
        fetchBookingHistory();
    }, []);

    // api calls
    const fetchBookingHistory = async () => {
        try {
            const isStaff = user?.role === 'STAFF';

            const params = {};
            if (roomNumber) params.roomNumber = roomNumber;
            if (userId) params.userId = userId;

            let endpoint = '/bookings';

            if (!isStaff) {
                endpoint = `/bookings/getBookingbyUser/${user.userId}`;
            } else if (isStaff) {
                if (roomNumber && !userId) {
                    endpoint = `/bookings/getBookingbyRoom/${roomNumber}`;
                } else if (!roomNumber && userId) {
                    endpoint = `/bookings/getBookingbyUser/${userId}`;
                } else if (roomNumber && userId) {
                    endpoint = `/bookings/getBookingbyUserandRoom`;
                }
            }

            const { data } = await api.get(endpoint, { params });

            setBookingData(data);

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

    const countDays = async (checkIn, checkOut) =>{
        const checkInDate = new Date(checkIn);
        const checkOutDate = new Date(checkOut);
        const timeDiff = checkOutDate.getTime() - checkInDate.getTime();
        const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
        return daysDiff;
    }

    return (
        <div className="mx-auto mt-16">
            <h2 className="text-2xl font-bold mb-6 border-b border-slate-700">Booking History</h2>
            <div className="flex gap-4 mb-6 items-end">
                <div className="flex flex-col">
                    <label className="text-sm text-slate-400 mb-1">Customer ID</label>
                    <input
                        type="text"
                        className="px-3 py-2 rounded bg-slate-800 text-white border border-slate-600"
                        value={userId}
                        onChange={(e) => setUserId(e.target.value)}
                    />
                </div>
                <div className="flex flex-col"> - </div>

                <div className="flex flex-col">
                    <label className="text-sm text-slate-400 mb-1">Room Number</label>
                    <input
                        type="text"
                        className="px-3 py-2 rounded bg-slate-800 text-white border border-slate-600"
                        value={roomNumber}
                        onChange={(e) => setRoomNumber(e.target.value)}
                    />
                </div>

                <button
                    className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded"
                    onClick={fetchBookingHistory}
                >
                    Search
                </button>
            </div>
            <div className="rounded-xl p-6">
                <table className="w-full text-lg border-collapse">
                    <thead className="bg-slate-700">
                        <tr>
                            <th className="px-4 py-3 text-left font-semibold text-slate-400">Room</th>
                            {user.role === 'STAFF' && (
                                <th className="px-4 py-3 text-left font-semibold text-slate-400">Customer ID</th>
                            )
                            }
                            <th className="px-4 py-3 text-left font-semibold text-slate-400">Customer Name</th>
                            <th className="px-4 py-3 text-left font-semibold text-slate-400">Category</th>
                            <th className="px-4 py-3 text-left font-semibold text-slate-400">Check In Date</th>
                            <th className="px-4 py-3 text-left font-semibold text-slate-400">Check Out Date</th>
                            <th className="px-4 py-3 text-left font-semibold text-slate-400">Total Stay Days</th>
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
                                {user.role === 'STAFF' && (
                                    <td className="px-4 py-3 text-left text-white">
                                        {booking.user?.userId ?? '—'}
                                    </td>
                                )}
                                <td className="px-4 py-3 text-left text-white">
                                    {booking.user?.name ?? '—'}
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
                                    {countDays(booking.checkIn, booking.checkOut)}
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