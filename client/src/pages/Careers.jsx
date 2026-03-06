import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiSend, FiCheckCircle, FiAlertCircle, FiMapPin, FiClock } from 'react-icons/fi';
import axios from 'axios';

const positions = [
    { title: 'CCTV Installation Technician', type: 'Full-time', location: 'New York, NY', desc: 'Install and configure CCTV systems for residential and commercial clients.' },
    { title: 'Security Systems Engineer', type: 'Full-time', location: 'New York, NY', desc: 'Design enterprise-grade security systems and manage complex installations.' },
    { title: 'Remote Monitoring Operator', type: 'Full-time / Shift', location: 'Remote / On-site', desc: 'Monitor client camera feeds 24/7 and respond to security alerts.' },
    { title: 'Sales Consultant', type: 'Full-time', location: 'New York, NY', desc: 'Conduct site surveys and convert leads into clients with tailored security proposals.' },
];

export default function Careers() {
    const [form, setForm] = useState({ name: '', email: '', phone: '', position: '', experience: '', coverLetter: '' });
    const [status, setStatus] = useState({ type: '', message: '' });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setStatus({ type: '', message: '' });
        try {
            const res = await axios.post('/api/careers', form);
            setStatus({ type: 'success', message: res.data.message || 'Application submitted! We will review it shortly.' });
            setForm({ name: '', email: '', phone: '', position: '', experience: '', coverLetter: '' });
        } catch (err) {
            setStatus({ type: 'error', message: err.response?.data?.message || 'Submission failed. Please try again.' });
        } finally {
            setLoading(false);
        }
    };

    const inputStyle = { background: 'var(--bg-primary)', border: '1px solid var(--border)', color: 'var(--text-primary)' };

    return (
        <>
            {/* Hero */}
            <section className="pt-36 pb-16 relative overflow-hidden" style={{ background: 'var(--hero-gradient)' }}>
                <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'linear-gradient(var(--grid-line) 1px, transparent 1px), linear-gradient(90deg, var(--grid-line) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <p className="text-blue-500 font-semibold uppercase tracking-widest text-sm mb-3">Join The Team</p>
                    <h1 className="text-5xl font-extrabold mb-5" style={{ color: 'var(--text-primary)' }}>Careers at SecureVision</h1>
                    <p className="text-xl max-w-2xl mx-auto" style={{ color: 'var(--text-muted)' }}>We're always looking for talented security professionals. Explore our open positions below.</p>
                </div>
            </section>

            {/* Content */}
            <section className="py-16" style={{ background: 'var(--bg-primary)' }}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl font-bold mb-8" style={{ color: 'var(--text-primary)' }}>Open Positions</h2>
                    <div className="grid sm:grid-cols-2 gap-6 mb-16">
                        {positions.map((pos, i) => (
                            <motion.div key={pos.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                                className="p-6" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                                <div className="flex items-start justify-between mb-3">
                                    <h3 className="font-bold text-lg" style={{ color: 'var(--text-primary)' }}>{pos.title}</h3>
                                    <span className="text-xs font-semibold px-3 py-1" style={{ background: 'rgba(59,130,246,0.15)', color: '#60a5fa' }}>{pos.type}</span>
                                </div>
                                <div className="flex flex-wrap gap-3 text-sm mb-3" style={{ color: 'var(--text-muted)' }}>
                                    <span className="flex items-center gap-1"><FiMapPin className="text-blue-500" /> {pos.location}</span>
                                    <span className="flex items-center gap-1"><FiClock className="text-blue-500" /> Immediate Start</span>
                                </div>
                                <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{pos.desc}</p>
                            </motion.div>
                        ))}
                    </div>

                    {/* Application Form */}
                    <div className="max-w-3xl mx-auto">
                        <h2 className="text-3xl font-bold mb-6" style={{ color: 'var(--text-primary)' }}>Apply Now</h2>
                        <div className="p-8" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                            {status.message && (
                                <div className={`flex items-center gap-3 p-4 mb-6 ${status.type === 'success' ? 'bg-green-500/10 border border-green-500/30' : 'bg-red-500/10 border border-red-500/30'}`}>
                                    {status.type === 'success' ? <FiCheckCircle className="text-green-400 text-xl" /> : <FiAlertCircle className="text-red-400 text-xl" />}
                                    <p className={status.type === 'success' ? 'text-green-400' : 'text-red-400'}>{status.message}</p>
                                </div>
                            )}
                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div className="grid sm:grid-cols-2 gap-5">
                                    <div>
                                        <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>Full Name *</label>
                                        <input type="text" name="name" value={form.name} onChange={handleChange} required placeholder="Your full name" className="w-full px-4 py-3 outline-none" style={inputStyle} />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>Email *</label>
                                        <input type="email" name="email" value={form.email} onChange={handleChange} required placeholder="your@email.com" className="w-full px-4 py-3 outline-none" style={inputStyle} />
                                    </div>
                                </div>
                                <div className="grid sm:grid-cols-2 gap-5">
                                    <div>
                                        <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>Phone *</label>
                                        <input type="tel" name="phone" value={form.phone} onChange={handleChange} required placeholder="+1 (555) 000-0000" className="w-full px-4 py-3 outline-none" style={inputStyle} />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>Position Applying For *</label>
                                        <select name="position" value={form.position} onChange={handleChange} required className="w-full px-4 py-3 outline-none" style={inputStyle}>
                                            <option value="">Select position...</option>
                                            {positions.map(p => <option key={p.title} value={p.title}>{p.title}</option>)}
                                            <option value="Other">Other / General Application</option>
                                        </select>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>Years of Experience *</label>
                                    <select name="experience" value={form.experience} onChange={handleChange} required className="w-full px-4 py-3 outline-none" style={inputStyle}>
                                        <option value="">Select experience level...</option>
                                        <option value="0-1 years">0–1 years (Entry Level)</option>
                                        <option value="2-4 years">2–4 years</option>
                                        <option value="5-9 years">5–9 years</option>
                                        <option value="10+ years">10+ years (Senior)</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>Cover Letter / Why Join Us? *</label>
                                    <textarea name="coverLetter" value={form.coverLetter} onChange={handleChange} required rows={5}
                                        placeholder="Tell us about yourself and your relevant experience..."
                                        className="w-full px-4 py-3 outline-none resize-none" style={inputStyle} />
                                </div>
                                <button type="submit" disabled={loading} className="btn-primary w-full justify-center text-base py-4 !rounded-none">
                                    {loading ? 'Submitting...' : <><FiSend /> Submit Application</>}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
