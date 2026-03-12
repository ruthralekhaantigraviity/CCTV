import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiUsers, FiUserCheck, FiSearch, FiPlusCircle, FiEdit2, FiTrash2, FiShield, FiX, FiMail, FiPhone, FiLock, FiTerminal } from 'react-icons/fi';
import axios from 'axios';

export default function EmployeeManagement() {
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formLoading, setFormLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
        role: 'employee'
    });

    useEffect(() => {
        fetchEmployees();
    }, []);

    const fetchEmployees = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get('/api/auth/employees', { headers: { Authorization: `Bearer ${token}` } });
            setEmployees(res.data.data || []);
        } catch (err) {
            console.error('Failed to fetch employees');
        } finally {
            setLoading(false);
        }
    };

    const handleAddMember = async (e) => {
        e.preventDefault();
        setFormLoading(true);
        try {
            const token = localStorage.getItem('token');
            const res = await axios.post('/api/auth/employees', formData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.data.success) {
                setIsModalOpen(false);
                setFormData({ name: '', email: '', phone: '', password: '', role: 'employee' });
                fetchEmployees();
                alert('Member registered successfully!');
            }
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to add member');
        } finally {
            setFormLoading(false);
        }
    };

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
        <div className="space-y-8 relative">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tighter">Employee Management</h1>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 px-6 py-3 bg-white border-2 border-black text-black hover:bg-gray-100 text-[10px] font-black uppercase tracking-widest rounded-none transition-all"
                >
                    <FiPlusCircle size={16} /> Add Employee
                </button>
            </div>

            {/* Search */}
            <div className="relative">
                <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                <input
                    type="text"
                    placeholder="Search by name, email, or role..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-white border border-gray-100 text-sm text-slate-700 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-100 "
                />
            </div>

            {/* Employee Table */}
            <div className="bg-white border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-gray-100 bg-gray-50/60">
                                <th className="px-6 py-4 text-[9px] font-black uppercase tracking-widest text-slate-400">Employee</th>
                                <th className="px-6 py-4 text-[9px] font-black uppercase tracking-widest text-slate-400">Contact Access</th>
                                <th className="px-6 py-4 text-[9px] font-black uppercase tracking-widest text-slate-400">Authorization Role</th>
                                <th className="px-6 py-4 text-[9px] font-black uppercase tracking-widest text-slate-400">Status</th>
                                <th className="px-6 py-4 text-[9px] font-black uppercase tracking-widest text-slate-400 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {filtered.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="py-20 text-center">
                                        <FiUsers className="mx-auto text-slate-200 mb-3" size={40} />
                                        <p className="text-xs font-black text-slate-300 uppercase tracking-widest">No personnel found</p>
                                    </td>
                                </tr>
                            ) : filtered.map((emp, idx) => (
                                <motion.tr 
                                    key={emp._id} 
                                    initial={{ opacity: 0 }} 
                                    animate={{ opacity: 1 }} 
                                    transition={{ delay: idx * 0.03 }}
                                    className="transition-colors group hover:bg-slate-50/50"
                                >
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-slate-900 flex items-center justify-center text-white text-sm font-black ">
                                                {emp.name?.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <p className="font-black text-slate-800 text-sm leading-tight">{emp.name}</p>
                                                <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">ID: {emp._id.slice(-6).toUpperCase()}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2 text-slate-600">
                                                <FiMail size={12} className="text-blue-500" />
                                                <span className="text-xs font-bold">{emp.email}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-slate-600">
                                                <FiPhone size={12} className="text-blue-500" />
                                                <span className="text-xs font-bold">{emp.phone || 'N/A'}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <span className={`px-3 py-1.5 text-[9px] font-black uppercase tracking-widest ${roleColors[emp.role?.toLowerCase()] || 'bg-slate-100 text-slate-600'}`}>
                                            {emp.role || 'Technician'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                            <span className="text-[10px] font-black text-emerald-600 uppercase tracking-wide">Authorized</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5 text-right">
                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
                                            <button 
                                                className="p-2.5 bg-white border border-slate-100 text-blue-600 hover:bg-blue-600 hover:text-white transition-all shadow-sm"
                                                title="Edit Access"
                                            >
                                                <FiEdit2 size={13} />
                                            </button>
                                            <button 
                                                className="p-2.5 bg-white border border-slate-100 text-red-500 hover:bg-red-500 hover:text-white transition-all shadow-sm"
                                                title="Revoke Access"
                                            >
                                                <FiTrash2 size={13} />
                                            </button>
                                        </div>
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Registration Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="bg-white w-full max-w-lg shadow-2xl  overflow-hidden flex flex-col"
                        >
                            <div className="bg-slate-900 p-8 text-white relative">
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="absolute top-8 right-8 text-slate-400 hover:text-white transition-colors"
                                >
                                    <FiX size={20} />
                                </button>
                                <div className="w-12 h-12 bg-blue-600 flex items-center justify-center mb-6 shadow-2xl ">
                                    <FiTerminal size={24} />
                                </div>
                                <h3 className="text-xl font-black uppercase tracking-tighter">Register New Employee</h3>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] mt-2">Staff Registration Protocol</p>
                            </div>

                            <form onSubmit={handleAddMember} className="p-10 space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest pl-1">Full Identity</label>
                                    <div className="relative">
                                        <FiTerminal className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-500" />
                                        <input
                                            required
                                            type="text"
                                            placeholder="Enter Full Name"
                                            value={formData.name}
                                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                                            className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 text-sm font-bold focus:bg-white focus:ring-2 focus:ring-blue-600 outline-none transition-all "
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest pl-1">Email Access</label>
                                        <div className="relative">
                                            <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-500" />
                                            <input
                                                required
                                                type="email"
                                                placeholder="staff@sv.com"
                                                value={formData.email}
                                                onChange={e => setFormData({ ...formData, email: e.target.value })}
                                                className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 text-sm font-bold focus:bg-white focus:ring-2 focus:ring-blue-600 outline-none transition-all "
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest pl-1">Comms Link</label>
                                        <div className="relative">
                                            <FiPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-500" />
                                            <input
                                                required
                                                type="tel"
                                                placeholder="+91 00000 00000"
                                                value={formData.phone}
                                                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                                className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 text-sm font-bold focus:bg-white focus:ring-2 focus:ring-blue-600 outline-none transition-all "
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest pl-1">Secure Credential</label>
                                    <div className="relative">
                                        <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-500" />
                                        <input
                                            required
                                            type="password"
                                            placeholder="Assign Temporary Password"
                                            value={formData.password}
                                            onChange={e => setFormData({ ...formData, password: e.target.value })}
                                            className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 text-sm font-bold focus:bg-white focus:ring-2 focus:ring-blue-600 outline-none transition-all "
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={formLoading}
                                    className="w-full py-5 bg-slate-900 text-white font-black uppercase tracking-[0.3em] text-[10px] hover:bg-blue-600 transition-all shadow-xl flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50"
                                >
                                    {formLoading ? 'Executing...' : 'Authorize Personnel'}
                                </button>
                                <p className="text-center text-[8px] font-black text-slate-300 uppercase tracking-widest">Employee will gain immediate access to terminal commands upon authorization</p>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
