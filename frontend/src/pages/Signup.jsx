import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiUser, FiMail, FiPhone, FiLock, FiArrowRight, FiShield, FiCheck } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';

export default function Signup() {
    const [form, setForm] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: ''
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
            const res = await register(form);
            if (res.success) {
                const params = new URLSearchParams(window.location.search);
                const redirect = params.get('redirect');
                navigate(redirect || '/dashboard');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen pt-24 pb-20 bg-gray-50 flex items-center justify-center px-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-2xl w-full grid md:grid-cols-5 bg-white rounded-[2.5rem] overflow-hidden shadow-2xl shadow-gray-200 border border-gray-100"
            >
                {/* Left Side: Branding */}
                <div className="md:col-span-2 bg-[#0F1111] p-10 flex flex-col justify-between text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/20 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2" />

                    <div>
                        <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mb-6">
                            <FiShield className="text-2xl" />
                        </div>
                        <h2 className="text-3xl font-black uppercase tracking-tighter leading-none mb-4">Join the Network</h2>
                        <p className="text-gray-400 text-sm leading-relaxed">Secure your world with our enterprise-grade surveillance solutions.</p>
                    </div>

                    <div className="space-y-4">
                        {[
                            'Real-time Monitoring',
                            'Cloud Backups',
                            'Priority Support',
                            'Smart AI Alerts'
                        ].map((item) => (
                            <div key={item} className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-300">
                                <div className="w-4 h-4 bg-green-500/20 rounded-full flex items-center justify-center">
                                    <FiCheck className="text-green-500" />
                                </div>
                                {item}
                            </div>
                        ))}
                    </div>

                    <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">
                        SECUREVISION V2.0.4
                    </div>
                </div>

                {/* Right Side: Form */}
                <div className="md:col-span-3 p-8 md:p-12">
                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 text-sm font-bold rounded-xl flex items-center gap-3">
                            <FiShield className="flex-shrink-0" /> {error}
                        </div>
                    )}
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-1">
                            <h3 className="text-2xl font-black text-gray-900 uppercase tracking-tighter">Create Account</h3>
                            <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Start your 14-day free trial</p>
                        </div>

                        <div className="grid grid-cols-1 gap-4 pt-4">
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest flex items-center gap-2">
                                    <FiUser /> Full Name
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    required
                                    value={form.name}
                                    onChange={handleChange}
                                    placeholder="John Doe"
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest flex items-center gap-2">
                                        <FiMail /> Email
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        required
                                        value={form.email}
                                        onChange={handleChange}
                                        placeholder="john@work.com"
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest flex items-center gap-2">
                                        <FiPhone /> Phone
                                    </label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        required
                                        value={form.phone}
                                        onChange={handleChange}
                                        placeholder="+1 234..."
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest flex items-center gap-2">
                                        <FiLock /> Password
                                    </label>
                                    <input
                                        type="password"
                                        name="password"
                                        required
                                        value={form.password}
                                        onChange={handleChange}
                                        placeholder="••••••••"
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest flex items-center gap-2">
                                        <FiLock /> Confirm
                                    </label>
                                    <input
                                        type="password"
                                        name="confirmPassword"
                                        required
                                        value={form.confirmPassword}
                                        onChange={handleChange}
                                        placeholder="••••••••"
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm"
                                    />
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full py-4 bg-[#0F1111] text-white font-black rounded-xl flex items-center justify-center gap-3 transition-all uppercase tracking-widest text-xs mt-4 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                        >
                            {loading ? 'Creating Account...' : 'Get Started'} <FiArrowRight />
                        </button>

                        <p className="text-center text-[10px] text-gray-400 mt-6 uppercase font-bold tracking-widest">
                            By joining, you agree to our Terms and Data Policy.
                        </p>

                        <div className="pt-4 text-center">
                            <p className="text-xs text-gray-500">
                                Already member? {' '}
                                <Link to="/login" className="text-blue-600 font-bold hover:underline">Sign In</Link>
                            </p>
                        </div>
                    </form>
                </div>
            </motion.div>
        </div>
    );
}
