import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowRight, FiShield } from 'react-icons/fi';

export default function CTABanner() {
    return (
        <section className="py-24 relative overflow-hidden">
            <div
                className="absolute inset-0"
                style={{ background: 'linear-gradient(135deg, #060e1a 0%, #0a1172 100%)' }}
            />
            {/* Pattern overlay */}
            <div
                className="absolute inset-0 opacity-10"
                style={{
                    backgroundImage: `radial-gradient(circle, #fff 1px, transparent 1px)`,
                    backgroundSize: '30px 30px',
                }}
            />
            <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-6"
                >
                    <FiShield className="text-white text-3xl" />
                </motion.div>
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-4xl sm:text-5xl font-extrabold text-white mb-5"
                >
                    Protect Your Property Today
                </motion.h2>
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 }}
                    className="text-blue-100 text-xl mb-10 max-w-2xl mx-auto"
                >
                    Don't wait until it's too late. Get a free security assessment from our certified experts and find the perfect solution for your property.
                </motion.p>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                    className="flex flex-col sm:flex-row gap-4 justify-center"
                >
                    <Link
                        to="/contact"
                        className="inline-flex items-center justify-center gap-2 bg-white text-blue-900 font-bold px-6 py-2.5 rounded-none transition-all duration-300 hover:-translate-y-0.5 text-sm"
                    >
                        Request Security Assessment <FiArrowRight />
                    </Link>
                    <a
                        href="tel:+18001234567"
                        className="inline-flex items-center justify-center gap-2 bg-white/15 border-2 border-white/50 text-white font-bold px-6 py-2.5 rounded-none transition-all duration-300 text-sm"
                    >
                        Call Now: +1 (800) 123-4567
                    </a>
                </motion.div>
            </div>
        </section>
    );
}
