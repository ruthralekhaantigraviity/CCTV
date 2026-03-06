import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiStar, FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const staticTestimonials = [
    {
        name: 'James Thompson',
        role: 'Operations Manager',
        company: 'Retail Chain',
        review: 'SecureVision installed cameras across all 5 of our retail locations. The quality is outstanding and the team was incredibly professional. Our theft incidents have dropped by 80% since installation.',
        rating: 5,
    },
    {
        name: 'Sarah Mitchell',
        role: 'Homeowner',
        company: '',
        review: 'I can now watch my home from work on my phone. The installation was clean and fast, and the team explained everything thoroughly. Highly recommended for any homeowner!',
        rating: 5,
    },
    {
        name: 'David Patel',
        role: 'Warehouse Director',
        company: 'LogiCorp Ltd',
        review: 'We needed a large-scale system for our 80,000 sq ft warehouse. SecureVision delivered perfectly on time and within budget. Their remote monitoring service gives us complete peace of mind.',
        rating: 5,
    },
    {
        name: 'Emma Rodriguez',
        role: 'School Principal',
        company: 'Greenfield Academy',
        review: 'Student safety is our top priority. SecureVision created a comprehensive security system for our campus. The team was sensitive to our environment and all work was done during school holidays.',
        rating: 5,
    },
    {
        name: 'Michael Chen',
        role: 'Property Developer',
        company: 'Chen Developments',
        review: 'I use SecureVision across all my construction sites. Their wireless camera solutions are perfect for temporary sites. Reliable, great quality, and excellent ongoing support.',
        rating: 5,
    },
];

export default function TestimonialsSlider() {
    const [current, setCurrent] = useState(0);

    const prev = () => setCurrent((c) => (c - 1 + staticTestimonials.length) % staticTestimonials.length);
    const next = () => setCurrent((c) => (c + 1) % staticTestimonials.length);

    const t = staticTestimonials[current];

    return (
        <section className="py-24" style={{ background: '#060e1a' }}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-14">
                    <p className="text-blue-400 font-semibold uppercase tracking-widest text-sm mb-3">Client Reviews</p>
                    <h2 className="text-4xl sm:text-5xl font-bold text-white">What Our Clients Say</h2>
                </div>

                <div className="relative max-w-3xl mx-auto">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={current}
                            initial={{ opacity: 0, x: 40 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -40 }}
                            transition={{ duration: 0.4 }}
                            className="rounded-2xl p-10 text-center"
                            style={{
                                background: 'rgba(13,36,68,0.6)',
                                border: '1px solid rgba(59,130,246,0.2)',
                                backdropFilter: 'blur(10px)',
                            }}
                        >
                            {/* Stars */}
                            <div className="flex justify-center gap-1 mb-6">
                                {Array.from({ length: t.rating }).map((_, i) => (
                                    <FiStar key={i} className="text-yellow-400 fill-yellow-400 text-xl" style={{ fill: '#facc15' }} />
                                ))}
                            </div>

                            {/* Quote */}
                            <p className="text-gray-200 text-xl leading-relaxed italic mb-8">
                                &ldquo;{t.review}&rdquo;
                            </p>

                            {/* Author */}
                            <div className="flex items-center justify-center gap-4">
                                <div
                                    className="w-14 h-14 rounded-full flex items-center justify-center text-lg font-bold text-white flex-shrink-0"
                                    style={{ background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)' }}
                                >
                                    {t.name.split(' ').map((n) => n[0]).join('')}
                                </div>
                                <div className="text-left">
                                    <p className="text-white font-bold">{t.name}</p>
                                    <p className="text-blue-400 text-sm">{t.role}{t.company ? `, ${t.company}` : ''}</p>
                                </div>
                            </div>
                        </motion.div>
                    </AnimatePresence>

                    {/* Nav buttons */}
                    <div className="flex items-center justify-center gap-4 mt-8">
                        <button
                            onClick={prev}
                            className="w-11 h-11 rounded-full flex items-center justify-center text-gray-400 hover:text-white hover:bg-blue-600 border border-gray-700 hover:border-blue-600 transition-all duration-300"
                        >
                            <FiChevronLeft className="text-xl" />
                        </button>

                        {/* Dots */}
                        <div className="flex gap-2">
                            {staticTestimonials.map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => setCurrent(i)}
                                    className="w-2.5 h-2.5 rounded-full transition-all duration-300"
                                    style={{ background: i === current ? '#3b82f6' : 'rgba(59,130,246,0.3)' }}
                                />
                            ))}
                        </div>

                        <button
                            onClick={next}
                            className="w-11 h-11 rounded-full flex items-center justify-center text-gray-400 hover:text-white hover:bg-blue-600 border border-gray-700 hover:border-blue-600 transition-all duration-300"
                        >
                            <FiChevronRight className="text-xl" />
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}
