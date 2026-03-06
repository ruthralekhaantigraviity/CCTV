import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiMail, FiLock, FiArrowRight, FiShield, FiEye, FiEyeOff } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';

export default function Login() {
    const [showPassword, setShowPassword] = useState(false);
    const [form, setForm] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const res = await login(form);
            if (res.success) {
                navigate('/dashboard');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to login');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen pt-24 pb-20 bg-gray-50 flex items-center justify-center px-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-md w-full"
            >
                {/* Logo & Header */}
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-200">
                        <FiShield className="text-white text-3xl" />
                    </div>
                    <h1 className="text-3xl font-black text-gray-900 uppercase tracking-tighter">Welcome Back</h1>
                    <p className="text-gray-500 mt-2">Access your SecureVision monitoring dashboard</p>
                </div>

                {/* Form Card */}
                <div className="bg-white p-8 md:p-10 rounded-3xl border border-gray-100 shadow-xl shadow-gray-200/50">
                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 text-sm font-bold rounded-2xl flex items-center gap-3">
                            <FiShield className="flex-shrink-0" /> {error}
                        </div>
                    )}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-xs font-black uppercase text-gray-400 tracking-widest flex items-center gap-2">
                                <FiMail /> Email Address
                            </label>
                            <input
                                type="email"
                                name="email"
                                required
                                value={form.email}
                                onChange={handleChange}
                                placeholder="name@company.com"
                                className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                            />
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <label className="text-xs font-black uppercase text-gray-400 tracking-widest flex items-center gap-2">
                                    <FiLock /> Password
                                </label>
                                <Link to="/contact" className="text-[10px] font-bold text-blue-600 uppercase hover:underline">Forgot Password?</Link>
                            </div>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    required
                                    value={form.password}
                                    onChange={handleChange}
                                    placeholder="••••••••"
                                    className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    {showPassword ? <FiEyeOff /> : <FiEye />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full py-5 bg-[#0F1111] text-white font-black rounded-2xl flex items-center justify-center gap-3 hover:bg-gray-800 transition-all hover:scale-[1.01] active:scale-[0.98] shadow-xl shadow-gray-200 uppercase tracking-widest text-sm ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                        >
                            {loading ? 'Authenticating...' : 'Sign In'} <FiArrowRight />
                        </button>
                    </form>

                    <div className="mt-8 pt-6 border-t border-gray-50 text-center">
                        <p className="text-sm text-gray-500">
                            Don't have an account? {' '}
                            <Link to="/signup" className="text-blue-600 font-bold hover:underline">Create Account</Link>
                        </p>
                    </div>
                </div>

                {/* Footer Info */}
                <p className="text-center text-[10px] text-gray-400 mt-8 uppercase font-bold tracking-widest">
                    &copy; 2026 SecureVision Solutions. Authorized personnel only.
                </p>
            </motion.div>
        </div>
    );
}
