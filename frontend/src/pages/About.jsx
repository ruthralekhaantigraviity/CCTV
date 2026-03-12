import { motion } from 'framer-motion';
import { FiShield, FiAward, FiClock, FiUsers } from 'react-icons/fi';
import CTABanner from '../components/CTABanner';
import StatsCounter from '../components/StatsCounter';

const values = [
 { icon: FiShield, title: 'Integrity', desc: 'We operate with full transparency and honesty in every project.' },
 { icon: FiAward, title: 'Excellence', desc: 'We set the highest standards in installation quality and service delivery.' },
 { icon: FiUsers, title: 'Customer First', desc: 'Every decision we make is guided by what is best for our clients.' },
 { icon: FiClock, title: 'Reliability', desc: 'We show up on time, every time, and stand behind our work.' },
];

const team = [
 { name: 'Robert Collins', role: 'Founder & CEO', exp: '15 Years' },
 { name: 'Angela Morrison', role: 'Head of Installations', exp: '12 Years' },
 { name: 'Kevin Sharma', role: 'Technical Director', exp: '10 Years' },
 { name: 'Lisa Park', role: 'Customer Relations', exp: '8 Years' },
];

export default function About() {
 return (
 <>
 {/* Hero */}
 <section className="pt-36 pb-20 relative overflow-hidden" style={{ background: 'var(--hero-gradient)' }}>
 <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'linear-gradient(var(--grid-line) 1px, transparent 1px), linear-gradient(90deg, var(--grid-line) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
 <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
 <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-blue-500 font-semibold uppercase tracking-widest text-sm mb-3">About SecureVision</motion.p>
 <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-5xl font-extrabold mb-5" style={{ color: 'var(--text-primary)' }}>10 Years of Protecting What Matters</motion.h1>
 <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-xl max-w-3xl mx-auto" style={{ color: 'var(--text-muted)' }}>
 Since 2014, SecureVision CCTV Solutions has been the region&apos;s most trusted name in professional surveillance. We combine industry expertise with the latest technology to deliver complete peace of mind.
 </motion.p>
 </div>
 </section>

 {/* Story */}
 <section className="py-20" style={{ background: 'var(--bg-primary)' }}>
 <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
 <div className="grid lg:grid-cols-2 gap-14 items-center">
 <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
 {/* Stacked image layout: main image + offset thumbnail */}
 <div className="relative">
 {/* Main image */}
 <div className="overflow-hidden aspect-video" style={{ border: '1px solid var(--border)' }}>
 <img
 src="/about1.png"
 alt="SecureVision Control Room"
 className="w-full h-full object-cover transition-transform duration-500"
 style={{ filter: 'brightness(0.9) saturate(1.1)' }}
 />
 {/* Overlay label */}
 <div className="absolute bottom-0 left-0 right-0 px-4 py-3" style={{ background: 'var(--overlay-dark)' }}>
 <p className="text-blue-500 font-bold text-sm">SecureVision HQ — Est. 2014</p>
 </div>
 </div>

 {/* Floating thumbnail — team in the field */}
 <div
 className="absolute -bottom-6 -right-6 w-44 overflow-hidden shadow-2xl hidden sm:block"
 style={{ border: '2px solid var(--border)', height: 110 }}
 >
 <img
 src="/about2.png"
 alt="Field installation team"
 className="w-full h-full object-cover"
 />
 <div className="absolute inset-0 flex items-end px-2 pb-1.5" style={{ background: 'rgba(6,14,26,0.55)' }}>
 <span className="text-white text-xs font-semibold">Our Field Team</span>
 </div>
 </div>
 </div>
 </motion.div>

 <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
 <p className="text-blue-500 font-semibold uppercase tracking-widest text-sm mb-3">Our Story</p>
 <h2 className="text-4xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>Founded on a Commitment to Safety</h2>
 <p className="leading-relaxed mb-4" style={{ color: 'var(--text-muted)' }}>
 SecureVision was founded in 2014 by a team of security engineers who believed that every home and business deserved reliable, professional-grade surveillance. From humble beginnings installing systems for local retailers, we have grown into a full-service security company trusted by over 500 clients.
 </p>
 <p className="leading-relaxed mb-8" style={{ color: 'var(--text-muted)' }}>
 Today, our team of certified technicians serves clients across residential, commercial, and industrial sectors. We remain committed to the same founding principles: quality workmanship, honest pricing, and exceptional after-care.
 </p>
 <div className="grid grid-cols-2 gap-4">
 {[['2014', 'Founded'], ['500+', 'Clients'], ['1000+', 'Cameras'], ['10+', 'Years']].map(([val, lab]) => (
 <div key={lab} className="p-4 text-center" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
 <div className="text-2xl font-extrabold text-blue-500">{val}</div>
 <div className="text-sm" style={{ color: 'var(--text-muted)' }}>{lab}</div>
 </div>
 ))}
 </div>
 </motion.div>
 </div>
 </div>
 </section>

 {/* Values */}
 <section className="py-20" style={{ background: 'var(--section-alt)' }}>
 <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
 <div className="text-center mb-12">
 <p className="text-blue-500 font-semibold uppercase tracking-widest text-sm mb-3">What Drives Us</p>
 <h2 className="text-4xl font-bold" style={{ color: 'var(--text-primary)' }}>Our Core Values</h2>
 </div>
 <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
 {values.map((v, i) => {
 const Icon = v.icon;
 return (
 <motion.div key={v.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
 className="p-6 text-center" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
 <div className="w-12 h-12 bg-blue-600/15 border border-blue-600/30 rounded-xl flex items-center justify-center mx-auto mb-4">
 <Icon className="text-blue-500 text-xl" />
 </div>
 <h3 className="font-bold mb-2" style={{ color: 'var(--text-primary)' }}>{v.title}</h3>
 <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{v.desc}</p>
 </motion.div>
 );
 })}
 </div>
 </div>
 </section>

 {/* Team */}
 <section className="py-20" style={{ background: 'var(--bg-primary)' }}>
 <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
 <div className="text-center mb-12">
 <p className="text-blue-500 font-semibold uppercase tracking-widest text-sm mb-3">The Experts</p>
 <h2 className="text-4xl font-bold" style={{ color: 'var(--text-primary)' }}>Meet Our Leadership Team</h2>
 </div>
 <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
 {team.map((member, i) => (
 <motion.div key={member.name} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
 className="p-6 text-center" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
 <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold text-white" style={{ background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)' }}>
 {member.name.split(' ').map(n => n[0]).join('')}
 </div>
 <h3 className="font-bold mb-1" style={{ color: 'var(--text-primary)' }}>{member.name}</h3>
 <p className="text-blue-500 text-sm mb-2">{member.role}</p>
 <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{member.exp} Experience</span>
 </motion.div>
 ))}
 </div>
 </div>
 </section>

 <StatsCounter />
 <CTABanner />
 </>
 );
}
