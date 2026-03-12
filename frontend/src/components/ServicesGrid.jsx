import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiCamera, FiTool, FiMonitor, FiWifi, FiShield, FiHome, FiArrowRight } from 'react-icons/fi';

const services = [
 {
 icon: FiCamera,
 title: 'CCTV Installation',
 desc: 'Professional HD CCTV camera installation customized for your property layout and security needs.',
 slug: 'cctv-installation',
 color: '#3b82f6',
 img: '/svc1.png',
 },
 {
 icon: FiTool,
 title: 'CCTV Maintenance',
 desc: 'Regular servicing, cleaning, and health checks to keep your surveillance system running at peak performance.',
 slug: 'cctv-maintenance',
 color: '#06b6d4',
 img: '/svc2.png',
 },
 {
 icon: FiMonitor,
 title: 'Remote Monitoring',
 desc: '24/7 live monitoring from our professional security operations center with immediate incident response.',
 slug: 'remote-monitoring',
 color: '#8b5cf6',
 img: '/svc3.png',
 },
 {
 icon: FiWifi,
 title: 'Wireless Camera Setup',
 desc: 'Flexible cable-free wireless IP camera solutions. Perfect for rented properties and temporary sites.',
 slug: 'wireless-camera-setup',
 color: '#10b981',
 img: '/svc4.png',
 },
 {
 icon: FiShield,
 title: 'Commercial Security Systems',
 desc: 'Enterprise-grade multi-camera systems with AI analytics, license plate recognition, and access control.',
 slug: 'commercial-security-systems',
 color: '#f59e0b',
 img: '/svc5.png',
 },
 {
 icon: FiHome,
 title: 'Home Security Cameras',
 desc: 'Smart home CCTV with smartphone monitoring, motion alerts, and seamless smart home integration.',
 slug: 'home-security-cameras',
 color: '#ef4444',
 img: '/svc6.png',
 },
];

export default function ServicesGrid() {
 return (
 <section className="py-24 relative overflow-hidden" style={{ background: 'var(--bg-primary)' }}>
 <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
 {/* Header */}
 <div className="text-center mb-16">
 <motion.p
 initial={{ opacity: 0, y: 20 }}
 whileInView={{ opacity: 1, y: 0 }}
 viewport={{ once: true }}
 className="text-blue-400 font-semibold uppercase tracking-widest text-sm mb-3"
 >
 What We Offer
 </motion.p>
 <motion.h2
 initial={{ opacity: 0, y: 20 }}
 whileInView={{ opacity: 1, y: 0 }}
 viewport={{ once: true }}
 transition={{ delay: 0.1 }}
 className="text-4xl sm:text-5xl font-bold mb-5" style={{ color: 'var(--text-primary)' }}
 >
 Our Security Services
 </motion.h2>
 <motion.p
 initial={{ opacity: 0, y: 20 }}
 whileInView={{ opacity: 1, y: 0 }}
 viewport={{ once: true }}
 transition={{ delay: 0.2 }}
 className="max-w-2xl mx-auto text-lg" style={{ color: 'var(--text-muted)' }}
 >
 End-to-end CCTV solutions tailored for homes, businesses, and everything in between.
 </motion.p>
 </div>

 {/* Grid */}
 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
 {services.map((svc, i) => {
 const Icon = svc.icon;
 return (
 <motion.div
 key={svc.slug}
 initial={{ opacity: 0, y: 30 }}
 whileInView={{ opacity: 1, y: 0 }}
 viewport={{ once: true }}
 transition={{ delay: i * 0.08 }}
 className="group relative rounded-none cursor-pointer transition-all duration-300 hover:-translate-y-1 overflow-hidden flex flex-col"
 style={{
 background: 'var(--bg-card)',
 border: '1px solid var(--border-soft)',
 }}
 onMouseEnter={(e) => {
 e.currentTarget.style.border = `1px solid ${svc.color}60`;
 e.currentTarget.style.boxShadow = `0 20px 60px ${svc.color}20`;
 }}
 onMouseLeave={(e) => {
 e.currentTarget.style.border = '1px solid rgba(59,130,246,0.15)';
 e.currentTarget.style.boxShadow = 'none';
 }}
 >
 {/* Image thumbnail */}
 <div className="relative w-full overflow-hidden" style={{ height: 180 }}>
 <img
 src={svc.img}
 alt={svc.title}
 className="w-full h-full object-cover transition-transform duration-500 group-"
 style={{ filter: 'brightness(0.8) saturate(1.1)' }}
 />
 {/* Gradient overlay */}
 <div
 className="absolute inset-0"
 style={{ background: `linear-gradient(to bottom, transparent 40%, rgba(13,36,68,0.95) 100%)` }}
 />
 {/* Icon badge over image */}
 <div
 className="absolute bottom-3 left-4 w-10 h-10 flex items-center justify-center"
 style={{ background: `${svc.color}22`, border: `1px solid ${svc.color}60` }}
 >
 <Icon style={{ color: svc.color, fontSize: '1.2rem' }} />
 </div>
 {/* Accent color top strip */}
 <div className="absolute top-0 left-0 right-0 h-0.5" style={{ background: svc.color }} />
 </div>

 {/* Content */}
 <div className="p-6 flex flex-col flex-1">
 <h3 className="font-bold text-xl mb-3" style={{ color: 'var(--text-primary)' }}>{svc.title}</h3>
 <p className="text-sm leading-relaxed mb-5 flex-1" style={{ color: 'var(--text-muted)' }}>{svc.desc}</p>
 <Link
 to={`/services/${svc.slug}`}
 className="inline-flex items-center gap-1.5 text-sm font-semibold transition-colors"
 style={{ color: svc.color }}
 >
 Learn More <FiArrowRight className="transition-transform group-hover:translate-x-1" />
 </Link>
 </div>
 </motion.div>
 );
 })}
 </div>

 {/* View All */}
 <div className="text-center mt-12">
 <Link to="/services" className="btn-outline">
 View All Services <FiArrowRight />
 </Link>
 </div>
 </div>
 </section>
 );
}
