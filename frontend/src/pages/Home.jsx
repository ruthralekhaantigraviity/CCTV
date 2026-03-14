import HeroSection from '../components/HeroSection';
import ServicesGrid from '../components/ServicesGrid';
import StatsCounter from '../components/StatsCounter';
import IndustriesGrid from '../components/IndustriesGrid';
import ProductShowcase from '../components/ProductShowcase';
import CTABanner from '../components/CTABanner';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiShield, FiClock, FiAward, FiUsers, FiDollarSign, FiCheckCircle, FiArrowRight } from 'react-icons/fi';

const whyUs = [
    { icon: FiShield, text: 'Licensed & Fully Insured', desc: 'All work carried out by licensed, certified technicians.' },
    { icon: FiClock, text: '24/7 Customer Support', desc: 'Around-the-clock support for all clients, emergency lines available.' },
    { icon: FiAward, text: '10+ Years Experience', desc: 'A decade of delivering high-quality security solutions.' },
    { icon: FiUsers, text: 'Certified Technicians', desc: 'Industry-certified engineers with ongoing training.' },
    { icon: FiDollarSign, text: 'Affordable Pricing', desc: 'Competitive pricing without compromising on quality.' },
];

export default function Home() {
    return (
        <>
            {/* SEO */}
            <title>SecureVision CCTV Solutions – Advanced Surveillance You Can Trust</title>

            {/* Hero */}
            <HeroSection />

            {/* Featured Products */}
            <ProductShowcase />

            {/* Services Overview */}
            <ServicesGrid />

            {/* Why Choose Us */}
            <section className="py-24" style={{ background: 'var(--bg-secondary)' }}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        {/* Left – CCTV Live Feed Visual */}
                        <motion.div
                            initial={{ opacity: 0, x: -40 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="relative"
                        >
                            <div
                                className="w-full aspect-video flex items-center justify-center relative overflow-hidden"
                                style={{ background: 'var(--bg-primary)', border: '1px solid var(--border)' }}
                            >
                                {/* 4-camera grid */}
                                <div className="grid grid-cols-2 w-full h-full" style={{ gap: '2px', background: 'rgba(59,130,246,0.2)' }}>
                                    {[
                                        { label: 'CAM 01 – Front Gate', color: '#22c55e', scene: 'gate' },
                                        { label: 'CAM 02 – Parking Lot', color: '#22c55e', scene: 'parking' },
                                        { label: 'CAM 03 – Main Entrance', color: '#f59e0b', scene: 'entrance' },
                                        { label: 'CAM 04 – Server Room', color: '#22c55e', scene: 'server' },
                                    ].map((cam, i) => (
                                        <div
                                            key={i}
                                            className="relative flex flex-col overflow-hidden"
                                            style={{ background: '#060e1a' }}
                                        >
                                            {/* Scene background gradient unique per camera */}
                                            <div className="absolute inset-0" style={{
                                                background: i === 0 ? 'linear-gradient(160deg,#061018 60%,#0a2010 100%)' :
                                                    i === 1 ? 'linear-gradient(160deg,#06101a 60%,#100a20 100%)' :
                                                        i === 2 ? 'linear-gradient(160deg,#0a0e06 60%,#1a1000 100%)' :
                                                            'linear-gradient(160deg,#060a18 60%,#00081a 100%)'
                                            }} />

                                            {/* Scan-line overlay */}
                                            <div className="absolute inset-0 pointer-events-none" style={{
                                                backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.18) 3px, rgba(0,0,0,0.18) 4px)',
                                                animation: 'none',
                                            }} />

                                            {/* Moving scan beam */}
                                            <div className="absolute left-0 right-0 h-6 pointer-events-none" style={{
                                                background: 'linear-gradient(180deg, transparent, rgba(59,130,246,0.07), transparent)',
                                                animation: `scanBeam ${2.5 + i * 0.7}s linear infinite`,
                                                top: 0,
                                            }} />

                                            {/* Scene silhouettes */}
                                            {cam.scene === 'gate' && (
                                                <div className="absolute bottom-0 left-0 right-0 flex items-end justify-center pb-1 gap-2">
                                                    <div style={{ width: 2, height: 28, background: 'rgba(100,150,100,0.35)', borderRadius: 1 }} />
                                                    <div style={{ width: 14, height: 18, background: 'rgba(80,120,100,0.3)', borderRadius: 1 }} />
                                                    <div style={{ width: 2, height: 28, background: 'rgba(100,150,100,0.35)', borderRadius: 1 }} />
                                                </div>
                                            )}
                                            {cam.scene === 'parking' && (
                                                <div className="absolute bottom-0 left-2 right-2 flex items-end gap-1">
                                                    <div style={{ width: 18, height: 8, background: 'rgba(80,80,150,0.35)', borderRadius: 1 }} />
                                                    <div style={{ width: 22, height: 10, background: 'rgba(100,80,80,0.35)', borderRadius: 1 }} />
                                                    <div style={{ width: 16, height: 8, background: 'rgba(80,100,80,0.35)', borderRadius: 1 }} />
                                                </div>
                                            )}
                                            {cam.scene === 'entrance' && (
                                                <div className="absolute bottom-0 left-0 right-0 flex items-end justify-center gap-1 pb-0">
                                                    <div style={{ width: 30, height: 22, background: 'rgba(120,100,60,0.3)', borderRadius: '2px 2px 0 0' }} />
                                                    <div style={{ width: 8, height: 10, background: 'rgba(100,80,50,0.35)', borderRadius: '1px 1px 0 0' }} />
                                                </div>
                                            )}
                                            {cam.scene === 'server' && (
                                                <div className="absolute inset-2 flex flex-col gap-1 justify-center">
                                                    {[0, 1, 2].map(r => (
                                                        <div key={r} className="flex gap-1 items-center">
                                                            <div style={{ width: '100%', height: 4, background: 'rgba(59,130,246,0.2)', borderRadius: 1 }} />
                                                            <div style={{ width: 4, height: 4, borderRadius: '50%', background: r === 1 ? 'rgba(34,197,94,0.8)' : 'rgba(59,130,246,0.5)', flexShrink: 0 }} />
                                                        </div>
                                                    ))}
                                                </div>
                                            )}

                                            {/* Motion indicator dot */}
                                            {(i === 1 || i === 2) && (
                                                <div className="absolute top-1/2 left-1/3" style={{
                                                    width: 6, height: 6, borderRadius: '50%',
                                                    border: '1px solid rgba(34,197,94,0.8)',
                                                    animation: `motionPing 1.8s ease-in-out infinite`,
                                                }} />
                                            )}

                                            {/* Top bar: cam label + status */}
                                            <div className="relative flex items-center justify-between px-1.5 pt-1" style={{ zIndex: 2 }}>
                                                <span className="text-white font-mono" style={{ fontSize: '5px', letterSpacing: '0.03em', opacity: 0.85 }}>{cam.label}</span>
                                                <span className="flex items-center gap-0.5">
                                                    <span style={{ width: 4, height: 4, borderRadius: '50%', background: cam.color, display: 'inline-block', animation: 'pulse 2s infinite' }} />
                                                    <span className="font-mono" style={{ fontSize: '5px', color: cam.color, opacity: 0.9 }}>LIVE</span>
                                                </span>
                                            </div>

                                            {/* Timestamp bottom */}
                                            <div className="absolute bottom-1 left-1.5 right-1.5 flex justify-between" style={{ zIndex: 2 }}>
                                                <span className="font-mono text-white opacity-60" style={{ fontSize: '4.5px' }}>
                                                    2026-03-04 {String(10 + i).padStart(2, '0')}:47:22
                                                </span>
                                                <span className="font-mono opacity-40 text-white" style={{ fontSize: '4.5px' }}>1080p HD</span>
                                            </div>

                                            {/* Corner brackets */}
                                            {[['top-1 left-1', 'border-t border-l'], ['top-1 right-1', 'border-t border-r'], ['bottom-1 left-1', 'border-b border-l'], ['bottom-1 right-1', 'border-b border-r']].map(([pos, bdr]) => (
                                                <div key={pos} className={`absolute ${pos} ${bdr} w-2 h-2`} style={{ borderColor: 'rgba(59,130,246,0.5)', zIndex: 3 }} />
                                            ))}
                                        </div>
                                    ))}
                                </div>

                                {/* Top bar overlay */}
                                <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-3 py-1.5" style={{ background: 'rgba(6,14,26,0.85)', borderBottom: '1px solid rgba(59,130,246,0.25)', zIndex: 10 }}>
                                    <span className="text-blue-400 font-mono font-bold tracking-widest" style={{ fontSize: '9px' }}>SECUREVISION NVR — LIVE FEED</span>
                                    <div className="flex items-center gap-1.5">
                                        <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                                        <span className="text-red-400 font-mono font-bold" style={{ fontSize: '8px' }}>● REC</span>
                                    </div>
                                </div>
                            </div>

                            {/* Floating badge — sharp */}
                            <div
                                className="absolute -bottom-5 -left-5 px-5 py-3 shadow-xl flex items-center gap-3"
                                style={{ background: '#0d2444', border: '1px solid rgba(59,130,246,0.3)' }}
                            >
                                <FiShield className="text-blue-400 text-2xl" />
                                <div>
                                    <p className="text-white font-bold text-sm">Fully Licensed</p>
                                    <p className="text-gray-400 text-xs">&amp; Insured Operations</p>
                                </div>
                            </div>

                            {/* CSS for scan beam & motion ping */}
                            <style>{`
                                @keyframes scanBeam {
                                    0%   { top: -10%; }
                                    100% { top: 110%; }
                                }
                                @keyframes motionPing {
                                    0%, 100% { transform: scale(1); opacity: 0.8; }
                                    50%       { transform: scale(2.5); opacity: 0; }
                                }
                            `}</style>
                        </motion.div>

                        {/* Right – text */}
                        <motion.div
                            initial={{ opacity: 0, x: 40 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                        >
                            <p className="text-blue-500 font-semibold uppercase tracking-widest text-sm mb-3">Why Choose Us</p>
                            <h2 className="text-4xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
                                Security Experts You Can Rely On
                            </h2>
                            <p className="mb-8 text-lg leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                                With over a decade of experience, SecureVision CCTV Solutions is the trusted choice for professional surveillance installation and monitoring. We combine cutting-edge technology with exceptional customer service.
                            </p>
                            <ul className="space-y-4 mb-8">
                                {whyUs.map((item, i) => {
                                    const Icon = item.icon;
                                    return (
                                        <motion.li
                                            key={item.text}
                                            initial={{ opacity: 0, x: 20 }}
                                            whileInView={{ opacity: 1, x: 0 }}
                                            viewport={{ once: true }}
                                            transition={{ delay: i * 0.08 }}
                                            className="flex items-start gap-4"
                                        >
                                            <div className="w-10 h-10 bg-blue-600/15 border border-blue-600/30 rounded-none flex items-center justify-center flex-shrink-0">
                                                <Icon className="text-blue-400 text-lg" />
                                            </div>
                                            <div>
                                                <p className="font-semibold" style={{ color: 'var(--text-primary)' }}>{item.text}</p>
                                                <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{item.desc}</p>
                                            </div>
                                        </motion.li>
                                    );
                                })}
                            </ul>
                            <Link to="/about" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold transition-colors">
                                Learn More <FiArrowRight className="text-lg" />
                            </Link>
                        </motion.div>
                    </div>
                </div>
            </section>


            {/* Stats */}
            <StatsCounter />

            {/* Industries */}
            <IndustriesGrid />

            {/* CTA */}
            <CTABanner />
        </>
    );
}
