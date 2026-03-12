import { Link } from 'react-router-dom';
import { FiCamera, FiPhone, FiMail, FiMapPin, FiFacebook, FiTwitter, FiInstagram, FiLinkedin, FiYoutube } from 'react-icons/fi';

const quickLinks = [
 { name: 'Home', path: '/' },
 { name: 'About Us', path: '/about' },
 { name: 'Contact', path: '/contact' },
];

const serviceLinks = [
 { name: 'CCTV Installation', path: '/services/cctv-installation' },
 { name: 'CCTV Maintenance', path: '/services/cctv-maintenance' },
 { name: 'Remote Monitoring', path: '/services/remote-monitoring' },
 { name: 'Wireless Camera Setup', path: '/services/wireless-camera-setup' },
 { name: 'Commercial Security', path: '/services/commercial-security-systems' },
 { name: 'Home Security', path: '/services/home-security-cameras' },
];

export default function Footer() {
 return (
 <footer style={{ background: 'var(--bg-secondary)', borderTop: '1px solid var(--border)' }}>
 <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
 {/* Brand */}
 <div>
 <Link to="/" className="flex items-center gap-3 mb-5">
 <div>
 <span className="font-bold text-lg block leading-tight" style={{ color: 'var(--text-primary)' }}>SecureVision</span>
 <span className="text-blue-400 text-xs tracking-widest uppercase">CCTV Solutions</span>
 </div>
 </Link>
 <p className="text-sm leading-relaxed mb-6" style={{ color: 'var(--text-muted)' }}>
 Professional CCTV installation, maintenance, and monitoring solutions for homes and businesses. Licensed, insured, and trusted by 500+ clients.
 </p>
 <div className="flex items-center gap-3">
 {[FiFacebook, FiTwitter, FiInstagram, FiLinkedin, FiYoutube].map((Icon, i) => (
 <a
 key={i}
 href="#"
 className="w-9 h-9 rounded-lg bg-blue-900/30 flex items-center justify-center text-blue-400 transition-all duration-300"
 >
 <Icon className="text-base" />
 </a>
 ))}
 </div>
 </div>

 {/* Quick Links Section (Pruned) */}
 <div>
 <h3 className="font-semibold text-base mb-5" style={{ color: 'var(--text-primary)' }}>Quick Links</h3>
 <ul className="space-y-2.5">
 {quickLinks.map((link) => (
 <li key={link.path}>
 <Link
 to={link.path}
 className=" text-sm transition-colors flex items-center gap-2 group" style={{ color: 'var(--text-muted)' }}
 >
 <span className="w-1.5 h-1.5 rounded-full bg-blue-600 group- transition-colors flex-shrink-0" />
 {link.name}
 </Link>
 </li>
 ))}
 </ul>
 </div>

 {/* Services */}
 <div>
 <h3 className="font-semibold text-base mb-5" style={{ color: 'var(--text-primary)' }}>Our Services</h3>
 <ul className="space-y-2.5">
 {serviceLinks.map((link) => (
 <li key={link.path}>
 <Link
 to={link.path}
 className=" text-sm transition-colors flex items-center gap-2 group" style={{ color: 'var(--text-muted)' }}
 >
 <span className="w-1.5 h-1.5 rounded-full bg-blue-600 group- transition-colors flex-shrink-0" />
 {link.name}
 </Link>
 </li>
 ))}
 </ul>
 </div>

 {/* Contact Info */}
 <div>
 <h3 className="font-semibold text-base mb-5" style={{ color: 'var(--text-primary)' }}>Contact Us</h3>
 <ul className="space-y-4">
 <li className="flex items-start gap-3">
 <FiMapPin className="text-blue-400 text-lg flex-shrink-0 mt-0.5" />
 <span className="text-sm" style={{ color: 'var(--text-muted)' }}>123 Security Avenue, Tech District, New York, NY 10001</span>
 </li>
 <li className="flex items-center gap-3">
 <FiPhone className="text-blue-400 text-lg flex-shrink-0" />
 <a href="tel:+18001234567" className="text-gray-400 text-sm transition-colors">+1 (800) 123-4567</a>
 </li>
 <li className="flex items-center gap-3">
 <FiMail className="text-blue-400 text-lg flex-shrink-0" />
 <a href="mailto:info@securevision.com" className="text-gray-400 text-sm transition-colors">info@securevision.com</a>
 </li>
 </ul>
 <div className="mt-5 p-3 rounded-lg" style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)' }}>
 <p className="text-red-400 text-xs font-semibold mb-1">🚨 24/7 Emergency Line</p>
 <a href="tel:+18009999911" className="text-red-300 text-sm font-bold transition-colors">+1 (800) 999-9911</a>
 </div>
 </div>
 </div>
 </div>

 {/* Bottom bar */}
 <div style={{ borderTop: '1px solid var(--border-soft)' }}>
 <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
 <p className="text-sm" style={{ color: 'var(--text-muted)' }}>© {new Date().getFullYear()} SecureVision CCTV Solutions. All rights reserved.</p>
 <div className="flex items-center gap-4">
 <a href="#" className="text-gray-500 text-xs transition-colors">Privacy Policy</a>
 <a href="#" className="text-gray-500 text-xs transition-colors">Terms of Service</a>
 <a href="#" className="text-gray-500 text-xs transition-colors">Cookie Policy</a>
 </div>
 </div>
 </div>
 </footer>
 );
}
