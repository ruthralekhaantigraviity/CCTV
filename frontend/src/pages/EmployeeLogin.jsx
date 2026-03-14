import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiMail, FiLock, FiArrowRight, FiShield, FiEye, FiEyeOff, FiBriefcase } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';

export default function EmployeeLogin() {
    const [showPassword, setShowPassword] = useState(false);
    const [form, setForm] = useState({ credential: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { user, login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const from = location.state?.from || '/employee-dashboard';


    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const res = await login(form);
            if (res.success) {
                const loggedInUser = res.user;
                
                if (loggedInUser.role === 'employee' || loggedInUser.role === 'admin') {
                    let targetPath = from;
    
                    // Ensure correct dashboard based on role if no specific redirect was requested
                    if (from === '/employee-dashboard') {
                        if (loggedInUser.role === 'admin') {
                            targetPath = '/admin-dashboard';
                        }
                    }
    
                    navigate(targetPath, { replace: true });
                } else {
                    setError('Access Denied: This portal is for authorized personnel only. Please use the Client Login.');
                    // Local logout logic
                    setTimeout(() => {
                        localStorage.removeItem('token');
                        window.location.reload();
                    }, 2000);
                }
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Employee authentication failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0a1628] flex items-center justify-center px-4 portal-theme">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-md w-full"
            >
                {/* Logo & Header */}
                <div className="text-center mb-10">
                    <div className="w-20 h-20 bg-blue-600 rounded-none flex items-center justify-center mx-auto mb-6 shadow-2xl ">
                        <FiBriefcase className="text-white text-4xl" />
                    </div>
                    <h1 className="text-2xl font-semibold text-white uppercase tracking-tighter">Operations Portal</h1>
                    <p className="text-blue-400 font-semibold uppercase tracking-widest text-[10px] mt-2">SecureVision Employee Management System</p>
                </div>

                {/* Form Card */}
                <div className="bg-white p-8 md:p-12 rounded-none shadow-2xl overflow-hidden relative">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-none -mr-16 -mt-16 opacity-50" />

                    {error && (
                        <div className="mb-8 p-4 bg-red-50 border border-red-100 text-red-600 text-xs font-semibold rounded-none flex items-center gap-3 uppercase tracking-widest">
                            <FiShield className="flex-shrink-0" /> {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
                        <div className="space-y-3">
                            <label className="text-[10px] font-semibold uppercase text-gray-400 tracking-[0.2em] flex items-center gap-2 pl-2">
                                <FiMail className="text-blue-600" /> Employee ID / Email
                            </label>
                            <input
                                type="text"
                                name="credential"
                                required
                                value={form.credential}
                                onChange={handleChange}
                                placeholder="EMP-101 or email@sv.com"
                                className="w-full px-6 py-5 bg-gray-50 border border-gray-100 rounded-none focus:bg-white focus:ring-2 focus:ring-blue-600 outline-none transition-all font-semibold text-sm"
                            />
                        </div>

                        <div className="space-y-3">
                            <label className="text-[10px] font-semibold uppercase text-gray-400 tracking-[0.2em] flex items-center gap-2 pl-2">
                                <FiLock className="text-blue-600" /> Secure Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    required
                                    value={form.password}
                                    onChange={handleChange}
                                    placeholder="••••••••"
                                    className="w-full px-6 py-5 bg-gray-50 border border-gray-100 rounded-none focus:bg-white focus:ring-2 focus:ring-blue-600 outline-none transition-all font-semibold text-sm"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 transition-colors"
                                >
                                    {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full py-6 bg-[#0a1628] text-white font-semibold rounded-none flex items-center justify-center gap-4 transition-all uppercase tracking-[0.2em] text-xs shadow-xl  ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                        >
                            {loading ? 'Verifying Credentials...' : 'Access Command Centre'} <FiArrowRight />
                        </button>
                    </form>

                    <div className="mt-8 pt-6 border-t border-gray-100 text-center">
                        <p className="text-[10px] text-gray-400 uppercase font-semibold tracking-widest leading-relaxed">
                            Authorized Operations Personnel Only<br/>
                            <span className="text-blue-600/50">Contact Admin for Access</span>
                        </p>
                    </div>
                </div>

                {/* Footer Info */}
                <div className="mt-10 text-center">
                    <p className="text-[10px] text-gray-500 uppercase font-semibold tracking-[0.3em]">
                        System v4.2.0 • Restricted Access
                    </p>
                    <p className="text-[9px] text-gray-600 mt-2 px-8">
                        Unauthorized access attempts are monitored and logged. Please contact IT Support for credential recovery.
                    </p>
                </div>
            </motion.div>
        </div>
    );
}
