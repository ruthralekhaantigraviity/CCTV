import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiCalendar, FiClock, FiUser, FiPhone, FiMail, FiMapPin, FiCheckCircle, FiShield, FiArrowRight } from 'react-icons/fi';
import CTABanner from '../components/CTABanner';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

export default function BookTechnician() {
    const { user } = useAuth();
    const [step, setStep] = useState(1);
    const [form, setForm] = useState({
        name: '',
        email: '',
        phone: '',
        address: '',
        date: '',
        timeSlot: '',
        serviceType: 'CCTV Installation',
        message: ''
    });

    const [submitted, setSubmitted] = useState(false);

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('/api/jobs', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    customerName: form.name,
                    customerPhone: form.phone,
                    customerAddress: form.address,
                    serviceType: form.serviceType,
                    date: form.date,
                    timeSlot: form.timeSlot,
                    problemDescription: form.message
                })
            });
            const data = await response.json();
            if (data.success) {
                setSubmitted(true);
            } else {
                toast.error(data.message || 'Failed to book slot. Please try again.', {
                    style: { borderRadius: '0', background: '#333', color: '#fff' }
                });
            }
        } catch (error) {
            console.error('Booking error:', error);
            toast.error('A network error occurred. Please try again.', {
                style: { borderRadius: '0', background: '#333', color: '#fff' }
            });
        }
    };

    if (submitted) {
        return (
            <div className="pt-32 pb-20 min-h-screen bg-white flex items-center justify-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="max-w-md w-full text-center px-6"
                >
                    <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                        <FiCheckCircle size={48} />
                    </div>
                    <h1 className="text-3xl font-black text-gray-900 mb-4">Slot Booked!</h1>
                    <p className="text-gray-600 mb-8 text-lg">
                        Hi {form.name}, your request for <strong>{form.serviceType}</strong> on <strong>{form.date}</strong> at <strong>{form.timeSlot}</strong> has been received. Our technician will call you shortly to confirm.
                    </p>
                    <button
                        onClick={() => window.location.href = '/'}
                        className="w-full py-4 bg-white border border-gray-200 text-gray-700 font-bold rounded-none hover:bg-gray-50 transition-all"
                    >
                        Return to Home
                    </button>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="pt-24 min-h-screen bg-gray-50 pb-20">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

                <div className="text-center mb-12">
                    <p className="text-blue-600 font-bold uppercase tracking-widest text-xs mb-3">Professional Service</p>
                    <h1 className="text-[36px] font-black text-gray-900 mb-4 uppercase tracking-tighter">Book a Technician</h1>
                    <p className="text-gray-500 max-w-2xl mx-auto text-lg">
                        Schedule a certified SecureVision expert for your installation, maintenance, or security assessment.
                    </p>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">

                    {/* Left: Progress/Info */}
                    <div className="space-y-6">
                        <div className="bg-white p-6 border border-gray-100 shadow-sm rounded-2xl">
                            <h3 className="font-bold text-gray-900 mb-6 border-b pb-4 flex items-center gap-2">
                                <FiShield className="text-blue-600" /> Why SecureVision?
                            </h3>
                            <div className="space-y-4">
                                {[
                                    { t: 'Certified Experts', d: 'All technicians are backgrounds-verified & trained.' },
                                    { t: 'Punctual Service', d: 'We value your time. If we are late, you get a discount.' },
                                    { t: 'Post-Install Support', d: 'Get 30 days of free technical assistance.' }
                                ].map((item, i) => (
                                    <div key={i} className="flex gap-3">
                                        <FiCheckCircle className="text-green-500 mt-1 flex-shrink-0" />
                                        <div>
                                            <p className="text-sm font-bold text-gray-900">{item.t}</p>
                                            <p className="text-xs text-gray-500 mt-1">{item.d}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="p-6 bg-red-50 border border-red-100 rounded-2xl shadow-sm transition-all hover:shadow-md group">
                            <p className="text-[10px] uppercase tracking-widest mb-1 text-red-500 font-bold opacity-80">24/7 Helpline</p>
                            <p className="text-2xl font-black mb-4 text-red-600">+1 800 123 4567</p>
                            <p className="text-sm text-red-700/80 font-medium leading-relaxed">Call us directly if you need emergency support or have specific technical queries.</p>
                        </div>
                    </div>

                    {/* Right: Booking Form */}
                    <div className="lg:col-span-2">
                        <div className="bg-white p-8 md:p-10 border border-gray-100 shadow-xl rounded-3xl">
                            <form onSubmit={handleSubmit} className="space-y-6">

                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-black uppercase text-gray-400 flex items-center gap-2">
                                            <FiUser /> Full Name
                                        </label>
                                        <input
                                            type="text"
                                            name="name"
                                            required
                                            value={form.name}
                                            onChange={handleChange}
                                            placeholder="Jane Cooper"
                                            className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-black uppercase text-gray-400 flex items-center gap-2">
                                            <FiPhone /> Phone Number
                                        </label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            required
                                            value={form.phone}
                                            onChange={handleChange}
                                            placeholder="+91 00000 00000"
                                            className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase text-gray-400 flex items-center gap-2">
                                        <FiMapPin /> Visit Address
                                    </label>
                                    <textarea
                                        name="address"
                                        required
                                        rows={2}
                                        value={form.address}
                                        onChange={handleChange}
                                        placeholder="Enter your full installation address..."
                                        className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none"
                                    />
                                </div>

                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-black uppercase text-gray-400 flex items-center gap-2">
                                            <FiCalendar /> Preferred Date
                                        </label>
                                        <input
                                            type="date"
                                            name="date"
                                            required
                                            value={form.date}
                                            onChange={handleChange}
                                            className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-black uppercase text-gray-400 flex items-center gap-2">
                                            <FiClock /> Time Slot
                                        </label>
                                        <select
                                            name="timeSlot"
                                            required
                                            value={form.timeSlot}
                                            onChange={handleChange}
                                            className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all cursor-pointer appearance-none"
                                        >
                                            <option value="">Select a slot...</option>
                                            <option value="Morning (9 AM - 12 PM)">Morning (9 AM - 12 PM)</option>
                                            <option value="Afternoon (12 PM - 3 PM)">Afternoon (12 PM - 3 PM)</option>
                                            <option value="Evening (3 PM - 6 PM)">Evening (3 PM - 6 PM)</option>
                                        </select>
                                    </div>
                                </div>


                                <div className="pt-6">
                                    {user ? (
                                        <button
                                            type="submit"
                                            className="w-full py-5 bg-white border border-gray-200 text-gray-800 font-black rounded-none flex items-center justify-center gap-3 transition-all hover:bg-gray-50 hover:border-gray-300 uppercase tracking-widest text-sm"
                                        >
                                            Confirm Booking <FiArrowRight />
                                        </button>
                                    ) : (
                                        <div className="space-y-4">
                                            <div className="p-4 bg-blue-50 border border-blue-100 rounded-none text-center">
                                                <p className="text-xs font-bold text-blue-800 uppercase tracking-widest leading-loose">
                                                    Authentication Required to Confirm Slot
                                                </p>
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <Link 
                                                    to="/login?redirect=/book-technician"
                                                    className="py-4 bg-slate-900 text-white text-center font-black uppercase tracking-widest text-[10px] hover:bg-black transition-all"
                                                >
                                                    Sign In
                                                </Link>
                                                <Link 
                                                    to="/signup?redirect=/book-technician"
                                                    className="py-4 bg-white border border-slate-900 text-slate-900 text-center font-black uppercase tracking-widest text-[10px] hover:bg-slate-50 transition-all"
                                                >
                                                    Register
                                                </Link>
                                            </div>
                                        </div>
                                    )}
                                    <p className="text-center text-[10px] text-gray-400 mt-4 uppercase font-bold tracking-widest">No upfront payment required for slot booking</p>
                                </div>

                            </form>
                        </div>
                    </div>
                </div>
            </div>
            <CTABanner />
        </div>
    );
}
