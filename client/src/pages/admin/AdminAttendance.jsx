import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    FiClock, FiCheckCircle, FiXCircle, FiAlertCircle,
    FiSearch, FiCalendar, FiDownload, FiUsers, FiUserCheck
} from 'react-icons/fi';
import axios from 'axios';

export default function AdminAttendance() {
    const [attendance, setAttendance] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');
                const [attRes, empRes] = await Promise.all([
                    axios.get('http://localhost:5000/api/attendance', {
                        headers: { Authorization: `Bearer ${token}` }
                    }),
                    axios.get('http://localhost:5000/api/auth/employees', {
                        headers: { Authorization: `Bearer ${token}` }
                    }),
                ]);
                setAttendance(attRes.data.data || []);
                setEmployees(empRes.data.data || []);
            } catch (err) {
                console.error('Failed to fetch attendance data');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const todayRecords = attendance.filter(a => {
        const aDate = new Date(a.clockIn).toISOString().split('T')[0];
        return aDate === selectedDate;
    });

    const filtered = todayRecords.filter(a =>
        a.employee?.name?.toLowerCase().includes(search.toLowerCase())
    );

    const formatTime = (t) =>
        t ? new Date(t).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : '—';

    const getDuration = (clockIn, clockOut) => {
        if (!clockIn || !clockOut) return '—';
        const diff = (new Date(clockOut) - new Date(clockIn)) / 3600000;
        const h = Math.floor(diff);
        const m = Math.round((diff - h) * 60);
        return `${h}h ${m}m`;
    };

    const absentCount = Math.max(0, employees.length - todayRecords.length);
    const lateCount = todayRecords.filter(a => {
        const hour = new Date(a.clockIn).getHours();
        return hour >= 10;
    }).length;

    if (loading) return (
        <div className="flex items-center justify-center h-64">
            <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        </div>
    );

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tighter">Attendance</h1>
                </div>
                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 px-5 py-3 bg-white border border-gray-100 text-[10px] font-black uppercase tracking-widest text-slate-600 transition-all">
                        <FiDownload size={15} /> Export
                    </button>
                    <div className="flex items-center gap-2 bg-white border border-gray-100 px-5 py-3 ">
                        <FiCalendar size={15} className="text-slate-400" />
                        <input
                            type="date"
                            value={selectedDate}
                            onChange={e => setSelectedDate(e.target.value)}
                            className="text-sm font-bold text-slate-600 bg-transparent focus:outline-none"
                        />
                    </div>
                </div>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { label: 'Total Staff', value: employees.length, icon: FiUsers, color: 'blue' },
                    { label: 'Present Today', value: todayRecords.length, icon: FiUserCheck, color: 'emerald' },
                    { label: 'Late Entries', value: lateCount, icon: FiAlertCircle, color: 'amber' },
                    { label: 'Absent', value: absentCount, icon: FiXCircle, color: 'red' },
                ].map((s, i) => (
                    <motion.div
                        key={s.label}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.08 }}
                        className="bg-white p-5 border border-gray-100 flex items-center gap-4"
                    >
                        <div className={`w-12 h-12 flex items-center justify-center ${s.color === 'blue' ? 'bg-blue-50 text-blue-600' :
                            s.color === 'emerald' ? 'bg-emerald-50 text-emerald-600' :
                                s.color === 'amber' ? 'bg-amber-50 text-amber-500' :
                                    'bg-red-50 text-red-500'
                            }`}>
                            <s.icon size={22} />
                        </div>
                        <div>
                            <p className="text-2xl font-black text-slate-800">{s.value}</p>
                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{s.label}</p>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Search */}
            <div className="relative">
                <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                <input
                    type="text"
                    placeholder="Search staff member..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-white border border-gray-100 text-sm text-slate-700 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-100 "
                />
            </div>

            {/* Attendance Table */}
            <div className="bg-white border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-gray-100 bg-gray-50/60">
                                {['Staff Member', 'Clock-In', 'Clock-Out', 'Duration', 'Status'].map(col => (
                                    <th key={col} className="px-6 py-4 text-[9px] font-black uppercase tracking-widest text-slate-400">
                                        {col}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {filtered.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="py-20 text-center">
                                        <FiClock className="mx-auto text-slate-200 mb-3" size={40} />
                                        <p className="text-xs font-black text-slate-300 uppercase tracking-widest">
                                            No attendance records for this date
                                        </p>
                                    </td>
                                </tr>
                            ) : filtered.map((record, idx) => {
                                const clockedOut = !!record.clockOut;
                                const hour = new Date(record.clockIn).getHours();
                                const isLate = hour >= 10;

                                return (
                                    <motion.tr
                                        key={record._id}
                                        initial={{ opacity: 0, x: -8 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: idx * 0.04 }}
                                        className=" transition-colors"
                                    >
                                        {/* Employee */}
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-slate-900 flex items-center justify-center text-white font-black text-sm ">
                                                    {record.employee?.name?.charAt(0).toUpperCase() || '?'}
                                                </div>
                                                <div>
                                                    <p className="font-black text-slate-800 text-sm leading-none">
                                                        {record.employee?.name || 'Unknown'}
                                                    </p>
                                                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                                                        Technician
                                                    </p>
                                                </div>
                                            </div>
                                        </td>

                                        {/* Clock In */}
                                        <td className="px-6 py-5">
                                            <span className="text-sm font-bold text-slate-700">
                                                {formatTime(record.clockIn)}
                                            </span>
                                            {isLate && (
                                                <p className="text-[9px] font-black text-amber-500 uppercase tracking-wide mt-0.5">
                                                    Late
                                                </p>
                                            )}
                                        </td>

                                        {/* Clock Out */}
                                        <td className="px-6 py-5">
                                            <span className="text-sm font-bold text-slate-700">
                                                {formatTime(record.clockOut)}
                                            </span>
                                        </td>

                                        {/* Duration */}
                                        <td className="px-6 py-5">
                                            <span className="text-sm font-black text-blue-600">
                                                {getDuration(record.clockIn, record.clockOut)}
                                            </span>
                                        </td>

                                        {/* Status */}
                                        <td className="px-6 py-5">
                                            {clockedOut ? (
                                                <div className="flex items-center gap-2">
                                                    <div className="w-2 h-2 rounded-full bg-emerald-500" />
                                                    <span className="text-[9px] font-black text-emerald-600 uppercase tracking-widest">
                                                        Completed
                                                    </span>
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-2">
                                                    <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                                                    <span className="text-[9px] font-black text-blue-600 uppercase tracking-widest">
                                                        On Duty
                                                    </span>
                                                </div>
                                            )}
                                        </td>
                                    </motion.tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
