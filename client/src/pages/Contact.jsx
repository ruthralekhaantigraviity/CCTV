import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { FiSend, FiPhone, FiMail, FiMapPin, FiClock, FiAlertCircle, FiCheckCircle } from 'react-icons/fi';
import axios from 'axios';

const contactItems = [
    { icon: FiPhone, title: 'Phone', lines: ['+1 (800) 123-4567', '+1 (800) 999-9911 (Emergency)'] },
    { icon: FiMail, title: 'Email', lines: ['info@securevision.com', 'support@securevision.com'] },
    { icon: FiMapPin, title: 'Address', lines: ['123 Security Avenue', 'Tech District, NY 10001'] },
    { icon: FiClock, title: 'Business Hours', lines: ['Mon–Fri: 8am – 6pm', 'Sat: 9am – 4pm | Sun: Closed'] },
];

const services = ['CCTV Installation', 'CCTV Maintenance', 'Remote Monitoring', 'Wireless Camera Setup', 'Commercial Security Systems', 'Home Security Cameras', 'Security Assessment', 'Other'];

export default function Contact() {
    const location = useLocation();
    const [form, setForm] = useState({ name: '', email: '', phone: '', service: '', message: '' });
    const [status, setStatus] = useState({ type: '', message: '' });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (location.state?.prefilledService) {
            setForm(prev => ({ ...prev, service: location.state.prefilledService }));
        }
    }, [location]);

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setStatus({ type: '', message: '' });
        try {
            const res = await axios.post('/api/contact', form);
            setStatus({ type: 'success', message: res.data.message || 'Message sent! We will be in touch within 24 hours.' });
            setForm({ name: '', email: '', phone: '', service: '', message: '' });
        } catch (err) {
            setStatus({ type: 'error', message: err.response?.data?.message || 'Something went wrong. Please try again or call us directly.' });
        } finally {
            setLoading(false);
        }
    };

    const inputStyle = {
        background: 'var(--bg-primary)',
        border: '1px solid var(--border)',
        color: 'var(--text-primary)',
    };

    return (
        <>
            {/* Hero */}
            <section className="pt-36 pb-16 relative overflow-hidden" style={{ background: 'var(--hero-gradient)' }}>
                <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'linear-gradient(var(--grid-line) 1px, transparent 1px), linear-gradient(90deg, var(--grid-line) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <p className="text-blue-500 font-semibold uppercase tracking-widest text-sm mb-3">Get In Touch</p>
                    <h1 className="text-5xl font-extrabold mb-5" style={{ color: 'var(--text-primary)' }}>Contact SecureVision</h1>
                    <p className="text-xl max-w-2xl mx-auto" style={{ color: 'var(--text-muted)' }}>
                        Ready to secure your property? Fill out the form below for a free consultation, or call us directly.
                    </p>
                </div>
            </section>

            <section className="py-16" style={{ background: 'var(--bg-primary)' }}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-3 gap-10">
                        {/* Contact Info */}
                        <div className="space-y-6">
                            {contactItems.map((item) => {
                                const Icon = item.icon;
                                return (
                                    <motion.div key={item.title} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
                                        className="flex gap-4 p-5" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                                        <div className="w-11 h-11 bg-blue-600/15 border border-blue-600/30 rounded-lg flex items-center justify-center flex-shrink-0">
                                            <Icon className="text-blue-500 text-lg" />
                                        </div>
                                        <div>
                                            <p className="font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>{item.title}</p>
                                            {item.lines.map((l, i) => <p key={i} className="text-sm" style={{ color: 'var(--text-muted)' }}>{l}</p>)}
                                        </div>
                                    </motion.div>
                                );
                            })}

                            {/* Emergency */}
                            <div className="p-5" style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)' }}>
                                <div className="flex items-center gap-2 mb-2">
                                    <FiAlertCircle className="text-red-400 text-lg" />
                                    <span className="text-red-400 font-bold">24/7 Emergency Line</span>
                                </div>
                                <p className="text-sm mb-2" style={{ color: 'var(--text-muted)' }}>Experiencing a security emergency?</p>
                                <a href="tel:+18009999911" className="text-red-400 font-bold text-lg hover:text-red-300 transition-colors">+1 (800) 999-9911</a>
                            </div>
                        </div>

                        {/* Contact Form */}
                        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                            className="lg:col-span-2 p-8" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                            <h2 className="text-2xl font-bold mb-6" style={{ color: 'var(--text-primary)' }}>Send Us a Message</h2>

                            {status.message && (
                                <div className={`flex items-center gap-3 p-4 mb-6 ${status.type === 'success' ? 'bg-green-500/10 border border-green-500/30' : 'bg-red-500/10 border border-red-500/30'}`}>
                                    {status.type === 'success' ? <FiCheckCircle className="text-green-400 text-xl flex-shrink-0" /> : <FiAlertCircle className="text-red-400 text-xl flex-shrink-0" />}
                                    <p className={status.type === 'success' ? 'text-green-400' : 'text-red-400'}>{status.message}</p>
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div className="grid sm:grid-cols-2 gap-5">
                                    <div>
                                        <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>Full Name *</label>
                                        <input type="text" name="name" value={form.name} onChange={handleChange} required placeholder="John Smith"
                                            className="w-full px-4 py-3 outline-none focus:border-blue-500 transition-colors"
                                            style={inputStyle} />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>Email Address *</label>
                                        <input type="email" name="email" value={form.email} onChange={handleChange} required placeholder="john@example.com"
                                            className="w-full px-4 py-3 outline-none focus:border-blue-500 transition-colors"
                                            style={inputStyle} />
                                    </div>
                                </div>
                                <div className="grid sm:grid-cols-2 gap-5">
                                    <div>
                                        <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>Phone Number *</label>
                                        <input type="tel" name="phone" value={form.phone} onChange={handleChange} required placeholder="+1 (555) 000-0000"
                                            className="w-full px-4 py-3 outline-none focus:border-blue-500 transition-colors"
                                            style={inputStyle} />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>Service Needed *</label>
                                        <select name="service" value={form.service} onChange={handleChange} required
                                            className="w-full px-4 py-3 outline-none focus:border-blue-500 transition-colors"
                                            style={inputStyle}>
                                            <option value="">Select a service...</option>
                                            {services.map(s => <option key={s} value={s}>{s}</option>)}
                                        </select>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>Message *</label>
                                    <textarea name="message" value={form.message} onChange={handleChange} required rows={5}
                                        placeholder="Tell us about your security needs..."
                                        className="w-full px-4 py-3 outline-none focus:border-blue-500 transition-colors resize-none"
                                        style={inputStyle} />
                                </div>
                                <button type="submit" disabled={loading} className="btn-primary w-full justify-center text-base py-4 !rounded-none">
                                    {loading ? 'Sending...' : <><FiSend /> Send Message</>}
                                </button>
                            </form>
                        </motion.div>
                    </div>

                    {/* Map */}
                    <div className="mt-12 overflow-hidden" style={{ border: '1px solid var(--border)' }}>
                        <iframe
                            title="SecureVision Office Location"
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.215270541939!2d-73.9856644!3d40.7484405!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c259ae15b2adcb%3A0x7955420634fd7eba!2sEmpire%20State%20Building!5e0!3m2!1sen!2sus!4v1648000000000!5m2!1sen!2sus"
                            width="100%" height="350" style={{ border: 0 }} allowFullScreen loading="lazy"
                        />
                    </div>
                </div>
            </section>
        </>
    );
}
