import { motion } from 'framer-motion';
import { FiArrowRight, FiCalendar, FiUser, FiTag } from 'react-icons/fi';

const posts = [
 { title: '10 Reasons to Upgrade Your CCTV System in 2024', excerpt: "Technology moves fast. If your cameras are more than 5 years old, here are ten compelling reasons why it's time for an upgrade to modern HD and AI-powered systems.", date: 'March 1, 2024', author: 'Kevin Sharma', category: 'Technology', readTime: '5 min read', color: '#3b82f6' },
 { title: 'How to Choose the Right CCTV Camera for Your Business', excerpt: 'Not all cameras are created equal. This guide walks you through the key specifications to look for when selecting cameras for your commercial premises.', date: 'February 20, 2024', author: 'Angela Morrison', category: 'Guides', readTime: '7 min read', color: '#10b981' },
 { title: 'Wired vs Wireless CCTV: Which is Right for You?', excerpt: 'One of the most common questions we get from clients. In this post we break down the pros and cons of each solution and help you decide which is the best fit.', date: 'February 10, 2024', author: 'Robert Collins', category: 'Advice', readTime: '6 min read', color: '#8b5cf6' },
 { title: 'Understanding Night Vision CCTV Technology', excerpt: 'Night vision cameras have come a long way. Learn about the different types of night vision technology and which performs best in low-light and zero-light conditions.', date: 'January 28, 2024', author: 'Kevin Sharma', category: 'Technology', readTime: '4 min read', color: '#f59e0b' },
 { title: 'CCTV for Schools: A Complete Safety Guide', excerpt: 'Educational institutions require sensitive, carefully planned security solutions. We outline best practices for deploying CCTV in schools while respecting privacy.', date: 'January 15, 2024', author: 'Angela Morrison', category: 'Industry', readTime: '8 min read', color: '#06b6d4' },
 { title: 'Remote Monitoring vs On-site Security Guards: A Cost Analysis', excerpt: 'Is it cheaper to hire security guards or invest in remote monitoring? We break down the true cost of each option across different property types and sizes.', date: 'January 5, 2024', author: 'Robert Collins', category: 'Advice', readTime: '6 min read', color: '#ef4444' },
];

export default function Blog() {
 return (
 <>
 {/* Hero */}
 <section className="pt-36 pb-16 relative overflow-hidden" style={{ background: 'var(--hero-gradient)' }}>
 <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'linear-gradient(var(--grid-line) 1px, transparent 1px), linear-gradient(90deg, var(--grid-line) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
 <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
 <p className="text-blue-500 font-semibold uppercase tracking-widest text-sm mb-3">Security Insights</p>
 <h1 className="text-5xl font-extrabold mb-5" style={{ color: 'var(--text-primary)' }}>SecureVision Blog</h1>
 <p className="text-xl max-w-2xl mx-auto" style={{ color: 'var(--text-muted)' }}>Expert advice, industry news, and security tips from the SecureVision team.</p>
 </div>
 </section>

 {/* Posts Grid */}
 <section className="py-16" style={{ background: 'var(--bg-primary)' }}>
 <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
 <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-7">
 {posts.map((post, i) => (
 <motion.article
 key={post.title}
 initial={{ opacity: 0, y: 20 }}
 whileInView={{ opacity: 1, y: 0 }}
 viewport={{ once: true }}
 transition={{ delay: i * 0.07 }}
 className="overflow-hidden group"
 style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}
 >
 {/* Top accent bar */}
 <div className="h-1.5" style={{ background: post.color }} />
 <div className="p-6">
 <span className="text-xs font-semibold px-3 py-1 mb-4 inline-block" style={{ background: `${post.color}20`, color: post.color }}>
 {post.category}
 </span>
 <h2 className="font-bold text-lg mb-3 leading-snug group- transition-colors" style={{ color: 'var(--text-primary)' }}>
 {post.title}
 </h2>
 <p className="text-sm leading-relaxed mb-5" style={{ color: 'var(--text-muted)' }}>{post.excerpt}</p>
 <div className="flex flex-wrap gap-3 text-xs mb-5" style={{ color: 'var(--text-muted)' }}>
 <span className="flex items-center gap-1"><FiCalendar className="text-blue-500" /> {post.date}</span>
 <span className="flex items-center gap-1"><FiUser className="text-blue-500" /> {post.author}</span>
 <span className="flex items-center gap-1"><FiTag className="text-blue-500" /> {post.readTime}</span>
 </div>
 <a href="#" className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-500 transition-colors group/link">
 Read Article <FiArrowRight className="transition-transform group-hover/link:translate-x-1" />
 </a>
 </div>
 </motion.article>
 ))}
 </div>

 {/* Newsletter */}
 <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
 className="mt-16 p-10 text-center" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
 <h3 className="text-2xl font-bold mb-3" style={{ color: 'var(--text-primary)' }}>Stay Updated on Security</h3>
 <p className="mb-6" style={{ color: 'var(--text-muted)' }}>Get the latest security tips and industry news delivered straight to your inbox.</p>
 <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto" onSubmit={(e) => e.preventDefault()}>
 <input type="email" placeholder="your@email.com" className="flex-1 px-4 py-3 outline-none focus:border-blue-500" style={{ background: 'var(--bg-primary)', border: '1px solid var(--border)', color: 'var(--text-primary)' }} />
 <button className="btn-primary">Subscribe</button>
 </form>
 </motion.div>
 </div>
 </section>
 </>
 );
}
