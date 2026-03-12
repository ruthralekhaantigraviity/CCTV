import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiUser, FiMail, FiPhone, FiLock, FiArrowRight, FiShield, FiKey, FiActivity } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';

export default function AdminSignup() {
 const [form, setForm] = useState({
 name: '',
 email: '',
 phone: '',
 password: '',
 confirmPassword: '',
 adminSecret: ''
 });
 const [error, setError] = useState('');
 const [loading, setLoading] = useState(false);
 const { register } = useAuth();
 const navigate = useNavigate();

 const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

 const handleSubmit = async (e) => {
 e.preventDefault();
 setError('');

 if (form.password !== form.confirmPassword) {
 return setError('Passwords do not match');
 }

 setLoading(true);
 try {
 const res = await register({
 ...form,
 role: 'admin'
 });
 if (res.success) {
 navigate('/admin/dashboard');
 }
 } catch (err) {
 setError(err.response?.data?.message || 'Registration failed');
 } finally {
 setLoading(false);
 }
 };

 return (
 <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center py-20 px-4 font-['Inter']">
 {/* Background Effects */}
 <div className="fixed inset-0 overflow-hidden pointer-events-none">
 <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/10 blur-[120px] rounded-full" />
 <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-500/10 blur-[120px] rounded-full" />
 </div>

 <motion.div
 initial={{ opacity: 0, y: 20 }}
 animate={{ opacity: 1, y: 0 }}
 className="max-w-2xl w-full relative z-10"
 >
 {/* Header */}
 <div className="text-center mb-10">
 <motion.div
 initial={{ scale: 0.8 }}
 animate={{ scale: 1 }}
 className="w-16 h-16 bg-blue-600 rounded-none flex items-center justify-center mx-auto mb-6 shadow-2xl border border-blue-500"
 >
 <FiUser className="text-white text-2xl" />
 </motion.div>
 <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tighter mb-2 italic text-center">Commission Admin</h1>
 <div className="flex items-center justify-center gap-2 text-blue-600 text-[9px] font-bold uppercase tracking-[0.4em]">
 <FiActivity className="animate-pulse" /> Security Clearance Level 5 Required
 </div>
 </div>

 {/* Form Card */}
 <div className="bg-white/70 backdrop-blur-xl p-8 md:p-12 rounded-none border border-slate-200 shadow-2xl shadow-slate-200/50">
 {error && (
 <motion.div
 initial={{ opacity: 0, x: -10 }}
 animate={{ opacity: 1, x: 0 }}
 className="mb-8 p-5 bg-red-50 border border-red-100 text-red-600 text-[10px] font-bold rounded-none flex items-center gap-4 uppercase tracking-widest"
 >
 <FiShield className="text-lg flex-shrink-0" /> {error}
 </motion.div>
 )}

 <form onSubmit={handleSubmit} className="space-y-6">
 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
 <div className="space-y-2">
 <label className="text-[10px] font-bold uppercase text-slate-400 tracking-widest flex items-center gap-2 pl-2">
 <FiUser className="text-blue-600" /> Full Name
 </label>
 <input
 type="text"
 name="name"
 required
 value={form.name}
 onChange={handleChange}
 placeholder="Admin Name"
 className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-none focus:bg-white focus:border-blue-500/50 outline-none transition-all text-slate-900 text-sm"
 />
 </div>
 <div className="space-y-2">
 <label className="text-[10px] font-bold uppercase text-slate-400 tracking-widest flex items-center gap-2 pl-2">
 <FiPhone className="text-blue-600" /> Direct Line
 </label>
 <input
 type="tel"
 name="phone"
 required
 value={form.phone}
 onChange={handleChange}
 placeholder="+91..."
 className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-none focus:bg-white focus:border-blue-500/50 outline-none transition-all text-slate-900 text-sm"
 />
 </div>
 </div>

 <div className="space-y-2">
 <label className="text-[10px] font-bold uppercase text-slate-400 tracking-widest flex items-center gap-2 pl-2">
 <FiMail className="text-blue-600" /> Secure Email
 </label>
 <input
 type="email"
 name="email"
 required
 value={form.email}
 onChange={handleChange}
 placeholder="admin@securevision.com"
 className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:border-blue-500/50 outline-none transition-all text-slate-900 text-sm"
 />
 </div>

 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
 <div className="space-y-2">
 <label className="text-[10px] font-bold uppercase text-slate-400 tracking-widest flex items-center gap-2 pl-2">
 <FiLock className="text-blue-600" /> Security Key
 </label>
 <input
 type="password"
 name="password"
 required
 value={form.password}
 onChange={handleChange}
 placeholder="••••••••"
 className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-none focus:bg-white focus:border-blue-500/50 outline-none transition-all text-slate-900 text-sm"
 />
 </div>
 <div className="space-y-2">
 <label className="text-[10px] font-bold uppercase text-slate-400 tracking-widest flex items-center gap-2 pl-2">
 <FiLock className="text-blue-600" /> Confirm Key
 </label>
 <input
 type="password"
 name="confirmPassword"
 required
 value={form.confirmPassword}
 onChange={handleChange}
 placeholder="••••••••"
 className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-none focus:bg-white focus:border-blue-500/50 outline-none transition-all text-slate-900 text-sm"
 />
 </div>
 </div>

 <div className="pt-4 border-t border-slate-100 mt-6">
 <div className="space-y-2">
 <label className="text-[10px] font-bold uppercase text-indigo-600 tracking-widest flex items-center gap-2 pl-2">
 <FiKey /> Master Admin Authorization Secret
 </label>
 <input
 type="password"
 name="adminSecret"
 required
 value={form.adminSecret}
 onChange={handleChange}
 placeholder="Enter Secret Code"
 className="w-full px-6 py-4 bg-indigo-50 border border-indigo-100 rounded-none focus:bg-white focus:border-indigo-500/50 outline-none transition-all text-slate-900 text-sm font-bold"
 />
 </div>
 </div>

 <button
 type="submit"
 disabled={loading}
 className="w-full py-5 bg-blue-600 text-white font-black rounded-none flex items-center justify-center gap-4 transition-all uppercase tracking-[0.3em] text-[10px] mt-8 shadow-xl disabled:opacity-50"
 >
 {loading ? 'Authorizing...' : 'Initialize Commission'} <FiArrowRight />
 </button>

 <div className="text-center pt-6">
 <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
 Authorized Personnel? {' '}
 <Link to="/admin/login" className="text-blue-600 hover:underline">Return to Access Portal</Link>
 </p>
 </div>
 </form>
 </div>
 </motion.div>
 </div>
 );
}
