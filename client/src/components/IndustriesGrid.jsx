import { motion } from 'framer-motion';
import { FiTruck, FiShoppingBag, FiBriefcase, FiPackage, FiHome, FiHeart } from 'react-icons/fi';

const industries = [
    { icon: FiTruck, title: 'Construction Sites', desc: 'Protect valuable equipment and monitor site progress 24/7 with durable outdoor cameras.', color: '#f59e0b' },
    { icon: FiShoppingBag, title: 'Retail Stores', desc: 'Reduce shrinkage and improve customer safety with advanced in-store surveillance.', color: '#10b981' },
    { icon: FiBriefcase, title: 'Offices', desc: 'Monitor access, secure server rooms, and protect your business assets around the clock.', color: '#3b82f6' },
    { icon: FiPackage, title: 'Warehouses', desc: 'Large-scale camera systems to monitor stock, loading bays, and perimeter security.', color: '#8b5cf6' },
    { icon: FiHome, title: 'Residential Communities', desc: 'Gated estate and apartment complex security with entrance/exit monitoring systems.', color: '#06b6d4' },
    { icon: FiHeart, title: 'Schools & Hospitals', desc: 'Sensitive, compliant security solutions for educational and healthcare environments.', color: '#ef4444' },
];

export default function IndustriesGrid() {
    return (
        <section className="py-24" style={{ background: 'var(--section-alt)' }}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-14">
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-blue-400 font-semibold uppercase tracking-widest text-sm mb-3"
                    >
                        Industries We Serve
                    </motion.p>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl sm:text-5xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}
                    >
                        Securing Every Sector
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="max-w-2xl mx-auto" style={{ color: 'var(--text-muted)' }}
                    >
                        We deliver security solutions tailored to the unique challenges of each industry.
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {industries.map((ind, i) => {
                        const Icon = ind.icon;
                        return (
                            <motion.div
                                key={ind.title}
                                initial={{ opacity: 0, scale: 0.95 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.07 }}
                                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                                className="relative rounded-none p-7 overflow-hidden group"
                                style={{
                                    background: 'var(--bg-card)',
                                    border: '1px solid var(--border-soft)',
                                }}
                            >
                                {/* Background accent */}
                                <div
                                    className="absolute top-0 right-0 w-24 h-24 rounded-bl-full opacity-5 transition-opacity duration-300 group-hover:opacity-10"
                                    style={{ background: ind.color }}
                                />
                                <div
                                    className="w-12 h-12 rounded-none flex items-center justify-center mb-4"
                                    style={{ background: `${ind.color}15`, border: `1px solid ${ind.color}30` }}
                                >
                                    <Icon style={{ color: ind.color, fontSize: '1.3rem' }} />
                                </div>
                                <h3 className="font-bold text-lg mb-2" style={{ color: 'var(--text-primary)' }}>{ind.title}</h3>
                                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>{ind.desc}</p>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
