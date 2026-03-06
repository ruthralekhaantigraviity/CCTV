import { motion } from 'framer-motion';
import IndustriesGrid from '../components/IndustriesGrid';
import CTABanner from '../components/CTABanner';

export default function Industries() {
    return (
        <>
            <section className="pt-36 pb-16 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #060e1a, #0a1628)' }}>
                <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'linear-gradient(rgba(59,130,246,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.5) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-blue-400 font-semibold uppercase tracking-widest text-sm mb-3">Sector Expertise</motion.p>
                    <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-5xl font-extrabold text-white mb-5">Industries We Serve</motion.h1>
                    <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-gray-400 text-xl max-w-2xl mx-auto">
                        Every industry has unique security challenges. Our solutions are tailored to meet the specific demands of each environment.
                    </motion.p>
                </div>
            </section>
            <IndustriesGrid />
            <CTABanner />
        </>
    );
}
