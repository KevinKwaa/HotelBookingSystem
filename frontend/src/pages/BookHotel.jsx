import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function BookingHistory(){
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const [roomData, setRoomData] = useState([])
    const [error, setError] = useState('');
    const [checkIn, setCheckIn] = useState(null);
    const [checkOut, setCheckOut] = useState(null);
    const [category, setCategory] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }
        console.log(user);
        setCheckIn(null);
        setCheckOut(null);
        setCategory(null);
        fetchAvailableRooms();
    }, []);

    // api calls
    const fetchAvailableRooms = async () => {
        try {
            const isStaff = user?.role === 'STAFF';

            const params = {};

            if (checkIn) params.checkIn = checkIn;
            if (checkOut) params.checkOut = checkOut;
            if (category) params.category = category;
            params.role = user.role;

            let endpoint = '/rooms';

            if (!isStaff) {
                endpoint = '/rooms/available';
            } else if (checkIn || checkOut || category) {
                endpoint = '/rooms/available';
            }

            const { data } = await api.get(endpoint, { params });

            setRoomData(data);
        } catch {
            setError('Failed to load profile.');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="mx-auto mt-16">
            <h2 className="text-2xl font-bold mb-6 border-b border-slate-700 pb-6">
                {user.role === 'STAFF' ?
                "List of Rooms" :
                "Book a room with us!"}
            </h2>
            
            <div className="flex gap-4 mb-6 items-end">
                <div className="flex flex-col">
                    <label className="text-sm text-slate-400 mb-1">Check-in</label>
                    <input
                        type="date"
                        className="px-3 py-2 rounded bg-slate-800 text-white border border-slate-600"
                        value={checkIn}
                        onChange={(e) => setCheckIn(e.target.value)}
                    />
                </div>
                <div className="flex flex-col"> - </div>

                <div className="flex flex-col">
                    <label className="text-sm text-slate-400 mb-1">Check-out</label>
                    <input
                        type="date"
                        className="px-3 py-2 rounded bg-slate-800 text-white border border-slate-600"
                        value={checkOut}
                        onChange={(e) => setCheckOut(e.target.value)}
                    />
                </div>

                <div className="flex flex-col w-40">
                    <label className="text-sm text-slate-400 mb-1">Category</label>
                    <select
                        className="px-3 py-2 rounded bg-slate-800 text-white border border-slate-600"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                    >
                        <option value="">All</option>
                        <option value="Single">Single</option>
                        <option value="Double">Double</option>
                        <option value="Suite">Suite</option>
                        <option value="President">President</option>
                        <option value="Deluxe">Deluxe</option>
                    </select>
                </div>

                <button
                    className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded"
                    onClick={fetchAvailableRooms}
                >
                    Search
                </button>
            </div>

            <div className="rounded-xl pt-6">
                <table className="w-full text-lg border-collapse">
                    <thead className="bg-slate-700">
                        <tr>
                            <th className="px-4 py-3 text-center font-semibold text-slate-400">Room</th>
                            <th className="px-4 py-3 text-center font-semibold text-slate-400">Category</th>
                            <th className="px-4 py-3 text-center font-semibold text-slate-400">Status</th>
                            <th className="px-4 py-3 text-center font-semibold text-slate-400">Price per Night (RM)</th>
                            <th className="px-4 py-3 text-center font-semibold text-slate-400">Book Now</th>
                        </tr>
                    </thead>
                    <tbody>
                        {roomData?.length > 0 ? (
                            roomData.map((room) => (
                            <tr key={room.id} 
                                className={`border-t border-slate-700 ${
                                    room.status === 'Maintenance' ? 'bg-red-400' : 
                                    room.status === 'Booked' ? 'bg-gray-500' :
                                    'hover:bg-slate-700'
                                }`}
                            >
                                <td className="px-4 py-3 text-left text-white">
                                    {room.roomNumber}
                                </td>
                                <td className="px-4 py-3 text-left text-white">
                                    {room.category}
                                </td>
                                <td className="px-4 py-3 text-left text-white">
                                    {room.status}
                                </td>
                                <td className="px-4 py-3 text-right text-white">
                                    {room.pricePerNight.toFixed(2)}
                                </td>
                                <td className="px-4 py-3 text-center text-white">
                                    -
                                </td>
                            </tr>
                            ))
                        ) : (
                            <tr>
                            <td colSpan="5" className="px-4 py-6 text-center text-white">
                                Sorry, looks like there are available rooms.
                            </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}