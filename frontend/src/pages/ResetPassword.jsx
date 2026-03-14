import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiLock, FiCheckCircle } from 'react-icons/fi';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function ResetPassword() {
    const { token } = useParams();
    const navigate = useNavigate();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            return toast.error('Passwords do not match');
        }
        setLoading(true);
        try {
            const res = await axios.put(`http://localhost:5000/api/auth/resetpassword/${token}`, { password });
            if (res.data.success) {
                setIsSuccess(true);
                toast.success('Password reset successful');
            }
        } catch (err) {
            toast.error(err.response?.data?.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 pt-32 pb-20">
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-md w-full bg-white p-10 border border-slate-100 shadow-xl"
            >
                {!isSuccess ? (
                    <>
                        <div className="mb-8">
                            <h1 className="text-3xl font-black text-slate-900 tracking-tighter mb-2">Reset Password</h1>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Enter your new secure password</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest flex items-center gap-2">
                                    <FiLock /> NEW PASSWORD
                                </label>
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full px-5 py-4 bg-slate-50 border border-slate-100 font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all placeholder:text-slate-300"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest flex items-center gap-2">
                                    <FiLock /> CONFIRM PASSWORD
                                </label>
                                <input
                                    type="password"
                                    required
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full px-5 py-4 bg-slate-50 border border-slate-100 font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all placeholder:text-slate-300"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-slate-900 text-white py-5 font-black uppercase tracking-widest text-xs transition-all hover:bg-black active:scale-[0.98] disabled:opacity-50"
                            >
                                {loading ? 'Updating...' : 'Update Password'}
                            </button>
                        </form>
                    </>
                ) : (
                    <div className="text-center py-6">
                        <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
                            <FiCheckCircle size={40} />
                        </div>
                        <h2 className="text-2xl font-black text-slate-900 mb-2">Success!</h2>
                        <p className="text-slate-500 text-sm mb-8 leading-relaxed">
                            Your password has been successfully updated. You can now log in with your new credentials.
                        </p>
                        <Link 
                            to="/login"
                            className="w-full inline-block bg-slate-900 text-white py-5 font-black uppercase tracking-widest text-xs transition-all hover:bg-black active:scale-[0.98]"
                        >
                            Go to Login
                        </Link>
                    </div>
                )}
            </motion.div>
        </div>
    );
}
