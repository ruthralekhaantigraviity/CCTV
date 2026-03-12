import { motion } from 'framer-motion';
import TestimonialsSlider from '../components/TestimonialsSlider';
import CTABanner from '../components/CTABanner';
import { FiStar } from 'react-icons/fi';

const allTestimonials = [
    { name: 'James Thompson', role: 'Operations Manager', company: 'Retail Chain', review: 'SecureVision installed cameras across all 5 of our retail locations. The quality is outstanding and the team was incredibly professional. Our theft incidents have dropped by 80% since installation.', rating: 5 },
    { name: 'Sarah Mitchell', role: 'Homeowner', company: '', review: 'I can now watch my home from work on my phone. The installation was clean and fast, and the team explained everything thoroughly. Highly recommended for any homeowner!', rating: 5 },
    { name: 'David Patel', role: 'Warehouse Director', company: 'LogiCorp Ltd', review: 'We needed a large-scale system for our 80,000 sq ft warehouse. SecureVision delivered perfectly on time and within budget. The remote monitoring service gives us complete peace of mind.', rating: 5 },
    { name: 'Emma Rodriguez', role: 'School Principal', company: 'Greenfield Academy', review: 'Student safety is our top priority. SecureVision created a comprehensive security system for our campus. All work was done during school holidays with minimal disruption.', rating: 5 },
    { name: 'Michael Chen', role: 'Property Developer', company: 'Chen Developments', review: 'I use SecureVision across all my construction sites. Their wireless camera solutions are perfect for temporary sites. Reliable, great quality, and excellent ongoing support.', rating: 5 },
    { name: 'Lisa Harrington', role: 'Restaurant Owner', company: 'The Brasserie', review: 'After a break-in, SecureVision transformed our security setup completely. The new HD cameras and 24/7 monitoring means we never have to worry again. Brilliant service!', rating: 5 },
];

export default function TestimonialsPage() {
    return (
        <>
            <section className="pt-36 pb-16 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #060e1a, #0a1628)' }}>
                <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'linear-gradient(rgba(59,130,246,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.5) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <p className="text-blue-400 font-semibold uppercase tracking-widest text-sm mb-3">Client Reviews</p>
                    <h1 className="text-5xl font-extrabold text-white mb-5">What Our Clients Say</h1>
                    <p className="text-gray-400 text-xl max-w-2xl mx-auto">Don't take our word for it — here's what our 500+ clients say about SecureVision.</p>
                </div>
            </section>

            <TestimonialsSlider />

            {/* All testimonials grid */}
            <section className="pb-20" style={{ background: '#060e1a' }}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl font-bold text-white text-center mb-10">All Client Reviews</h2>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {allTestimonials.map((t, i) => (
                            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }} className="rounded-2xl p-6" style={{ background: 'rgba(13,36,68,0.5)', border: '1px solid rgba(59,130,246,0.15)' }}>
                                <div className="flex gap-0.5 mb-4">
                                    {Array.from({ length: t.rating }).map((_, j) => <FiStar key={j} style={{ fill: '#facc15', color: '#facc15' }} />)}
                                </div>
                                <p className="text-gray-300 text-sm leading-relaxed italic mb-5">&ldquo;{t.review}&rdquo;</p>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0" style={{ background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)' }}>
                                        {t.name.split(' ').map(n => n[0]).join('')}
                                    </div>
                                    <div>
                                        <p className="text-white font-semibold text-sm">{t.name}</p>
                                        <p className="text-blue-400 text-xs">{t.role}{t.company ? `, ${t.company}` : ''}</p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            <CTABanner />
        </>
    );
}
