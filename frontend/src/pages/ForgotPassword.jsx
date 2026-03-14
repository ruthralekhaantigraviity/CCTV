import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiMail, FiArrowLeft, FiCheckCircle } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [isSent, setIsSent] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await axios.post('http://localhost:5000/api/auth/forgotpassword', { email });
            if (res.data.success) {
                setIsSent(true);
                toast.success('Reset link sent to your email');
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
                {!isSent ? (
                    <>
                        <div className="mb-8">
                            <h1 className="text-3xl font-black text-slate-900 tracking-tighter mb-2">Forgot Password?</h1>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Enter your email to receive a reset link</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest flex items-center gap-2">
                                    <FiMail /> EMAIL ADDRESS
                                </label>
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Enter your registered email"
                                    className="w-full px-5 py-4 bg-slate-50 border border-slate-100 font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all placeholder:text-slate-300"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-slate-900 text-white py-5 font-black uppercase tracking-widest text-xs transition-all hover:bg-black active:scale-[0.98] disabled:opacity-50"
                            >
                                {loading ? 'Sending...' : 'Send Reset Link'}
                            </button>
                        </form>
                    </>
                ) : (
                    <div className="text-center py-6">
                        <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
                            <FiCheckCircle size={40} />
                        </div>
                        <h2 className="text-2xl font-black text-slate-900 mb-2">Check Your Email</h2>
                        <p className="text-slate-500 text-sm mb-8 leading-relaxed">
                            We've sent a password reset link to <span className="font-bold text-slate-900">{email}</span>. Please check your inbox and spam folder.
                        </p>
                        <button 
                            onClick={() => setIsSent(false)}
                            className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-colors"
                        >
                            Didn't receive? Try again
                        </button>
                    </div>
                )}

                <div className="mt-8 pt-6 border-t border-slate-50">
                    <Link 
                        to="/login" 
                        className="flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-colors"
                    >
                        <FiArrowLeft /> Back to Login
                    </Link>
                </div>
            </motion.div>
        </div>
    );
}
