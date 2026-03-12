import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    FiCalendar, FiClock, FiCheckCircle, FiActivity,
    FiUsers, FiUserCheck, FiTarget, FiBox,
    FiBriefcase, FiZap, FiTruck, FiPlayCircle, FiLayers
} from 'react-icons/fi';
import axios from 'axios';

export default function AdminDashboardHome() {
    const [jobs, setJobs] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [attendance, setAttendance] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');
                const [jobsRes, empsRes, attRes] = await Promise.all([
                    axios.get('/api/jobs', { headers: { Authorization: `Bearer ${token}` } }),
                    axios.get('/api/auth/employees', { headers: { Authorization: `Bearer ${token}` } }),
                    axios.get('/api/attendance', { headers: { Authorization: `Bearer ${token}` } })
                ]);
                setJobs(jobsRes.data.data || []);
                setEmployees(empsRes.data.data || []);
                setAttendance(attRes.data.data || []);
            } catch (err) {
                console.error('Error fetching dashboard data:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const operationsStats = [
        { label: 'Total Bookings', value: jobs.length.toString(), badge: 'LIVE', icon: FiCalendar, color: 'blue', badgeColor: 'emerald' },
        { label: 'New Requests', value: jobs.filter(j => j.status === 'pending').length.toString(), badge: 'NEEDS ACTION', icon: FiClock, color: 'amber', badgeColor: 'slate' },
        { label: 'In Progress', value: jobs.filter(j => j.status === 'progress').length.toString(), badge: 'ACTIVE', icon: FiTruck, color: 'orange', badgeColor: 'blue' },
        { label: 'Completed', value: jobs.filter(j => j.status === 'completed').length.toString(), badge: 'DONE', icon: FiCheckCircle, color: 'emerald', badgeColor: 'emerald' },
    ];

    const today = new Date().toISOString().split('T')[0];
    const presentToday = attendance.filter(a => a.date === today).length;

    const staffStats = [
        { label: 'Total Employees', value: employees.length.toString(), badge: 'STABLE', icon: FiUsers, color: 'blue', badgeColor: 'slate' },
        { label: 'Present Today', value: presentToday.toString(), badge: 'LIVE', icon: FiUserCheck, color: 'emerald', badgeColor: 'emerald' },
        { label: 'Technicians', value: employees.filter(e => e.role === 'employee').length.toString(), badge: 'FIELD', icon: FiPlayCircle, color: 'blue', badgeColor: 'indigo' },
    ];

    const getStatusLabel = (status) => {
        const config = {
            completed: 'COMPLETED',
            progress: 'IN PROGRESS',
            assigned: 'CONFIRMED',
            claimed: 'AGENT REQ',
            pending: 'NEW'
        };
        return config[status] || status.toUpperCase();
    };

    const recentBookings = jobs.slice(0, 5).map(job => ({
        id: job._id || 'N/A',
        name: job.customerName || 'Anonymous',
        service: job.serviceType || 'Service',
        office: job.customerAddress ? job.customerAddress.split(',')[0] : 'Remote',
        date: job.createdAt ? new Date(job.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'Recently',
        status: job.status || 'pending',
        displayStatus: getStatusLabel(job.status || 'pending')
    }));

    const StatCard = ({ stat, index }) => (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white p-6 border border-gray-100 hover: shadow-sm transition-all flex items-center justify-between group"
        >
            <div className="flex items-center gap-5">
                <div className={`w-14 h-14 flex items-center justify-center text-xl transition-colors ${stat.color === 'blue' ? 'bg-blue-50 text-blue-600' :
                    stat.color === 'emerald' ? 'bg-emerald-50 text-emerald-600' :
                        stat.color === 'amber' ? 'bg-amber-50 text-amber-600' :
                            stat.color === 'orange' ? 'bg-orange-50 text-orange-600' :
                                'bg-gray-50 text-gray-600'
                    }`}>
                    <stat.icon />
                </div>
                <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
                    <p className="text-2xl font-black text-slate-800 tracking-tighter leading-none">{stat.value}</p>
                </div>
            </div>

            <div className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border ${stat.badgeColor === 'emerald' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                stat.badgeColor === 'blue' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                    stat.badgeColor === 'slate' ? 'bg-slate-50 text-slate-400 border-slate-100' :
                        stat.badgeColor === 'indigo' ? 'bg-indigo-50 text-indigo-600 border-indigo-100' :
                            'bg-gray-50 text-gray-400 border-gray-100'
                }`}>
                {stat.badge}
            </div>
        </motion.div>
    );

    if (loading) return (
        <div className="flex items-center justify-center h-64">
            <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        </div>
    );

    return (
        <div className="space-y-12 pb-12">
            {/* Category: Operations */}
            <section className="space-y-6">
                <div className="flex items-center gap-3 text-slate-400 pl-2">
                    <FiLayers size={14} />
                    <h2 className="text-[10px] font-black uppercase tracking-[0.3em]">Operations</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {operationsStats.map((stat, i) => (
                        <StatCard key={stat.label} stat={stat} index={i} />
                    ))}
                </div>
            </section>

            {/* Category: Staff */}
            <section className="space-y-6">
                <div className="flex items-center gap-3 text-slate-400 pl-2">
                    <FiUsers size={14} />
                    <h2 className="text-[10px] font-black uppercase tracking-[0.3em]">Staff</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {staffStats.map((stat, i) => (
                        <StatCard key={stat.label} stat={stat} index={i + 4} />
                    ))}
                </div>
            </section>

            {/* Bottom Section: Bookings */}
            <div className="space-y-6">
                {/* Recent Booking Requests */}
                <div className="bg-white p-10 border border-gray-100 ">
                    <div className="flex items-center justify-between mb-10">
                        <div>
                            <h2 className="text-xl font-black text-slate-900 tracking-tight">Recent Booking Requests</h2>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Incoming Installation Inquiries</p>
                        </div>
                        <a href="/admin-dashboard/bookings" className="px-6 py-2.5 bg-white border border-gray-200 text-[10px] font-black uppercase tracking-widest text-slate-600 transition-all hover:bg-gray-50">
                            View All
                        </a>
                    </div>

                    <div className="space-y-6">
                        {recentBookings.length === 0 ? (
                            <p className="text-center text-slate-400 font-bold uppercase tracking-widest text-xs py-10">No recent bookings</p>
                        ) : recentBookings.map((booking, idx) => (
                            <motion.div
                                key={booking.id}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                className="flex items-center justify-between group"
                            >
                                <div className="flex items-center gap-5">
                                    <div className="w-12 h-12 bg-gray-50 flex items-center justify-center text-slate-400 font-black text-sm border border-gray-100 uppercase">
                                        {booking.name.charAt(0)}
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-black text-slate-800 tracking-tight leading-none mb-1.5">{booking.name}</h4>
                                        <p className="text-[11px] font-bold text-slate-400 leading-none">
                                            {booking.service} • {booking.office}
                                        </p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <span className={`text-[10px] font-black uppercase tracking-widest ${booking.status === 'completed' || booking.status === 'assigned' ? 'text-emerald-600' :
                                            booking.status === 'pending' ? 'text-amber-500' :
                                                booking.status === 'progress' ? 'text-blue-600' :
                                                    booking.status === 'claimed' ? 'text-orange-500' : 'text-slate-400'
                                        }`}>
                                        {booking.displayStatus}
                                    </span>
                                    <p className="text-[10px] font-bold text-slate-300 mt-1 uppercase">{booking.date}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

