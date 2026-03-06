import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiCheckCircle, FiArrowRight, FiChevronDown, FiChevronUp } from 'react-icons/fi';
import CTABanner from '../components/CTABanner';
import axios from 'axios';

const fallbackServices = {
    'cctv-installation': {
        title: 'CCTV Installation',
        description: 'Our expert technicians provide end-to-end CCTV installation services tailored to your specific security needs.',
        benefits: ['HD & 4K camera options', 'Strategic placement for maximum coverage', 'Weatherproof outdoor cameras', 'Night vision technology', 'Professional cable management', 'Same-day installation available'],
        steps: [
            { title: 'Free Site Survey', description: 'Our security consultant visits your property to assess vulnerabilities and recommend the best setup.' },
            { title: 'System Design', description: 'We design a customized CCTV layout optimized for your building layout and security goals.' },
            { title: 'Professional Installation', description: 'Certified technicians install your system with clean cabling and full configuration.' },
        ],
        faqs: [
            { question: 'How long does installation take?', answer: 'Most residential installations are completed within 4–8 hours. Commercial projects may take 1–3 days.' },
            { question: 'Do you offer warranty?', answer: 'Yes, all installations come with a 1-year workmanship warranty and full manufacturer warranty on equipment.' },
            { question: 'Can I view cameras remotely?', answer: 'Yes, we configure remote viewing via mobile app so you can monitor your property from anywhere.' },
        ],
    },
};

function FAQItem({ question, answer }) {
    const [open, setOpen] = useState(false);
    return (
        <div style={{ border: '1px solid var(--border)' }}>
            <button
                onClick={() => setOpen(!open)}
                className="w-full flex items-center justify-between p-5 text-left hover:bg-blue-500/10 transition-colors"
            >
                <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>{question}</span>
                {open ? <FiChevronUp className="text-blue-500 flex-shrink-0" /> : <FiChevronDown className="text-blue-500 flex-shrink-0" />}
            </button>
            {open && (
                <div className="px-5 pb-5 text-sm leading-relaxed border-t" style={{ borderColor: 'var(--border)', color: 'var(--text-muted)' }}>
                    {answer}
                </div>
            )}
        </div>
    );
}

export default function ServiceDetail() {
    const { slug } = useParams();
    const [service, setService] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchService = async () => {
            try {
                const res = await axios.get(`/api/services/${slug}`);
                setService(res.data.data);
            } catch {
                setService(fallbackServices[slug] || { title: slug, description: 'Service details coming soon.', benefits: [], steps: [], faqs: [] });
            } finally {
                setLoading(false);
            }
        };
        fetchService();
        window.scrollTo(0, 0);
    }, [slug]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg-primary)' }}>
                <div className="w-12 h-12 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <>
            {/* Hero */}
            <section className="pt-36 pb-20 relative overflow-hidden" style={{ background: 'var(--hero-gradient)' }}>
                <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'linear-gradient(var(--grid-line) 1px, transparent 1px), linear-gradient(90deg, var(--grid-line) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
                <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <Link to="/services" className="inline-flex items-center gap-2 text-blue-500 text-sm mb-6 hover:text-blue-400 transition-colors">
                        ← Back to Services
                    </Link>
                    <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-5xl font-extrabold mb-5" style={{ color: 'var(--text-primary)' }}>{service.title}</motion.h1>
                    <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-xl" style={{ color: 'var(--text-muted)' }}>
                        {service.shortDescription || service.description?.slice(0, 120) + '...'}
                    </motion.p>
                </div>
            </section>

            <section className="py-20" style={{ background: 'var(--bg-primary)' }}>
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
                    {/* Description */}
                    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                        <p className="text-lg leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{service.description}</p>
                    </motion.div>

                    {/* Benefits */}
                    {service.benefits?.length > 0 && (
                        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                            <h2 className="text-3xl font-bold mb-6" style={{ color: 'var(--text-primary)' }}>Key Benefits</h2>
                            <div className="grid sm:grid-cols-2 gap-3">
                                {service.benefits.map((b, i) => (
                                    <div key={i} className="flex items-center gap-3 p-4" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                                        <FiCheckCircle className="text-blue-500 text-lg flex-shrink-0" />
                                        <span style={{ color: 'var(--text-secondary)' }}>{b}</span>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {/* How it Works */}
                    {service.steps?.length > 0 && (
                        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                            <h2 className="text-3xl font-bold mb-6" style={{ color: 'var(--text-primary)' }}>How It Works</h2>
                            <div className="space-y-4">
                                {service.steps.map((step, i) => (
                                    <div key={i} className="flex gap-5 p-6" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                                        <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white flex-shrink-0" style={{ background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)' }}>
                                            {i + 1}
                                        </div>
                                        <div>
                                            <h3 className="font-bold mb-1" style={{ color: 'var(--text-primary)' }}>{step.title}</h3>
                                            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{step.description}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {/* FAQs */}
                    {service.faqs?.length > 0 && (
                        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                            <h2 className="text-3xl font-bold mb-6" style={{ color: 'var(--text-primary)' }}>Frequently Asked Questions</h2>
                            <div className="space-y-3">
                                {service.faqs.map((faq, i) => (
                                    <FAQItem key={i} question={faq.question} answer={faq.answer} />
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {/* CTA */}
                    <div className="text-center">
                        <Link to="/contact" className="btn-primary text-lg px-10 py-4 !rounded-none">
                            Get a Free Quote for {service.title} <FiArrowRight />
                        </Link>
                    </div>
                </div>
            </section>

            <CTABanner />
        </>
    );
}
