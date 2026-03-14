import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiMapPin, FiNavigation, FiCheckCircle, FiClock, FiAlertCircle, FiCamera, FiSearch } from 'react-icons/fi';
import axios from 'axios';

const statusConfig = {
    completed: { label: 'Completed', color: 'text-emerald-600', dot: 'bg-emerald-500', bg: 'bg-emerald-50' },
    progress: { label: 'In Progress', color: 'text-blue-600', dot: 'bg-blue-500', bg: 'bg-blue-50' },
    pending: { label: 'Pending', color: 'text-amber-500', dot: 'bg-amber-400', bg: 'bg-amber-50' },
};

export default function InstallationTracking() {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get('/api/jobs', { headers: { Authorization: `Bearer ${token}` } });
                setJobs(res.data.data || []);
            } catch (err) {
                console.error('Failed to fetch jobs');
            } finally {
                setLoading(false);
            }
        };
        fetchJobs();
    }, []);

    const filtered = jobs.filter(job => {
        if (job.status === 'pending') return false;
        const matchSearch = job.customerName?.toLowerCase().includes(search.toLowerCase()) ||
            job.serviceType?.toLowerCase().includes(search.toLowerCase()) ||
            job.assignedEmployee?.name?.toLowerCase().includes(search.toLowerCase());
        const matchStatus = filterStatus === 'all' || job.status === filterStatus;
        return matchSearch && matchStatus;
    });

    const stats = [
        { label: 'Total', value: jobs.length, icon: FiCamera, color: 'blue' },
        { label: 'In Progress', value: jobs.filter(j => j.status === 'progress').length, icon: FiNavigation, color: 'orange' },
        { label: 'Completed', value: jobs.filter(j => j.status === 'completed').length, icon: FiCheckCircle, color: 'emerald' },
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
                <h1 className="text-3xl font-black text-slate-900 tracking-tighter">Installation Tracker</h1>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((s, i) => (
                    <motion.div key={s.label} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
                        className="bg-white  p-5 border border-gray-100  flex items-center gap-4"
                    >
                        <div className={`w-12 h-12  flex items-center justify-center ${s.color === 'blue' ? 'bg-blue-50 text-blue-600' : s.color === 'emerald' ? 'bg-emerald-50 text-emerald-600' : s.color === 'orange' ? 'bg-orange-50 text-orange-500' : 'bg-amber-50 text-amber-500'}`}>
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
                    <input type="text" placeholder="Search by customer, service, or technician..."
                        value={search} onChange={e => setSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-white border border-gray-100  text-sm text-slate-700 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-100 "
                    />
                </div>
                <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
                    className="px-5 py-3 bg-white border border-gray-100  text-sm font-bold text-slate-600 focus:outline-none "
                >
                    <option value="all">All</option>
                    <option value="pending">Pending</option>
                    <option value="progress">In Progress</option>
                    <option value="completed">Completed</option>
                </select>
            </div>

            {/* Job Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {filtered.length === 0 ? (
                    <div className="col-span-2 py-20 text-center">
                        <FiMapPin className="mx-auto text-slate-200 mb-3" size={40} />
                        <p className="text-xs font-black text-slate-300 uppercase tracking-widest">No deployments found</p>
                    </div>
                ) : filtered.map((job, idx) => {
                    const s = statusConfig[job.status] || statusConfig.pending;
                    return (
                        <motion.div key={job._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }}
                            className="bg-white  p-6 border border-gray-100  hover: transition-all"
                        >
                            {/* Top Row */}
                            <div className="flex items-start justify-between mb-5">
                                <div>
                                    <p className="text-[10px] font-black text-blue-600 mb-1">#SV-{job._id.slice(-6).toUpperCase()}</p>
                                    <h3 className="font-black text-slate-800 text-base">{job.customerName}</h3>
                                    <p className="text-[10px] font-bold text-slate-400 mt-0.5">{job.serviceType}</p>
                                </div>
                                <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${s.bg}`}>
                                    <div className={`w-2 h-2 rounded-full ${s.dot} ${job.status === 'progress' ? 'animate-pulse' : ''}`} />
                                    <span className={`text-[9px] font-black uppercase tracking-wide ${s.color}`}>{s.label}</span>
                                </div>
                            </div>

                            {/* Details */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex items-center gap-2 text-slate-400">
                                    <FiMapPin size={13} />
                                    <span className="text-xs font-bold">Site TBD</span>
                                </div>
                                <div className="flex items-center gap-2 text-slate-400">
                                    <FiClock size={13} />
                                    <span className="text-xs font-bold">{new Date(job.createdAt).toLocaleDateString()}</span>
                                </div>
                            </div>

                            {/* Assigned Technician */}
                            {job.assignedEmployee && (
                                <div className="mt-5 pt-4 border-t border-gray-50 flex items-center gap-3">
                                    <div className="w-9 h-9 bg-slate-900  flex items-center justify-center text-white font-black text-sm ">
                                        {job.assignedEmployee.name?.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <p className="text-xs font-black text-slate-700">{job.assignedEmployee.name}</p>
                                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wide">Assigned Technician</p>
                                    </div>
                                </div>
                            )}
                            {!job.assignedEmployee && (
                                <div className="mt-5 pt-4 border-t border-gray-50 flex items-center gap-2 text-amber-500">
                                    <FiAlertCircle size={14} />
                                    <span className="text-[10px] font-black uppercase tracking-wide">Unassigned</span>
                                </div>
                            )}
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
}
