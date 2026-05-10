import { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import { X } from 'lucide-react';
import toast from 'react-hot-toast';

export default function BookHotel(){
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const [roomData, setRoomData] = useState([])
    const [error, setError] = useState('');
    const [checkIn, setCheckIn] = useState('');
    const [checkOut, setCheckOut] = useState('');
    const [bookingStatus, setBookingStatus] = useState('');
    const [category, setCategory] = useState('');
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [showBookModal, setShowBookModal] = useState(false);
    const [selectedRoom, setSelectedRoom] = useState(null);
    const [customerName, setCustomerName] = useState('');
    const [customerNameLoading, setCustomerNameLoading] = useState(false);
    const debounceTimer = useRef(null);
    const today = new Date().toISOString().split('T')[0];
    const getNextDay = (dateStr) => {
        if (!dateStr) return "";
        const date = new Date(dateStr);
        date.setDate(date.getDate() + 1);
        return date.toISOString().split('T')[0];
    };
    const [editForm, setEditForm] = useState({
        roomNumber: '',
        category: '',
        status: '',
        pricePerNight: '',
    });
    const [bookForm, setBookForm] = useState({
        userId: '',
        room: '',
        checkIn: '',
        checkOut: '',
        bookingStatus: '',
        totalPrice: '',
    });

    const isInvalidStaff = !bookForm.checkIn || 
                  !bookForm.checkOut || 
                  !customerName || 
                  customerName.toLowerCase() === "user not found";

    const isInvalidCustomer = !bookForm.checkIn || 
                  !bookForm.checkOut;

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }
        console.log(user);
        setCheckIn('');
        setCheckOut('');
        setCategory('');
        fetchAvailableRooms();
    }, []);

    const openEditModal = (room) => {
        setSelectedRoom(room);
        setEditForm({
            roomNumber: room.roomNumber,
            category: room.category,
            status: room.status,
            pricePerNight: room.pricePerNight,
        });
        setShowModal(true);
    };

    const openBookModal = (room) => {
        setSelectedRoom(room);
        setCustomerName('');                                   
        setBookForm({
            userId: user.role === 'STAFF' ? '' : user.userId, 
            room: room,
            checkIn: checkIn || '',                            
            checkOut: checkOut || '',
            bookingStatus: 'CONFIRMED',
            totalPrice: '',
        });
        setShowBookModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setShowBookModal(false);
        setSelectedRoom(null);
    };

    const fetchCustomerName = async (id) => {
        if (!id) { setCustomerName(''); return; }
        clearTimeout(debounceTimer.current);
        debounceTimer.current = setTimeout(async () => {
            setCustomerNameLoading(true);
            try {
                const { data } = await api.get(`/users/getUserById/${id}`);
                console.log(data);
                if (data && data.name) {
                    setCustomerName(data.name);
                } else {
                    setCustomerName('User not found');
                }
            } catch {
                setCustomerName('User not found');
            } finally {
                setCustomerNameLoading(false);
            }
        }, 500);
    };

    const calcTotalPrice = (checkIn, checkOut) => {
        if (!checkIn || !checkOut) return '';
        const days = countDays(checkIn, checkOut);
        if (days <= 0) return '';
        return (days * selectedRoom?.pricePerNight).toFixed(2);
    };

    const countDays = (checkIn, checkOut) => {
        const checkInDate = new Date(checkIn);
        const checkOutDate = new Date(checkOut);
        const timeDiff = checkOutDate.getTime() - checkInDate.getTime();
        return Math.ceil(timeDiff / (1000 * 3600 * 24));
    }

    // api calls
    const fetchAvailableRooms = async () => {
        try {
            const isStaff = user?.role === 'STAFF';

            const params = {};

            if (checkIn) params.checkIn = checkIn;
            if (checkOut) params.checkOut = checkOut;
            if (category) params.category = category;
            const endpoint = (!isStaff || checkIn || checkOut || category)
                ? '/rooms/available'
                : '/rooms';

            const { data } = await api.get(endpoint, { params });
            const sorted = data.sort((a, b) => a.id - b.id);
            setRoomData(sorted);
        } catch {
            toast.error('Failed to load rooms.');
        } finally {
            setLoading(false);
        }
    }

    const handleUpdate = async () => {
        try {
            await api.put(`/rooms/updateRoom/${selectedRoom.id}`, editForm);
            closeModal();
            fetchAvailableRooms(); 
            toast.success('Room updated successfully!');
        } catch {
            toast.error('Failed to update room.');
        }
    };

    const handleBooking = async () => {
        try {
            await api.post(`/bookings/addBooking`, {
                userId: bookForm.userId,
                roomId: selectedRoom.id,
                checkIn: bookForm.checkIn,
                checkOut: bookForm.checkOut,
                bookingStatus: 'CONFIRMED',
                totalPrice: calcTotalPrice(bookForm.checkIn, bookForm.checkOut),
            });
            closeModal();
            fetchAvailableRooms(); 
            toast.success('Booking confirmed!');
        } catch {
            toast.error('Failed to create booking.');
        }
    };

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
                            {user.role === 'STAFF' && (
                                <th className="px-4 py-3 text-left font-semibold text-slate-400">Update</th>
                            )
                            }
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
                                    <button 
                                        className="bg-slate-600 px-4 py-3 text-left text-white hover:bg-slate-800 hover:cursor-pointer"
                                        onClick={() => openBookModal(room)}
                                    >
                                        Book
                                    </button>
                                </td>
                                {user.role === 'STAFF' && (
                                    <td className="px-4 py-3 text-center text-white">
                                        <button 
                                            className="bg-slate-600 px-4 py-3 text-left text-white hover:bg-slate-800 hover:cursor-pointer"
                                            onClick={() => openEditModal(room)}
                                        >
                                            Update
                                        </button>
                                    </td>
                                )}
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

            {showModal && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
                    <div className="bg-slate-800 rounded-xl p-6 w-full max-w-md shadow-xl">

                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-bold text-white">
                                Edit Room
                            </h3>
                            <button onClick={closeModal} className="text-slate-400 hover:text-white">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="text-sm text-slate-400 mb-1 block">Room Number</label>
                                <input
                                    type="text"
                                    className="w-full px-3 py-2 rounded bg-slate-700 text-white border border-slate-600"
                                    value={editForm.roomNumber}
                                    onChange={(e) => setEditForm({ ...editForm, roomNumber: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="text-sm text-slate-400 mb-1 block">Category</label>
                                <select
                                    className="w-full px-3 py-2 rounded bg-slate-700 text-white border border-slate-600"
                                    value={editForm.category}
                                    onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                                >
                                    <option value="Single">Single</option>
                                    <option value="Double">Double</option>
                                    <option value="Suite">Suite</option>
                                    <option value="President">President</option>
                                    <option value="Deluxe">Deluxe</option>
                                </select>
                            </div>
                            <div>
                                <label className="text-sm text-slate-400 mb-1 block">Status</label>
                                <select
                                    className="w-full px-3 py-2 rounded bg-slate-700 text-white border border-slate-600"
                                    value={editForm.status}
                                    onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                                >
                                    <option value="Available">Available</option>
                                    <option value="Booked">Booked</option>
                                    <option value="Maintenance">Maintenance</option>
                                </select>
                            </div>
                            <div>
                                <label className="text-sm text-slate-400 mb-1 block">Price per Night (RM)</label>
                                <input
                                    type="number"
                                    className="w-full px-3 py-2 rounded bg-slate-700 text-white border border-slate-600"
                                    value={editForm.pricePerNight}
                                    onChange={(e) => setEditForm({ ...editForm, pricePerNight: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 mt-6">
                            <button
                                onClick={closeModal}
                                className="px-4 py-2 rounded bg-slate-600 hover:bg-slate-500 text-white text-sm"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleUpdate}
                                className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-500 text-white text-sm"
                            >
                                Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {showBookModal && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
                    <div className="bg-slate-800 rounded-xl p-6 w-full max-w-md shadow-xl">

                        <div className="flex justify-between items-center mb-6">
                            <div className="text-left">
                                <h3 className="text-lg font-bold text-white">Book Room</h3>
                                <p className="text-slate-400 text-sm mt-0.5">
                                    Room {selectedRoom?.roomNumber} · {selectedRoom?.category} · RM {selectedRoom?.pricePerNight?.toFixed(2)}/night
                                </p>
                            </div>
                            <button onClick={closeModal} className="text-slate-400 hover:text-white">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="space-y-4">
                            {user.role === 'STAFF' && (
                                <>
                                    <div>
                                        <label className="text-left text-sm text-slate-400 mb-1 block">Customer ID</label>
                                        <input
                                            type="number"
                                            placeholder="Enter customer ID"
                                            className="w-full px-3 py-2 rounded bg-slate-700 text-white border border-slate-600"
                                            value={bookForm.userId}
                                            onChange={(e) => {
                                                setBookForm({ ...bookForm, userId: e.target.value });
                                                fetchCustomerName(e.target.value); 
                                            }}
                                        />
                                    </div>
                                    <div>
                                        <label className="text-left text-sm text-slate-400 mb-1 block">Customer Name</label>
                                        <input
                                            type="text"
                                            readOnly
                                            className="w-full px-3 py-2 rounded bg-slate-600 text-white border border-slate-600 cursor-not-allowed"
                                            value={customerNameLoading ? 'Loading...' : customerName}
                                            placeholder="Auto-filled after entering ID"
                                        />
                                    </div>
                                </>
                            )}

                            <div>
                                <label className="text-left text-sm text-slate-400 mb-1 block">Check-in Date</label>
                                <input
                                    type="date"
                                    min={today}
                                    className="w-full px-3 py-2 rounded bg-slate-700 text-white border border-slate-600"
                                    value={bookForm.checkIn}
                                    onChange={(e) => {
                                        const newCheckIn = e.target.value;
                                        setBookForm(prev => ({          
                                            ...prev,
                                            checkIn: newCheckIn,
                                            totalPrice: calcTotalPrice(newCheckIn, prev.checkOut)
                                        }));
                                    }}
                                />
                            </div>

                            <div>
                                <label className="text-left text-sm text-slate-400 mb-1 block">Check-out Date</label>
                                <input
                                    type="date"
                                    min={bookForm.checkIn ? getNextDay(bookForm.checkIn) : getNextDay(new Date())}
                                    className="w-full px-3 py-2 rounded bg-slate-700 text-white border border-slate-600"
                                    value={bookForm.checkOut}
                                    onChange={(e) => {
                                        const newCheckOut = e.target.value;
                                        setBookForm(prev => ({          
                                            ...prev,
                                            checkOut: newCheckOut,
                                            totalPrice: calcTotalPrice(prev.checkIn, newCheckOut)
                                        }));
                                    }}
                                />
                            </div>

                            <div>
                                <label className="text-left text-sm text-slate-400 mb-1 block">Total Price (RM)</label>
                                <input
                                    type="text"
                                    readOnly
                                    className="w-full px-3 py-2 rounded bg-slate-600 text-white border border-slate-600 cursor-not-allowed"
                                    value={calcTotalPrice(bookForm.checkIn, bookForm.checkOut) || '—'}
                                />
                                {bookForm.checkIn && bookForm.checkOut && countDays(bookForm.checkIn, bookForm.checkOut) > 0 && (
                                    <p className="text-left text-slate-400 text-xs mt-1">
                                        {countDays(bookForm.checkIn, bookForm.checkOut)} night(s) × RM {selectedRoom?.pricePerNight?.toFixed(2)}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 mt-6">
                            <button
                                onClick={closeModal}
                                className="px-4 py-2 rounded bg-slate-600 hover:bg-slate-500 text-white text-sm"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleBooking}  
                                disabled={user.role === 'STAFF' ? isInvalidStaff : isInvalidCustomer}
                                className={`px-4 py-2 rounded text-white text-sm transition-colors ${
                                        (user.role === 'STAFF' ? isInvalidStaff : isInvalidCustomer)
                                            ? 'bg-gray-500 cursor-not-allowed' 
                                            : 'bg-blue-600 hover:bg-blue-500 hover:cursor-pointer'
                                    }`}
                            >
                                Confirm Booking
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}