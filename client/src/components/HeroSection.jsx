import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiShield, FiPhone, FiArrowRight } from 'react-icons/fi';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-fade';

export default function HeroSection() {
    return (
        <section className="relative min-h-[85vh] flex items-center overflow-hidden bg-[#060e1a]">
            {/* Full Screen Image Slider Background */}
            <div className="absolute inset-0 z-0">
                <Swiper
                    modules={[Autoplay, EffectFade]}
                    effect="fade"
                    autoplay={{ delay: 4000, disableOnInteraction: false }}
                    loop={true}
                    className="w-full h-full"
                    allowTouchMove={false} // Prevent user dragging background
                >
                    {[
                        '/slider1.png',
                        '/slider2.png',
                        '/slider3.png'
                    ].map((src, idx) => (
                        <SwiperSlide key={idx}>
                            <div className="w-full h-full">
                                <img src={src} alt="Security Background" className="w-full h-full object-cover opacity-60" />
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>

                {/* Gradient for text readability */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#060e1a]/80 via-[#060e1a]/60 to-transparent"></div>
            </div>

            {/* Grid overlay */}
            <div className="absolute inset-0 opacity-10 z-1 pointer-events-none" style={{ backgroundImage: 'linear-gradient(var(--grid-line) 1px, transparent 1px), linear-gradient(90deg, var(--grid-line) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
            {/* Glow */}
            <div className="absolute top-1/4 right-1/4 w-96 h-96 rounded-full blur-[120px] z-1 pointer-events-none" style={{ background: 'var(--glow-1)' }} />
            <div className="absolute bottom-1/4 left-1/4 w-64 h-64 rounded-full blur-[100px] z-1 pointer-events-none" style={{ background: 'var(--glow-2)' }} />

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20 w-full z-10">
                <div className="flex flex-col items-start text-left max-w-3xl">

                    {/* Badge */}
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
                        className="inline-flex items-center gap-2 mb-8 px-4 py-2 rounded-full text-xs font-medium"
                        style={{ background: 'rgba(59,130,246,0.15)', border: '1px solid rgba(59,130,246,0.3)', color: '#60a5fa' }}
                    >
                        <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                        24/7 Professional Security Monitoring Active
                    </motion.div>

                    {/* Headline */}
                    <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}
                        className="text-4xl sm:text-6xl font-extrabold mb-6 leading-tight text-white"
                    >
                        Advanced CCTV{' '}
                        <span style={{ background: 'linear-gradient(135deg, #3b82f6, #60a5fa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                            Surveillance
                        </span>{' '}
                        You Can Trust
                    </motion.h1>

                    {/* Sub */}
                    <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}
                        className="text-xl mb-8 leading-relaxed max-w-2xl text-gray-300"
                    >
                        Protecting homes and businesses across the region with cutting-edge CCTV technology and intelligent monitoring solutions.
                    </motion.p>

                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }}
                        className="flex flex-wrap gap-6 mb-12 text-sm text-gray-400"
                    >
                        {['24/7 Monitoring', 'Licensed Technicians', 'Smart Security Solutions'].map((item) => (
                            <span key={item} className="flex items-center gap-2">
                                <FiShield className="text-blue-400" /> {item}
                            </span>
                        ))}
                    </motion.div>

                    {/* CTA Buttons */}
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.4 }}
                        className="flex flex-wrap gap-6"
                    >
                        <Link to="/contact" className="btn-primary text-base px-8 py-3.5 !rounded-none">
                            Get Free Quote <FiArrowRight />
                        </Link>
                        <a href="tel:+18001234567"
                            className="flex items-center gap-2 font-semibold px-8 py-3.5 rounded-none transition-all duration-300 text-base text-white"
                            style={{ background: '#16a34a' }}
                            onMouseEnter={e => e.currentTarget.style.background = '#15803d'}
                            onMouseLeave={e => e.currentTarget.style.background = '#16a34a'}
                        >
                            <FiPhone /> Call Now
                        </a>
                    </motion.div>

                    {/* Trust stats */}
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.6 }}
                        className="mt-20 flex flex-wrap gap-12"
                    >
                        {[{ label: '1000+', sub: 'Cameras Installed' }, { label: '500+', sub: 'Happy Clients' }, { label: '10+', sub: 'Years Experience' }, { label: '24/7', sub: 'Support Available' }].map((stat) => (
                            <div key={stat.sub} className="text-center">
                                <div className="text-3xl font-bold text-blue-500">{stat.label}</div>
                                <div className="text-sm" style={{ color: 'var(--text-muted)' }}>{stat.sub}</div>
                            </div>
                        ))}
                    </motion.div>
                </div>
            </div>

            {/* Bottom wave */}
            <div className="absolute bottom-0 left-0 right-0 z-20 pointer-events-none">
                <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M0 40L48 35C96 30 192 20 288 25C384 30 480 50 576 55C672 60 768 50 864 42C960 34 1056 28 1152 30C1248 32 1344 42 1392 47L1440 52V80H0V40Z" fill="#060e1a" />
                </svg>
            </div>
        </section>
    );
}
