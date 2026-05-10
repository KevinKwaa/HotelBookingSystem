import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import { BedDouble, ClipboardList } from "lucide-react";

export default function Staff(){
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const [userData, setUserData] = useState(null)
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);

    if (!user) return <p className="text-center mt-16">No data found.</p>;

    return (
        <div className="mx-auto mt-16">
            <div className="mb-2">
                <h2 className="text-5xl font-bold text-white mb-3">
                    Good day {user.name} 
                </h2>
                <p className="text-slate-400 text-lg">
                    What would you like to do today?
                </p>
            </div>

            <div className="mt-10 w-24 border-t border-slate-700 mb-10" />

            {/* Buttons */}
            <div className="flex flex-col flex-wrap max-w-200 sm:flex-row gap-4">
                <button
                    type="button"
                    onClick={() => navigate('/bookHotel')}
                    className="flex items-center gap-4 bg-slate-700 hover:bg-slate-600 text-white px-6 py-5 rounded-xl transition-colors w-full sm:w-64 text-left"
                >
                    <div className="bg-blue-500 p-2 rounded-lg">
                        <BedDouble size={22} className="text-white" />
                    </div>
                    <div>
                        <p className="font-semibold text-base">Check Room</p>
                        <p className="text-slate-400 text-xs mt-0.5">Observe current room list</p>
                    </div>
                </button>

                <button
                    type="button"
                    onClick={() => navigate('/bookingHistory')}
                    className="flex items-center gap-4 bg-slate-700 hover:bg-slate-600 text-white px-6 py-5 rounded-xl transition-colors w-full sm:w-64 text-left"
                >
                    <div className="bg-indigo-500 p-2 rounded-lg">
                        <ClipboardList size={22} className="text-white" />
                    </div>
                    <div>
                        <p className="font-semibold text-base">Booking History</p>
                        <p className="text-slate-400 text-xs mt-0.5">Check customer's booking history</p>
                    </div>
                </button>

                <button
                    type="button"
                    onClick={() => navigate('/customerList')}
                    className="flex items-center gap-4 bg-slate-700 hover:bg-slate-600 text-white px-6 py-5 rounded-xl transition-colors w-full sm:w-64 text-left"
                >
                    <div className="bg-indigo-500 p-2 rounded-lg">
                        <ClipboardList size={22} className="text-white" />
                    </div>
                    <div>
                        <p className="font-semibold text-base">Customer List</p>
                        <p className="text-slate-400 text-xs mt-0.5">Check up customer's data</p>
                    </div>
                </button>
            </div>
        </div>
    );
}