import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiUsers, FiUserCheck, FiSearch, FiPlusCircle, FiEdit2, FiTrash2, FiShield, FiX, FiMail, FiPhone, FiLock, FiTerminal, FiHash } from 'react-icons/fi';
import axios from 'axios';
import toast from 'react-hot-toast';
import { confirmToast } from '../../utils/confirmToast';

export default function EmployeeManagement() {
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formLoading, setFormLoading] = useState(false);
    const [editEmployee, setEditEmployee] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
        role: 'employee',
        employeeId: ''
    });

    useEffect(() => {
        fetchEmployees();
    }, []);

    const fetchEmployees = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get('http://localhost:5000/api/auth/employees', { 
                headers: { Authorization: `Bearer ${token}` } 
            });
            setEmployees(res.data.data || []);
        } catch (err) {
            console.error('Failed to fetch employees:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleAddMember = async (e) => {
        e.preventDefault();
        setFormLoading(true);
        console.log('--- REGISTERING EMPLOYEE ---');
        console.log('DATA:', formData);
        
        try {
            const token = localStorage.getItem('token');
            let res;
            if (editEmployee) {
                // Remove password from update if it's empty
                const updateData = { ...formData };
                if (!updateData.password) delete updateData.password;
                
                res = await axios.put(`http://localhost:5000/api/auth/employees/${editEmployee._id}`, updateData, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            } else {
                res = await axios.post('http://localhost:5000/api/auth/employees', formData, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            }
            
            if (res.data.success) {
                console.log('OPERATION SUCCESS');
                setIsModalOpen(false);
                setEditEmployee(null);
                setFormData({ name: '', email: '', phone: '', password: '', role: 'employee', employeeId: '' });
                fetchEmployees();
                toast.success(editEmployee ? 'Employee Updated!' : 'Employee Registered Successfully!', {
                    style: {
                        borderRadius: '0px',
                        background: '#0f172a',
                        color: '#fff',
                        fontWeight: 'bold',
                        fontSize: '12px'
                    }
                });
            }
        } catch (err) {
            console.error('REGISTRATION FAILURE:', err);
            const errMsg = err.response?.data?.message || 'Failed to register employee';
            toast.error(errMsg, {
                style: {
                    borderRadius: '0px',
                    fontSize: '12px'
                },
            });
        } finally {
            setFormLoading(false);
        }
    };

    const filtered = employees.filter(e =>
        e.name?.toLowerCase().includes(search.toLowerCase()) ||
        e.email?.toLowerCase().includes(search.toLowerCase()) ||
        e.employeeId?.toLowerCase().includes(search.toLowerCase())
    );

    const roleColors = {
        technician: 'bg-slate-50 text-slate-600',
        admin: 'bg-red-50 text-red-500',
        manager: 'bg-purple-50 text-purple-600',
    };

    if (loading) return (
        <div className="flex items-center justify-center h-64">
            <div className="w-10 h-10 border-4 border-slate-900 border-t-transparent rounded-full animate-spin" />
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
                    onClick={() => {
                        setEditEmployee(null);
                        setFormData({ name: '', email: '', phone: '', password: '', role: 'employee', employeeId: '' });
                        setIsModalOpen(true);
                    }}
                    className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white hover:bg-black text-[10px] font-black uppercase tracking-widest rounded-none transition-all shadow-xl"
                >
                    <FiPlusCircle size={16} /> Add Employee
                </button>
            </div>

            {/* Search */}
            <div className="relative">
                <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                <input
                    type="text"
                    placeholder="Search by name, email, or employee ID..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-3.5 bg-white border border-gray-100 text-sm text-slate-700 placeholder-slate-300 focus:outline-none focus:ring-1 focus:ring-slate-900 rounded-none"
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
                                <th className="px-6 py-4 text-[9px] font-black uppercase tracking-widest text-slate-400">Employee ID</th>
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
                                                <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">{emp.role}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2 text-slate-600">
                                                <FiMail size={12} className="text-slate-400" />
                                                <span className="text-xs font-bold">{emp.email}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-slate-600">
                                                <FiPhone size={12} className="text-slate-400" />
                                                <span className="text-xs font-bold">{emp.phone || 'N/A'}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-2 text-slate-900 bg-slate-50 px-3 py-1.5 w-fit border border-slate-100">
                                            <FiHash size={10} className="text-slate-400" />
                                            <span className="text-[10px] font-black tracking-widest uppercase">{emp.employeeId || 'NOT SET'}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 bg-emerald-500" />
                                            <span className="text-[10px] font-black text-emerald-600 uppercase tracking-wide">ACTIVE</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5 text-right">
                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
                                            <button 
                                                onClick={() => {
                                                    setEditEmployee(emp);
                                                    setFormData({
                                                        name: emp.name,
                                                        email: emp.email,
                                                        phone: emp.phone || '',
                                                        password: '', // Leave empty for no change
                                                        role: emp.role || 'employee',
                                                        employeeId: emp.employeeId || ''
                                                    });
                                                    setIsModalOpen(true);
                                                }}
                                                className="p-2.5 bg-white border border-slate-100 text-slate-600 hover:bg-black hover:text-white transition-all shadow-sm"
                                            >
                                                <FiEdit2 size={13} />
                                            </button>
                                            <button 
                                                onClick={() => {
                                                    confirmToast(
                                                        'Remove Personnel?',
                                                        `Are you sure you want to remove ${emp.name}? This will revoke all terminal access immediately.`,
                                                        async () => {
                                                            try {
                                                                const token = localStorage.getItem('token');
                                                                await axios.delete(`http://localhost:5000/api/auth/employees/${emp._id}`, { headers: { Authorization: `Bearer ${token}` } });
                                                                toast.success('Employee removed');
                                                                fetchEmployees();
                                                            } catch(err) {
                                                                toast.error('Failed to remove employee');
                                                            }
                                                        }
                                                    );
                                                }}
                                                className="p-2.5 bg-white border border-slate-100 text-red-500 hover:bg-red-500 hover:text-white transition-all shadow-sm"
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
                    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 10 }}
                            className="bg-white w-full max-w-lg shadow-[0_0_50px_rgba(0,0,0,0.2)] overflow-hidden flex flex-col"
                        >
                            <div className="bg-slate-900 p-10 text-white relative">
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="absolute top-10 right-10 text-slate-500 hover:text-white transition-colors"
                                >
                                    <FiX size={20} />
                                </button>
                                <div className="w-12 h-12 bg-white/10 flex items-center justify-center mb-6">
                                    <FiUserCheck size={24} />
                                </div>
                                <h3 className="text-xl font-black uppercase tracking-tighter">{editEmployee ? 'Edit Employee' : 'Register Employee'}</h3>
                                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.3em] mt-2">{editEmployee ? 'Modify Staff Credentials & Profile' : 'Staff Access Provisioning Protocol'}</p>
                            </div>

                            <form onSubmit={handleAddMember} className="p-10 space-y-8">
                                <div className="space-y-2">
                                    <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest pl-1">Full Identity</label>
                                    <div className="relative">
                                        <FiTerminal className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                        <input
                                            required
                                            type="text"
                                            placeholder="Enter Full Name"
                                            value={formData.name}
                                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                                            className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 text-sm font-bold focus:bg-white focus:border-slate-900 outline-none transition-all"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest pl-1">Email Access</label>
                                        <div className="relative">
                                            <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                            <input
                                                required
                                                type="email"
                                                placeholder="staff@sv.com"
                                                value={formData.email}
                                                onChange={e => setFormData({ ...formData, email: e.target.value })}
                                                className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 text-sm font-bold focus:bg-white focus:border-slate-900 outline-none transition-all"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest pl-1">Staff ID</label>
                                        <div className="relative">
                                            <FiHash className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                            <input
                                                required
                                                type="text"
                                                placeholder="EMP-101"
                                                value={formData.employeeId}
                                                onChange={e => setFormData({ ...formData, employeeId: e.target.value })}
                                                className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 text-sm font-bold focus:bg-white focus:border-slate-900 outline-none transition-all"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest pl-1">Comms Link</label>
                                    <div className="relative">
                                        <FiPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                        <input
                                            required
                                            type="tel"
                                            placeholder="+91 00000 00000"
                                            value={formData.phone}
                                            onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                            className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 text-sm font-bold focus:bg-white focus:border-slate-900 outline-none transition-all"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest pl-1">
                                        {editEmployee ? 'Update Credential (Leave blank to keep same)' : 'Secure Credential'}
                                    </label>
                                    <div className="relative">
                                        <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                        <input
                                            required={!editEmployee}
                                            type="password"
                                            placeholder={editEmployee ? 'Optional: Enter new password' : 'Assign Password'}
                                            value={formData.password}
                                            onChange={e => setFormData({ ...formData, password: e.target.value })}
                                            className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 text-sm font-bold focus:bg-white focus:border-slate-900 outline-none transition-all"
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={formLoading}
                                    className="w-full py-5 bg-slate-900 text-white font-black uppercase tracking-[0.3em] text-[10px] hover:bg-black transition-all shadow-2xl flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50"
                                >
                                    {formLoading ? 'Executing...' : editEmployee ? 'Update Profile' : 'Register Employee'}
                                </button>
                                <p className="text-center text-[8px] font-black text-slate-300 uppercase tracking-widest mt-4">Authorization will grant immediate secure terminal access</p>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
