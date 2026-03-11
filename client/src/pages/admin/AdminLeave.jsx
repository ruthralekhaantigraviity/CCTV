import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiFileText, FiCheck, FiX, FiClock, FiCalendar, FiSearch } from 'react-icons/fi';
import axios from 'axios';

const API = '/api/leave';

export default function AdminLeave() {
    const [leaves, setLeaves] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');

    useEffect(() => { fetchLeaves(); }, []);

    const fetchLeaves = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get(API, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setLeaves(res.data.data || []);
        } catch (err) {
            console.error('Failed to fetch leave requests');
        } finally {
            setLoading(false);
        }
    };

    const handleAction = async (id, status) => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.patch(`${API}/${id}`, { status }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setLeaves(prev => prev.map(l => l._id === id ? res.data.data : l));
        } catch (err) {
            console.error('Failed to update leave status');
        }
    };

    const filtered = leaves.filter(l => {
        const matchSearch = l.employee?.name?.toLowerCase().includes(search.toLowerCase()) ||
            l.leaveType?.toLowerCase().includes(search.toLowerCase()) ||
            l.reason?.toLowerCase().includes(search.toLowerCase());
        const matchStatus = filterStatus === 'all' || l.status === filterStatus;
        return matchSearch && matchStatus;
    });

    const pendingCount = leaves.filter(l => l.status === 'pending').length;
    const approvedCount = leaves.filter(l => l.status === 'approved').length;
    const rejectedCount = leaves.filter(l => l.status === 'rejected').length;

    const statusStyle = {
        pending: { dot: 'bg-amber-400', text: 'text-amber-600' },
        approved: { dot: 'bg-emerald-500', text: 'text-emerald-600' },
        rejected: { dot: 'bg-red-500', text: 'text-red-500' },
    };

    if (loading) return (
        <div className="flex items-center justify-center h-64">
            <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        </div>
    );

    return (
        <div className="space-y-8">

            {/* Header */}
            <div>
                <h1 className="text-3xl font-black text-slate-900 tracking-tighter">Leave Management</h1>
            </div>

            {/* Search + Filter */}
            <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-grow">
                    <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                    <input
                        type="text"
                        placeholder="Search by name, type, or reason..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-white border border-gray-100 text-sm text-slate-700 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-100"
                    />
                </div>
                <select
                    value={filterStatus}
                    onChange={e => setFilterStatus(e.target.value)}
                    className="px-5 py-3 bg-white border border-gray-100 text-sm font-bold text-slate-600 focus:outline-none"
                >
                    <option value="all">All</option>
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                </select>
            </div>

            {/* Table */}
            <div className="bg-white border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-gray-100 bg-gray-50/60">
                                {['Employee', 'Leave Type', 'Duration', 'Dates', 'Reason', 'Status', 'Actions'].map(col => (
                                    <th key={col} className="px-6 py-4 text-[9px] font-black uppercase tracking-widest text-slate-400">
                                        {col}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {filtered.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="py-20 text-center">
                                        <FiFileText className="mx-auto text-slate-200 mb-3" size={40} />
                                        <p className="text-xs font-black text-slate-300 uppercase tracking-widest">No leave requests found</p>
                                    </td>
                                </tr>
                            ) : filtered.map((leave, idx) => {
                                const s = statusStyle[leave.status] || statusStyle.pending;
                                return (
                                    <motion.tr key={leave._id}
                                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: idx * 0.04 }}
                                        className=" transition-colors group"
                                    >
                                        {/* Employee */}
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 bg-slate-900 flex items-center justify-center text-white font-black text-sm shrink-0">
                                                    {leave.employee?.name?.charAt(0).toUpperCase() || '?'}
                                                </div>
                                                <div>
                                                    <p className="font-black text-slate-800 text-sm leading-none">{leave.employee?.name}</p>
                                                    <p className="text-[9px] text-slate-400 mt-0.5">{leave.employee?.email}</p>
                                                </div>
                                            </div>
                                        </td>

                                        {/* Leave Type */}
                                        <td className="px-6 py-5">
                                            <span className="text-[10px] font-black text-blue-600 uppercase tracking-wide bg-blue-50 px-3 py-1">
                                                {leave.leaveType}
                                            </span>
                                        </td>

                                        {/* Days */}
                                        <td className="px-6 py-5">
                                            <p className="font-black text-slate-800 text-sm">{leave.days} day{leave.days > 1 ? 's' : ''}</p>
                                        </td>

                                        {/* Dates */}
                                        <td className="px-6 py-5 whitespace-nowrap">
                                            <div className="flex items-center gap-1 text-slate-500">
                                                <FiCalendar size={12} className="text-slate-300" />
                                                <span className="text-xs font-bold">
                                                    {new Date(leave.startDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}
                                                    {' — '}
                                                    {new Date(leave.endDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}
                                                </span>
                                            </div>
                                        </td>

                                        {/* Reason */}
                                        <td className="px-6 py-5 max-w-[200px]">
                                            <p className="text-xs text-slate-500 truncate">"{leave.reason}"</p>
                                        </td>

                                        {/* Status */}
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-2">
                                                <div className={`w-2 h-2 rounded-full ${s.dot}`} />
                                                <span className={`text-[9px] font-black uppercase tracking-widest ${s.text}`}>
                                                    {leave.status}
                                                </span>
                                            </div>
                                        </td>

                                        {/* Actions */}
                                        <td className="px-6 py-5">
                                            {leave.status === 'pending' ? (
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => handleAction(leave._id, 'approved')}
                                                        className="w-8 h-8 bg-emerald-500 text-white flex items-center justify-center transition-all"
                                                        title="Approve"
                                                    >
                                                        <FiCheck size={14} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleAction(leave._id, 'rejected')}
                                                        className="w-8 h-8 border border-red-200 text-red-500 flex items-center justify-center transition-all"
                                                        title="Reject"
                                                    >
                                                        <FiX size={14} />
                                                    </button>
                                                </div>
                                            ) : (
                                                <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">
                                                    {leave.status === 'approved' ? 'Approved' : 'Rejected'}
                                                </span>
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
