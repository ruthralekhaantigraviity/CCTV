import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';

const stats = [
    { value: 1000, suffix: '+', label: 'Cameras Installed', color: '#3b82f6', shadow: '#1d4ed8' },
    { value: 500, suffix: '+', label: 'Happy Clients', color: '#10b981', shadow: '#065f46' },
    { value: 10, suffix: '+', label: 'Years Experience', color: '#f59e0b', shadow: '#92400e' },
    { value: 24, suffix: '/7', label: 'Monitoring Active', color: '#a78bfa', shadow: '#4c1d95' },
];

function CounterItem({ stat, delay }) {
    const [count, setCount] = useState(0);
    const ref = useRef(null);
    const inView = useInView(ref, { once: true });

    useEffect(() => {
        if (!inView) return;
        let start = 0;
        const end = stat.value;
        const duration = 2000;
        const step = Math.ceil(end / (duration / 16));
        const timer = setInterval(() => {
            start = Math.min(start + step, end);
            setCount(start);
            if (start >= end) clearInterval(timer);
        }, 16);
        return () => clearInterval(timer);
    }, [inView, stat.value]);

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay, duration: 0.6, ease: 'easeOut' }}
            className="flex flex-col items-center text-center group"
            style={{ perspective: '600px' }}
        >
            {/* 3D number */}
            <motion.div
                whileHover={{ rotateY: 8, rotateX: -4, scale: 1.05 }}
                transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                style={{ transformStyle: 'preserve-3d' }}
            >
                <span
                    className="font-black leading-none select-none"
                    style={{
                        fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)',
                        color: stat.color,
                        display: 'block',
                        textShadow: [
                            `0 1px 0 ${stat.shadow}`,
                            `0 2px 0 ${stat.shadow}cc`,
                            `0 3px 0 ${stat.shadow}99`,
                            `0 4px 0 ${stat.shadow}66`,
                            `0 5px 0 ${stat.shadow}33`,
                            `0 6px 12px rgba(0,0,0,0.6)`,
                            `0 0 40px ${stat.color}40`,
                        ].join(', '),
                        letterSpacing: '-0.02em',
                    }}
                >
                    {count}{stat.suffix}
                </span>
            </motion.div>

            {/* Divider line */}
            <div
                className="my-3 h-0.5 w-12 transition-all duration-300 group-hover:w-20"
                style={{ background: `linear-gradient(90deg, transparent, ${stat.color}, transparent)` }}
            />

            {/* Label */}
            <p className="font-medium text-sm tracking-wide uppercase" style={{ color: 'var(--text-muted)' }}>
                {stat.label}
            </p>
        </motion.div>
    );
}

export default function StatsCounter() {
    return (
        <section
            className="py-24 relative overflow-hidden"
            style={{ background: 'var(--section-alt)' }}
        >
            {/* subtle grid bg */}
            <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'linear-gradient(var(--grid-line) 1px, transparent 1px), linear-gradient(90deg, var(--grid-line) 1px, transparent 1px)', backgroundSize: '80px 80px' }} />

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <p className="text-blue-400 font-semibold uppercase tracking-widest text-sm mb-3">Our Track Record</p>
                    <h2 className="text-4xl font-bold" style={{ color: 'var(--text-primary)' }}>Numbers That Speak For Themselves</h2>
                </motion.div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-12">
                    {stats.map((stat, i) => (
                        <CounterItem key={stat.label} stat={stat} delay={i * 0.12} />
                    ))}
                </div>
            </div>
        </section>
    );
}
