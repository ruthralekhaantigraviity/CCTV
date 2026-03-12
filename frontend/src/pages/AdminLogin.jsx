import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiLock, FiArrowRight, FiShield, FiEye, FiEyeOff, FiActivity } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';

export default function AdminLogin() {
 const [showPassword, setShowPassword] = useState(false);
 const [form, setForm] = useState({ email: '', password: '' });
 const [error, setError] = useState('');
 const [loading, setLoading] = useState(false);
 const { login, logout, user } = useAuth();
 const navigate = useNavigate();

 // If already logged in as admin, redirect to dashboard
 useEffect(() => {
 if (user && user.role === 'admin') {
 navigate('/admin-dashboard');
 }
 }, [user, navigate]);

 const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

 const handleSubmit = async (e) => {
 e.preventDefault();
 setError('');
 setLoading(true);
 try {
 // First clear any existing session
 logout();

 const res = await login(form);
 console.log('Admin Login Response:', res);

 if (res.success) {
 const loggedInUser = res.user;
 console.log('Logged in user role:', loggedInUser?.role);

 if (loggedInUser && loggedInUser.role === 'admin') {
 navigate('/admin-dashboard');
 } else {
 setError(`Access Denied: Administrator privileges required. Your current role is: ${loggedInUser?.role || 'none'}`);
 logout(); // Don't keep non-admin session on admin login page
 }
 }
 } catch (err) {
      console.error('Submission error:', err);
      const message = err.response?.data?.message || err.message || 'Authentication failed';
      setError(`Critical Error: ${message}. If this persists, please check your internet or if the server is awake.`);
    } finally {
      setLoading(false);
    }
 };

 return (
 <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center px-4 font-['Inter'] admin-theme">
 {/* Background Effects */}
 <div className="fixed inset-0 overflow-hidden pointer-events-none">
 <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 blur-[120px] rounded-full" />
 <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/10 blur-[120px] rounded-full" />
 </div>

 <motion.div
 initial={{ opacity: 0, y: 20 }}
 animate={{ opacity: 1, y: 0 }}
 className="max-w-md w-full relative z-10"
 >
 {/* Logo & Header */}
 <div className="text-center mb-12">
 <motion.div
 initial={{ scale: 0.8 }}
 animate={{ scale: 1 }}
 className="w-20 h-20 bg-blue-600 rounded-none flex items-center justify-center mx-auto mb-8 shadow-2xl border border-blue-500"
 >
 <FiShield className="text-white text-4xl" />
 </motion.div>
 <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tighter mb-2 italic">Admin Central</h1>
 <div className="flex items-center justify-center gap-2 text-blue-600 text-[10px] font-bold uppercase tracking-[0.4em]">
 <FiActivity className="animate-pulse" /> SecureVision Internal Network
 </div>
 </div>

 {/* Glassmorphism Card */}
 <div className="bg-white/70 backdrop-blur-xl p-10 rounded-none border border-slate-200 shadow-2xl shadow-slate-200/50 relative overflow-hidden group">
 <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-50" />

  {error && (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      className="mb-8 p-5 bg-red-50 border border-red-100 text-red-600 text-[10px] font-bold rounded-none flex flex-col gap-2 uppercase tracking-widest leading-relaxed"
    >
      <div className="flex items-center gap-4">
        <FiShield className="text-lg flex-shrink-0" /> {error}
      </div>
      {error.toUpperCase().includes('NETWORK ERROR') && (
        <div className="mt-2 p-2 bg-white/50 border border-red-200 lowercase font-mono opacity-80 break-all">
          Target API: {import.meta.env.VITE_API_URL || '(NOT SET - using local proxy)'}/api/auth/login
        </div>
      )}
    </motion.div>
  )}

 <form onSubmit={handleSubmit} className="space-y-8">
 <div className="space-y-3">
 <label className="text-[10px] font-bold uppercase text-slate-400 tracking-[0.2em] flex items-center gap-2 pl-2">
 <FiShield className="text-blue-600" /> Admin Credentials
 </label>
 <input
 type="email"
 name="email"
 required
 value={form.email}
 onChange={handleChange}
 placeholder="administrator@securevision.com"
 className="w-full px-7 py-5 bg-slate-50 border border-slate-200 rounded-none focus:bg-white focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all text-slate-900 font-medium text-sm placeholder:text-slate-300"
 />
 </div>

 <div className="space-y-3">
 <label className="text-[10px] font-bold uppercase text-slate-400 tracking-[0.2em] flex items-center gap-2 pl-2">
 <FiLock className="text-blue-600" /> Security Key
 </label>
 <div className="relative">
 <input
 type={showPassword ? 'text' : 'password'}
 name="password"
 required
 value={form.password}
 onChange={handleChange}
 placeholder="••••••••••••"
 className="w-full px-7 py-5 bg-slate-50 border border-slate-200 rounded-none focus:bg-white focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all text-slate-900 font-medium text-sm placeholder:text-slate-300"
 />
 <button
 type="button"
 onClick={() => setShowPassword(!showPassword)}
 className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-300 transition-colors"
 >
 {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
 </button>
 </div>
 </div>

 <button
 type="submit"
 disabled={loading}
 className="w-full py-6 bg-[#0A1628]  text-white font-black rounded-2xl flex items-center justify-center gap-4 transition-all uppercase tracking-[0.3em] text-[10px] shadow-xl shadow-slate-200 disabled:opacity-50 disabled:cursor-not-allowed group"
 >
 {loading ? 'Decrypting Access...' : 'Authenticate Admin'}
 <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
 </button>

 <div className="text-center pt-6">
 <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
 New Command Staff? {' '}
 <Link to="/admin/signup" className="text-blue-600 hover:underline">Register Admin</Link>
 </p>
 </div>
 </form>
 </div>

 {/* Footer Info */}
 <div className="mt-12 text-center">
 <p className="text-[10px] text-slate-300 uppercase font-bold tracking-[0.5rem] opacity-50">
 Classified • Level 5 Access Only
 </p>
 </div>
 </motion.div>
 </div>
 );
}
