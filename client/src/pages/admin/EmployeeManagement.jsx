import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiUsers, FiUserCheck, FiUserX, FiSearch, FiPlusCircle, FiEdit2, FiTrash2, FiShield } from 'react-icons/fi';
import axios from 'axios';

export default function EmployeeManagement() {
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get('http://localhost:5000/api/auth/employees', { headers: { Authorization: `Bearer ${token}` } });
                setEmployees(res.data.data || []);
            } catch (err) {
                console.error('Failed to fetch employees');
            } finally {
                setLoading(false);
            }
        };
        fetchEmployees();
    }, []);

    const filtered = employees.filter(e =>
        e.name?.toLowerCase().includes(search.toLowerCase()) ||
        e.email?.toLowerCase().includes(search.toLowerCase()) ||
        e.role?.toLowerCase().includes(search.toLowerCase())
    );

    const roleColors = {
        technician: 'bg-blue-50 text-blue-600',
        admin: 'bg-red-50 text-red-500',
        manager: 'bg-purple-50 text-purple-600',
    };

    if (loading) return (
        <div className="flex items-center justify-center h-64">
            <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        </div>
    );

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tighter">Employee Management</h1>
                </div>
                <button className="flex items-center gap-2 px-6 py-3 bg-white border-2 border-black text-black hover:bg-gray-100 text-[10px] font-black uppercase tracking-widest rounded-none transition-all">
                    <FiPlusCircle size={16} /> Add Employee
                </button>
            </div>

            {/* Search */}
            <div className="relative">
                <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                <input type="text" placeholder="Search by name, email, or role..."
                    value={search} onChange={e => setSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-white border border-gray-100 text-sm text-slate-700 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-100 "
                />
            </div>

            {/* Employee Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filtered.length === 0 ? (
                    <div className="col-span-3 py-20 text-center">
                        <FiUsers className="mx-auto text-slate-200 mb-3" size={40} />
                        <p className="text-xs font-black text-slate-300 uppercase tracking-widest">No employees found</p>
                    </div>
                ) : filtered.map((emp, idx) => (
                    <motion.div key={emp._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.06 }}
                        className="bg-white p-6 border border-gray-100 hover: transition-all group"
                    >
                        <div className="flex items-start justify-between mb-5">
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 bg-slate-900 flex items-center justify-center text-white text-xl font-black ">
                                    {emp.name?.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <h3 className="font-black text-slate-800 text-base leading-none">{emp.name}</h3>
                                    <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-wide">{emp.email}</p>
                                </div>
                            </div>
                            <div className="flex gap-2 opacity-0 group- transition-all">
                                <button className="p-2 bg-blue-50 text-blue-600 "><FiEdit2 size={13} /></button>
                                <button className="p-2 bg-red-50 text-red-500 "><FiTrash2 size={13} /></button>
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${roleColors[emp.role?.toLowerCase()] || 'bg-slate-50 text-slate-500'}`}>
                                {emp.role || 'Technician'}
                            </span>
                            <div className="flex items-center gap-1.5">
                                <div className="w-2 h-2 rounded-full bg-emerald-500" />
                                <span className="text-[9px] font-black text-emerald-600 uppercase tracking-wide">Active</span>
                            </div>
                        </div>

                        <div className="mt-5 pt-4 border-t border-gray-50 flex items-center gap-2 text-slate-400">
                            <FiShield size={13} />
                            <span className="text-[10px] font-bold">Field Operations Specialist</span>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
