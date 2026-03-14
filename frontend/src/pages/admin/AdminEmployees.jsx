import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiUsers, FiMail, FiPhone, FiShield, FiMoreVertical, FiEdit3, FiTrash2, FiPlus, FiSearch, FiX, FiLock } from 'react-icons/fi';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function AdminEmployees() {
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
        employeeId: ''
    });

    const fetchEmployees = async () => {
        try {
            const token = localStorage.getItem('token');
            console.log('--- FETCH EMPLOYEES SECURITY CHECK ---');
            console.log('TOKEN EXISTS:', !!token);
            
            // Debug profile
            const profRes = await fetch('http://localhost:5000/api/auth/profile', { 
                headers: { Authorization: `Bearer ${token}` } 
            });
            const profData = await profRes.json();
            console.log('PROFILE DATA:', profData);

            const res = await axios.get('http://localhost:5000/api/auth/employees', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setEmployees(res.data.data || []);
        } catch (err) {
            console.error('FETCH EMPLOYEES ERROR:', err);
            toast.error('Failed to load personnel directory');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEmployees();
    }, []);

    const handleAddEmployee = async (e) => {
        e.preventDefault();
        console.log('--- ATTEMPTING TO ADD EMPLOYEE ---');
        console.log('FORM DATA:', formData);
        
        try {
            const token = localStorage.getItem('token');
            const targetUrl = 'http://localhost:5000/api/auth/employees';
            console.log('TARGET URL:', targetUrl);
            console.log('TOKEN PREFIX:', token?.substring(0, 20));

            const res = await axios.post(targetUrl, formData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            console.log('ADD SUCCESS RESPONSE:', res.data);
            toast.success('Employee Added Successfully');
            setShowModal(false);
            setFormData({ name: '', email: '', phone: '', password: '', employeeId: '' });
            fetchEmployees();
        } catch (err) {
            console.error('--- ADD EMPLOYEE FAILURE ---');
            console.error('FULL ERROR:', err);
            if (err.response) {
                console.error('ERROR STATUS:', err.response.status);
                console.error('ERROR DATA:', err.response.data);
                toast.error(err.response.data.message || 'Authorization Failure');
            } else {
                toast.error('Network Error - Server might be down');
            }
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to remove this member?')) return;
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`http://localhost:5000/api/auth/employees/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success('Member removed');
            fetchEmployees();
        } catch (err) {
            toast.error('Failed to remove member');
        }
    };

    const filtered = employees.filter(emp =>
        emp.name?.toLowerCase().includes(search.toLowerCase()) ||
        emp.employeeId?.toLowerCase().includes(search.toLowerCase()) ||
        emp.email?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tighter">Personnel Directory</h1>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Fleet Member Management</p>
                </div>
                <button 
                    onClick={() => setShowModal(true)}
                    className="bg-blue-600 text-white px-8 py-4 font-black uppercase tracking-widest text-[10px] flex items-center gap-3 transition-all hover:bg-slate-900"
                >
                    <FiPlus size={18} /> Add New Member
                </button>
            </div>

            <div className="bg-white border border-slate-100 overflow-hidden">
                <div className="p-8 border-b border-slate-50 flex flex-col md:flex-row gap-6 items-center justify-between">
                    <div className="flex items-center bg-slate-50 px-6 py-4 border border-slate-100 w-full md:w-96 focus-within:border-blue-600 transition-all">
                        <FiSearch className="text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search names, emails, or IDs..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="bg-transparent border-none outline-none ml-4 text-[10px] w-full font-black placeholder:text-slate-300 uppercase tracking-widest"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 text-[9px] uppercase font-black text-slate-400 tracking-[0.2em]">
                            <tr>
                                <th className="px-10 py-6">Member ID</th>
                                <th className="px-10 py-6">Identity</th>
                                <th className="px-10 py-6">Designation</th>
                                <th className="px-10 py-6">Contact</th>
                                <th className="px-10 py-6 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50 font-sans">
                            {loading ? (
                                <tr>
                                    <td colSpan="5" className="px-10 py-20 text-center text-slate-300 font-black uppercase tracking-widest text-[10px]">Updating Registry...</td>
                                </tr>
                            ) : filtered.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="px-10 py-20 text-center text-slate-300 font-black uppercase tracking-widest text-[10px]">No members found</td>
                                </tr>
                            ) : filtered.map((emp) => (
                                <motion.tr
                                    key={emp._id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className=" transition-colors group"
                                >
                                    <td className="px-10 py-6">
                                        <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">{emp.employeeId || 'NOT SET'}</span>
                                    </td>
                                    <td className="px-10 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 bg-slate-900 text-white flex items-center justify-center font-black text-[10px] ">
                                                {emp.name?.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <p className="text-sm font-black text-slate-900">{emp.name}</p>
                                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mt-1.5">SV Staff Registered</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-10 py-6 text-xs font-black text-slate-600 uppercase tracking-widest">
                                        Field Technician
                                    </td>
                                    <td className="px-10 py-6">
                                        <div className="flex flex-col gap-1.5">
                                            <div className="flex items-center gap-2 text-[9px] font-black text-slate-400 uppercase tracking-tighter">
                                                <FiMail className="text-blue-600" /> {emp.email}
                                            </div>
                                            <div className="flex items-center gap-2 text-[9px] font-black text-slate-400 uppercase tracking-tighter">
                                                <FiPhone className="text-blue-600" /> {emp.phone}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-10 py-6 text-right">
                                        <button 
                                            onClick={() => handleDelete(emp._id)}
                                            className="p-3 text-slate-300 hover:text-red-600 transition-colors"
                                        >
                                            <FiTrash2 size={16} />
                                        </button>
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <AnimatePresence>
                {showModal && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                    >
                        <motion.div 
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="bg-white w-full max-w-lg overflow-hidden shadow-2xl relative"
                        >
                            <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-900 text-white">
                                <div>
                                    <h2 className="text-xl font-black uppercase tracking-tighter">Deploy Technician</h2>
                                    <p className="text-[9px] font-black text-blue-400 uppercase tracking-widest mt-1">Register New Fleet Member</p>
                                </div>
                                <button onClick={() => setShowModal(false)} className="text-white hover:rotate-90 transition-transform">
                                    <FiX size={24} />
                                </button>
                            </div>

                            <form onSubmit={handleAddEmployee} className="p-8 space-y-6">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest pl-1">Employee ID</label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.employeeId}
                                            onChange={e => setFormData({...formData, employeeId: e.target.value})}
                                            placeholder="EMP-SC-101"
                                            className="w-full bg-slate-50 border border-slate-100 px-5 py-4 text-[10px] font-black uppercase tracking-widest outline-none focus:border-blue-600"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest pl-1">Full Name</label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.name}
                                            onChange={e => setFormData({...formData, name: e.target.value})}
                                            placeholder="JOHN DOE"
                                            className="w-full bg-slate-50 border border-slate-100 px-5 py-4 text-[10px] font-black uppercase tracking-widest outline-none focus:border-blue-600"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest pl-1">Credentials (Email)</label>
                                    <input
                                        type="email"
                                        required
                                        value={formData.email}
                                        onChange={e => setFormData({...formData, email: e.target.value})}
                                        placeholder="TECHNICIAN@SV.COM"
                                        className="w-full bg-slate-50 border border-slate-100 px-5 py-4 text-[10px] font-black uppercase tracking-widest outline-none focus:border-blue-600"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest pl-1">Communication (Phone)</label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.phone}
                                            onChange={e => setFormData({...formData, phone: e.target.value})}
                                            placeholder="+91 XXXXX XXXXX"
                                            className="w-full bg-slate-50 border border-slate-100 px-5 py-4 text-[10px] font-black uppercase tracking-widest outline-none focus:border-blue-600"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest pl-1">Access Key (Password)</label>
                                        <div className="relative">
                                            <FiLock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" />
                                            <input
                                                type="password"
                                                required
                                                value={formData.password}
                                                onChange={e => setFormData({...formData, password: e.target.value})}
                                                placeholder="••••••••"
                                                className="w-full bg-slate-50 border border-slate-100 pl-12 pr-5 py-4 text-[10px] font-black uppercase tracking-widest outline-none focus:border-blue-600"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <button 
                                    type="submit"
                                    className="w-full bg-blue-600 text-white py-5 font-black uppercase tracking-[0.2em] text-[10px] flex items-center justify-center gap-3 transition-all hover:bg-slate-900 mt-4"
                                >
                                    Authorize Membership <FiShield size={16} />
                                </button>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
