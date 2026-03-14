import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FiCheckCircle, FiXCircle, FiLoader } from 'react-icons/fi';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

export default function VerifyEmail() {
    const { token } = useParams();
    const [status, setStatus] = useState('verifying'); // verifying, success, error

    useEffect(() => {
        const verifyToken = async () => {
            try {
                const res = await axios.get(`http://localhost:5000/api/auth/verify/${token}`);
                if (res.data.success) {
                    setStatus('success');
                }
            } catch (err) {
                setStatus('error');
            }
        };
        verifyToken();
    }, [token]);

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 pt-32 pb-20">
            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-md w-full bg-white p-12 border border-slate-100 shadow-xl text-center"
            >
                {status === 'verifying' && (
                    <div className="py-10">
                        <FiLoader className="w-16 h-16 text-blue-600 animate-spin mx-auto mb-6" />
                        <h2 className="text-2xl font-black text-slate-900 mb-2">Verifying Account</h2>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Please wait while we validate your link</p>
                    </div>
                )}

                {status === 'success' && (
                    <div className="py-10">
                        <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
                            <FiCheckCircle size={40} />
                        </div>
                        <h2 className="text-2xl font-black text-slate-900 mb-2">Verified!</h2>
                        <p className="text-slate-500 text-sm mb-8 leading-relaxed">
                            Thank you! Your email has been successfully verified. Your account is now fully active.
                        </p>
                        <Link 
                            to="/login"
                            className="w-full inline-block bg-slate-900 text-white py-5 font-black uppercase tracking-widest text-xs transition-all hover:bg-black active:scale-[0.98]"
                        >
                            Log in to Account
                        </Link>
                    </div>
                )}

                {status === 'error' && (
                    <div className="py-10">
                        <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                            <FiXCircle size={40} />
                        </div>
                        <h2 className="text-2xl font-black text-slate-900 mb-2">Validation Failed</h2>
                        <p className="text-slate-500 text-sm mb-8 leading-relaxed">
                            This verification link is invalid or may have expired. Please try signing up again or contact support.
                        </p>
                        <Link 
                            to="/signup"
                            className="w-full inline-block bg-slate-900 text-white py-5 font-black uppercase tracking-widest text-xs transition-all hover:bg-black active:scale-[0.98]"
                        >
                            Return to Signup
                        </Link>
                    </div>
                )}
            </motion.div>
        </div>
    );
}
