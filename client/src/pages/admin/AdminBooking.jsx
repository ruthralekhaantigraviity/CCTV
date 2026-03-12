import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiSearch, FiMapPin, FiCamera, FiCalendar, FiCheckCircle, FiClock, FiAlertCircle, FiPhone } from 'react-icons/fi';
import axios from 'axios';

const statusConfig = {
    completed: { label: 'Completed', color: 'text-emerald-600', dot: 'bg-emerald-500' },
    progress: { label: 'In Progress', color: 'text-blue-600', dot: 'bg-blue-500' },
    assigned: { label: 'Confirmed', color: 'text-emerald-600', dot: 'bg-emerald-500' },
    claimed: { label: 'Agent Requested', color: 'text-orange-500', dot: 'bg-orange-400' },
    pending: { label: 'New Request', color: 'text-amber-500', dot: 'bg-amber-400' },
};

export default function AdminBooking() {
    const [jobs, setJobs] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [assigning, setAssigning] = useState(null);
    const [selectedEmployees, setSelectedEmployees] = useState({});
    const [search, setSearch] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');
                const [jobsRes, empsRes] = await Promise.all([
                    axios.get('/api/jobs', { headers: { Authorization: `Bearer ${token}` } }),
                    axios.get('/api/auth/employees', { headers: { Authorization: `Bearer ${token}` } })
                ]);
                setJobs(jobsRes.data.data);
                setEmployees(empsRes.data.data);
            } catch (err) {
                console.error('Error fetching booking data:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleAssign = async (jobId) => {
        const empId = selectedEmployees[jobId];
        if (!empId) return;
        setAssigning(jobId);
        try {
            const token = localStorage.getItem('token');
            await axios.patch(`/api/jobs/${jobId}/assign`,
                { employeeId: empId },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            const jobsRes = await axios.get('/api/jobs', { headers: { Authorization: `Bearer ${token}` } });
            setJobs(jobsRes.data.data);
            setSelectedEmployees(prev => {
                const next = { ...prev };
                delete next[jobId];
                return next;
            });
        } catch (err) {
            console.error('Error assigning technician:', err);
        } finally {
            setAssigning(null);
        }
    };

    const filtered = jobs.filter(job => {
        const matchSearch = job.customerName?.toLowerCase().includes(search.toLowerCase()) ||
            job._id?.toLowerCase().includes(search.toLowerCase()) ||
            job.serviceType?.toLowerCase().includes(search.toLowerCase());
        const matchStatus = filterStatus === 'all' || job.status === filterStatus;
        return matchSearch && matchStatus;
    });

    const stats = [
        { label: 'Total Bookings', value: jobs.length, icon: FiCalendar, color: 'blue' },
        { label: 'Completed', value: jobs.filter(j => j.status === 'completed').length, icon: FiCheckCircle, color: 'emerald' },
        { label: 'In Progress', value: jobs.filter(j => j.status === 'progress').length, icon: FiClock, color: 'orange' },
        { label: 'Pending', value: jobs.filter(j => j.status === 'pending').length, icon: FiAlertCircle, color: 'amber' },
    ];

    if (loading) return (
        <div className="flex items-center justify-center h-64">
            <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        </div>
    );

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-black text-slate-900 tracking-tighter">Bookings</h1>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((s, i) => (
                    <motion.div key={s.label} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
                        className="bg-white p-5 border border-gray-100 flex items-center gap-4"
                    >
                        <div className={`w-12 h-12 flex items-center justify-center ${s.color === 'blue' ? 'bg-blue-50 text-blue-600' : s.color === 'emerald' ? 'bg-emerald-50 text-emerald-600' : s.color === 'orange' ? 'bg-orange-50 text-orange-500' : 'bg-amber-50 text-amber-500'}`}>
                            <s.icon size={22} />
                        </div>
                        <div>
                            <p className="text-2xl font-black text-slate-800">{s.value}</p>
                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{s.label}</p>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Search + Filter */}
            <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-grow">
                    <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                    <input
                        type="text"
                        placeholder="Search by name, ID, or service type..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-white border border-gray-100 text-sm text-slate-700 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-100 "
                    />
                </div>
                <select
                    value={filterStatus}
                    onChange={e => setFilterStatus(e.target.value)}
                    className="px-5 py-3 bg-white border border-gray-100 text-sm font-bold text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-100 "
                >
                    <option value="all">All Statuses</option>
                    <option value="pending">Pending</option>
                    <option value="progress">In Progress</option>
                    <option value="completed">Completed</option>
                </select>
            </div>


            {/* Table */}
            <div className="bg-white border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-gray-100 bg-gray-50/60">
                                {['Booking ID', 'Customer', 'Contact', 'System', 'Site', 'Assigned To', 'Status', 'Action'].map(col => (
                                    <th key={col} className="px-6 py-4 text-[9px] font-black uppercase tracking-widest text-slate-400">{col}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {filtered.length === 0 ? (
                                <tr>
                                    <td colSpan="8" className="py-20 text-center">
                                        <FiCamera className="mx-auto text-slate-200 mb-3" size={40} />
                                        <p className="text-xs font-black text-slate-300 uppercase tracking-widest">No bookings found</p>
                                    </td>
                                </tr>
                            ) : filtered.map((job, idx) => {
                                const s = statusConfig[job.status] || statusConfig.pending;
                                return (
                                    <motion.tr key={job._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: idx * 0.03 }}
                                        className=" transition-colors group"
                                    >
                                        <td className="px-6 py-5">
                                            <p className="text-[11px] font-black text-blue-600">#SV-{job._id.slice(-6).toUpperCase()}</p>
                                        </td>
                                        <td className="px-6 py-5">
                                            <p className="font-black text-slate-800 text-sm">{job.customerName}</p>
                                            <p className="text-[10px] text-slate-400 mt-0.5">{new Date(job.createdAt).toLocaleDateString()}</p>
                                        </td>
                                        <td className="px-6 py-5">
                                            <p className="text-sm font-semibold text-slate-600">{job.customerPhone || 'N/A'}</p>
                                        </td>
                                        <td className="px-6 py-5">
                                            <p className="text-sm font-bold text-slate-700">{job.serviceType}</p>
                                        </td>
                                        <td className="px-6 py-5">
                                            <FiMapPin size={15} className="text-slate-300" />
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-2">
                                                {job.assignedEmployee ? (
                                                    <>
                                                        <div className="w-8 h-8 bg-blue-600 flex items-center justify-center text-white text-xs font-black">
                                                            {job.assignedEmployee.name?.charAt(0).toUpperCase()}
                                                        </div>
                                                        <div>
                                                            <p className="text-[11px] font-bold text-slate-700">{job.assignedEmployee.name}</p>
                                                            <p className="text-[9px] text-slate-400 uppercase tracking-wide">
                                                                {job.status === 'claimed' ? 'Claiming...' : 'Technician'}
                                                            </p>
                                                        </div>
                                                    </>
                                                ) : (
                                                    <div className="text-[10px] text-slate-400 italic font-bold">No claimant yet</div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-2">
                                                <div className={`w-2 h-2 rounded-full ${s.dot}`} />
                                                <span className={`text-[10px] font-black uppercase tracking-wide ${s.color}`}>{s.label}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-2">
                                                {job.status === 'pending' || job.status === 'claimed' ? (
                                                    <>
                                                        <select
                                                            onChange={e => setSelectedEmployees(prev => ({ ...prev, [job._id]: e.target.value }))}
                                                            value={selectedEmployees[job._id] || (job.status === 'claimed' ? job.assignedEmployee?._id : '')}
                                                            className="text-[10px] font-bold bg-gray-50 border border-gray-200 px-2 py-1.5 text-slate-600 focus:outline-none"
                                                        >
                                                            <option value="">{job.status === 'claimed' ? 'Confirm Claimant' : 'Assign...'}</option>
                                                            {employees.map(e => <option key={e._id} value={e._id}>{e.name}</option>)}
                                                        </select>
                                                        <button
                                                            onClick={() => {
                                                                const empId = selectedEmployees[job._id] || (job.status === 'claimed' ? job.assignedEmployee?._id : null);
                                                                if (empId) {
                                                                    setSelectedEmployees(prev => ({ ...prev, [job._id]: empId }));
                                                                    handleAssign(job._id);
                                                                }
                                                            }}
                                                            disabled={assigning === job._id}
                                                            className="px-4 py-2 bg-blue-600 text-white text-[9px] font-black uppercase tracking-widest transition-all disabled:opacity-30 disabled:bg-slate-400"
                                                        >
                                                            {job.status === 'claimed' ? 'Finalize' : 'Confirm'}
                                                        </button>
                                                    </>
                                                ) : (
                                                    <div className="flex items-center gap-1.5 text-emerald-600 font-black text-[10px] uppercase tracking-wider bg-emerald-50 px-3 py-1.5">
                                                        <FiCheckCircle size={12} /> Confirmed
                                                    </div>
                                                )}
                                            </div>
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
