import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiCamera, FiTool, FiMonitor, FiWifi, FiShield, FiHome, FiArrowRight } from 'react-icons/fi';
import CTABanner from '../components/CTABanner';

const services = [
    { icon: FiCamera, title: 'CCTV Installation', slug: 'cctv-installation', color: '#3b82f6', desc: 'Professional HD camera installation tailored to your property layout and security needs.' },
    { icon: FiTool, title: 'CCTV Maintenance', slug: 'cctv-maintenance', color: '#06b6d4', desc: 'Annual and quarterly maintenance plans including cleaning, firmware updates, and full system health diagnostics.' },
    { icon: FiMonitor, title: 'Remote Monitoring', slug: 'remote-monitoring', color: '#8b5cf6', desc: '24/7 live surveillance by our professional monitoring team. Incidents detected and responded to in real time.' },
    { icon: FiWifi, title: 'Wireless Camera Setup', slug: 'wireless-camera-setup', color: '#10b981', desc: 'Flexible wireless IP camera installation. No cabling required — ideal for rented spaces and temporary sites.' },
    { icon: FiShield, title: 'Commercial Security Systems', slug: 'commercial-security-systems', color: '#f59e0b', desc: 'Enterprise-grade systems with AI analytics, license plate recognition, and access control integration.' },
    { icon: FiHome, title: 'Home Security Cameras', slug: 'home-security-cameras', color: '#ef4444', desc: 'Smart home CCTV solutions with smartphone monitoring, motion alerts, cloud storage, and smart home integration.' },
];

export default function Services() {
    return (
        <>
            {/* Hero */}
            <section className="pt-36 pb-20 relative overflow-hidden" style={{ background: 'var(--hero-gradient)' }}>
                <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'linear-gradient(var(--grid-line) 1px, transparent 1px), linear-gradient(90deg, var(--grid-line) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-blue-500 font-semibold uppercase tracking-widest text-sm mb-3">What We Do</motion.p>
                    <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-5xl font-extrabold mb-5" style={{ color: 'var(--text-primary)' }}>Our Security Services</motion.h1>
                    <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-xl max-w-2xl mx-auto" style={{ color: 'var(--text-muted)' }}>
                        Comprehensive CCTV solutions for every need, from a single home camera to enterprise-scale commercial systems.
                    </motion.p>
                </div>
            </section>

            {/* Services list */}
            <section className="py-20" style={{ background: 'var(--bg-primary)' }}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
                    {services.map((svc, i) => {
                        const Icon = svc.icon;
                        return (
                            <motion.div
                                key={svc.slug}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.06 }}
                                className="flex flex-col lg:flex-row items-start gap-8 p-8"
                                style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}
                            >
                                <div className="flex-shrink-0 w-16 h-16 flex items-center justify-center" style={{ background: `${svc.color}15`, border: `1px solid ${svc.color}40` }}>
                                    <Icon style={{ color: svc.color, fontSize: '1.8rem' }} />
                                </div>
                                <div className="flex-grow">
                                    <h2 className="text-2xl font-bold mb-3" style={{ color: 'var(--text-primary)' }}>{svc.title}</h2>
                                    <p className="text-lg leading-relaxed mb-5" style={{ color: 'var(--text-muted)' }}>{svc.desc}</p>
                                    <Link to={`/services/${svc.slug}`} className="inline-flex items-center gap-2 font-semibold transition-colors" style={{ color: svc.color }}>
                                        View Full Details <FiArrowRight />
                                    </Link>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </section>

            <CTABanner />
        </>
    );
}
