import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiLock, FiArrowRight, FiShield, FiEye, FiEyeOff, FiCheck, FiCpu } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';

export default function AdminLoginPage() {
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [form, setForm] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login, user } = useAuth();
    const navigate = useNavigate();

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
            const res = await login(form);
            if (res.success) {
                if (res.user.role === 'admin') {
                    navigate('/admin-dashboard');
                } else {
                    setError(`Access Denied: You have '${res.user.role}' privileges. Administrator level required.`);
                }
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Security Authentication Failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#F0F4F8] flex items-center justify-center px-4 font-['Inter']">
            {/* Background Pattern */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-20">
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#B0C4DE_1px,transparent_1px)] [background-size:32px_32px]" />
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-md w-full relative z-10"
            >
                <div className="text-center mb-10">
                    <div className="w-16 h-16 bg-white  flex items-center justify-center mx-auto mb-6   border border-slate-100">
                        <FiShield className="text-[#4682B4] text-3xl" />
                    </div>
                    <h1 className="text-2xl font-black text-slate-800 uppercase tracking-tighter">Command <span className="text-[#4682B4]">Control</span></h1>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.4rem] mt-2">SecureVision AI Systems</p>
                </div>

                <div className="bg-white p-10    border border-slate-100">
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mb-8 p-4 bg-red-50 border border-red-100 text-red-600 text-[10px] font-bold  uppercase tracking-widest text-center"
                        >
                            {error}
                        </motion.div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase text-slate-500 tracking-widest ml-2 px-1">Network Identity</label>
                            <input
                                type="email"
                                name="email"
                                required
                                value={form.email}
                                onChange={handleChange}
                                placeholder="admin@securevision.com"
                                className="w-full px-6 py-4 bg-slate-50 border border-slate-100  focus:bg-white focus:border-[#B0C4DE] focus:ring-4 focus:ring-blue-100 outline-none transition-all text-sm font-medium"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase text-slate-500 tracking-widest ml-2 px-1">Security Token</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    required
                                    value={form.password}
                                    onChange={handleChange}
                                    placeholder="••••••••••••"
                                    className="w-full px-6 py-4 bg-slate-50 border border-slate-100  focus:bg-white focus:border-[#B0C4DE] focus:ring-4 focus:ring-blue-100 outline-none transition-all text-sm font-medium"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-300 "
                                >
                                    {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center justify-between px-2 pt-2">
                            <button
                                type="button"
                                onClick={() => setRememberMe(!rememberMe)}
                                className="flex items-center gap-3 group text-[10px] font-bold text-slate-400 uppercase tracking-widest"
                            >
                                <div className={`w-5 h-5  border-2 flex items-center justify-center transition-all ${rememberMe ? 'bg-[#4682B4] border-[#4682B4]' : 'border-slate-100 bg-slate-50'}`}>
                                    {rememberMe && <FiCheck className="text-white text-xs" />}
                                </div>
                                Remember Session
                            </button>
                            <button type="button" className="text-[10px] font-bold text-[#4682B4] hover:underline uppercase tracking-widest">Forgot Key?</button>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-5 bg-[#4682B4]  text-white font-black  flex items-center justify-center gap-3   transition-all uppercase tracking-widest text-[10px] disabled:opacity-50"
                        >
                            {loading ? 'Decrypting...' : 'Initiate Lockdown Access'}
                            <FiArrowRight />
                        </button>
                    </form>
                </div>

                <div className="mt-10 flex items-center justify-center gap-2 text-slate-400">
                    <FiCpu className="animate-pulse" />
                    <span className="text-[8px] font-bold uppercase tracking-[0.5rem] opacity-50">Encrypted Secure Line 256-Bit</span>
                </div>
            </motion.div>
        </div>
    );
}
