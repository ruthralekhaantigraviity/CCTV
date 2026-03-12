import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiCalendar, FiClock, FiCheckCircle, FiXCircle, FiPlusCircle, FiX } from 'react-icons/fi';
import axios from 'axios';

const API = '/api/leave';

const leaveTypes = ['Sick Leave', 'Casual Leave', 'Privilege Leave', 'Emergency Leave'];

const statusConfig = {
    pending: { label: 'Pending', color: 'text-amber-600', bg: 'bg-amber-50', dot: 'bg-amber-400' },
    approved: { label: 'Approved', color: 'text-emerald-600', bg: 'bg-emerald-50', dot: 'bg-emerald-500' },
    rejected: { label: 'Rejected', color: 'text-red-600', bg: 'bg-red-50', dot: 'bg-red-500' },
};

export default function EmployeeLeave() {
    const [leaves, setLeaves] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [form, setForm] = useState({
        leaveType: 'Sick Leave',
        startDate: '',
        endDate: '',
        reason: '',
    });

    useEffect(() => { fetchMyLeaves(); }, []);

    const fetchMyLeaves = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get(`${API}/me`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setLeaves(res.data.data || []);
        } catch (err) {
            console.error('Failed to fetch leave requests');
        } finally {
            setLoading(false);
        }
    };

    const calcDays = (start, end) => {
        if (!start || !end) return 0;
        const diff = (new Date(end) - new Date(start)) / (1000 * 60 * 60 * 24);
        return Math.max(1, Math.round(diff) + 1);
    };

    const handleSubmit = async () => {
        if (!form.startDate || !form.endDate || !form.reason.trim()) {
            alert('Please fill all fields.');
            return;
        }
        setSubmitting(true);
        try {
            const token = localStorage.getItem('token');
            const days = calcDays(form.startDate, form.endDate);
            await axios.post(API, { ...form, days }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setForm({ leaveType: 'Sick Leave', startDate: '', endDate: '', reason: '' });
            setShowForm(false);
            fetchMyLeaves();
            alert('Leave request submitted successfully! The admin will review it shortly.');
        } catch (err) {
            console.error('Failed to submit leave request');
            alert('Failed to submit. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return (
        <div className="flex items-center justify-center h-64">
            <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-none animate-spin" />
        </div>
    );

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-[18px] font-medium text-slate-900 font-sans">Leave Requests</h1>
                </div>
                <button
                    onClick={() => setShowForm(true)}
                    className="flex items-center gap-2 px-6 py-3 bg-white border-2 border-black text-black hover:bg-gray-100 text-xs font-black uppercase tracking-widest rounded-none transition-all"
                >
                    <FiPlusCircle size={16} /> Apply for Leave
                </button>
            </div>


            {/* Leave List */}
            <div className="space-y-3">
                {leaves.length === 0 ? (
                    <div className="bg-white border border-gray-100 py-20 text-center">
                        <FiCalendar className="mx-auto text-slate-200 mb-3" size={40} />
                        <p className="text-xs font-medium text-slate-300">No leave requests yet</p>
                    </div>
                ) : leaves.map((leave, idx) => {
                    const s = statusConfig[leave.status] || statusConfig.pending;
                    return (
                        <motion.div key={leave._id}
                            initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }}
                            className="bg-white border border-gray-100 p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-blue-600 flex items-center justify-center text-white">
                                    <FiCalendar size={20} />
                                </div>
                                <div>
                                    <p className="font-medium text-slate-800 text-sm">{leave.leaveType}</p>
                                    <p className="text-xs text-slate-400 mt-0.5">
                                        {new Date(leave.startDate).toLocaleDateString()} — {new Date(leave.endDate).toLocaleDateString()} &nbsp;·&nbsp; <span className="font-medium text-blue-600">{leave.days} day{leave.days > 1 ? 's' : ''}</span>
                                    </p>
                                    <p className="text-xs text-slate-500 mt-1">"{leave.reason}"</p>
                                </div>
                            </div>

                            <div className={`flex items-center gap-2 px-4 py-2 shrink-0 ${s.bg}`}>
                                <div className={`w-2 h-2 rounded-none ${s.dot}`} />
                                <span className={`text-xs font-medium ${s.color}`}>{s.label}</span>
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            {/* Apply Modal */}
            <AnimatePresence>
                {showForm && (
                    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50" onClick={() => setShowForm(false)}>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-white w-full max-w-lg p-10" onClick={e => e.stopPropagation()}
                        >
                            <div className="flex items-center justify-between mb-8">
                                <div>
                                    <h2 className="text-[18px] font-medium text-slate-900 font-sans">Apply for Leave</h2>
                                    <p className="text-xs font-medium text-slate-400 mt-1">Submit time-off request</p>
                                </div>
                                <button onClick={() => setShowForm(false)} className="p-2 text-slate-400">
                                    <FiX size={20} />
                                </button>
                            </div>

                            <div className="space-y-5">
                                {/* Leave Type */}
                                <div>
                                    <label className="text-xs font-medium text-slate-400 block mb-2">Leave Type</label>
                                    <select value={form.leaveType} onChange={e => setForm({ ...form, leaveType: e.target.value })}
                                        className="w-full px-4 py-3 border border-gray-100 bg-gray-50 text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-100"
                                    >
                                        {leaveTypes.map(t => <option key={t}>{t}</option>)}
                                    </select>
                                </div>

                                {/* Dates */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-xs font-medium text-slate-400 block mb-2">Start Date</label>
                                        <input type="date" value={form.startDate} onChange={e => setForm({ ...form, startDate: e.target.value })}
                                            className="w-full px-4 py-3 border border-gray-100 bg-gray-50 text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-100"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs font-medium text-slate-400 block mb-2">End Date</label>
                                        <input type="date" value={form.endDate} onChange={e => setForm({ ...form, endDate: e.target.value })}
                                            className="w-full px-4 py-3 border border-gray-100 bg-gray-50 text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-100"
                                        />
                                    </div>
                                </div>

                                {/* Days Preview */}
                                {form.startDate && form.endDate && (
                                    <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-100">
                                        <FiClock size={13} className="text-blue-500" />
                                        <span className="text-xs font-medium text-blue-600">
                                            {calcDays(form.startDate, form.endDate)} day{calcDays(form.startDate, form.endDate) > 1 ? 's' : ''} of leave
                                        </span>
                                    </div>
                                )}

                                {/* Reason */}
                                <div>
                                    <label className="text-xs font-medium text-slate-400 block mb-2">Reason for Leave</label>
                                    <textarea value={form.reason} onChange={e => setForm({ ...form, reason: e.target.value })}
                                        placeholder="Briefly describe the reason..."
                                        rows={4}
                                        className="w-full px-4 py-3 border border-gray-100 bg-gray-50 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-100 resize-none"
                                    />
                                </div>
                            </div>

                            <div className="flex gap-3 mt-8">
                                <button onClick={() => setShowForm(false)} className="flex-1 py-3 border border-gray-200 text-sm font-medium text-slate-500">
                                    Cancel
                                </button>
                                <button onClick={handleSubmit} disabled={submitting}
                                    className="flex-1 py-3 bg-blue-600 text-white text-sm font-medium transition-all disabled:opacity-50"
                                >
                                    {submitting ? 'Submitting...' : 'Submit Request'}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
