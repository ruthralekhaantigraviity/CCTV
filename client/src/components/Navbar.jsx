import { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FiCamera, FiMenu, FiX, FiUser, FiLogIn,
    FiSun, FiMoon, FiSearch, FiPhone, FiMapPin
} from 'react-icons/fi';
import {
    FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn
} from 'react-icons/fa';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
    const { theme, toggleTheme } = useTheme();
    const { user, logout } = useAuth();
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();
    const isDark = theme === 'dark';

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
            setSearchQuery('');
            setMenuOpen(false);
        }
    };

    const linkInactive = isDark
        ? 'text-gray-300 '
        : 'text-gray-700 ';
    const linkActive = 'text-blue-600 font-bold';

    const topBg = isDark ? '#0d1117' : '#1565C0';
    const mainBg = isDark
        ? (scrolled ? 'rgba(6,14,26,0.97)' : 'rgba(6,14,26,0.95)')
        : (scrolled ? 'rgba(255,255,255,0.98)' : '#ffffff');

    return (
        <header className="fixed top-0 left-0 right-0 z-50" style={{ boxShadow: scrolled ? '0 4px 20px rgba(0,0,0,0.1)' : 'none' }}>

            {/* ── TOP BAR (Address + Socials only) ── */}
            <div className="hidden md:flex items-center justify-between px-8 py-1.5 text-xs" style={{ background: '#111827' }}>
                {/* Left: Address */}
                <span className="flex items-center gap-1.5 text-gray-400">
                    <FiMapPin size={11} className="text-teal-400 flex-shrink-0" />
                    300 Anna Salai, Chennai, Tamil Nadu 600002, India
                </span>

                {/* Right: Social icons only */}
                <div className="flex items-center gap-4 text-gray-400">
                    {user && (
                        <span className="text-teal-400 font-bold mr-4 border-r border-gray-700 pr-4">
                            Welcome, {user.name}
                        </span>
                    )}
                    <a href="#" aria-label="Facebook" className=" transition-colors"><FaFacebookF size={11} /></a>
                    <a href="#" aria-label="Instagram" className=" transition-colors"><FaInstagram size={11} /></a>
                </div>
            </div>

            {/* ── MAIN NAV ── */}
            <div
                className="transition-all duration-300 border-b"
                style={{
                    background: mainBg,
                    backdropFilter: 'blur(20px)',
                    borderColor: isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.07)',
                }}
            >
                <div className="max-w-[1600px] mx-auto px-6 lg:px-10">
                    <div className="flex items-center h-16 gap-10">

                        {/* Logo */}
                        <Link to="/" className="flex items-center gap-3 group flex-shrink-0">
                            <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center group- transition-colors shadow-md ">
                                <FiCamera className="text-white text-lg" />
                            </div>
                            <div className="hidden sm:block">
                                <span className="font-extrabold text-base leading-tight block tracking-tight" style={{ color: 'var(--text-primary)' }}>SecureVision</span>
                                <span className="text-blue-500 text-[9px] font-bold tracking-[0.22em] uppercase">CCTV Solutions</span>
                            </div>
                        </Link>

                        {/* Desktop Nav Links */}
                        <nav className="hidden lg:flex items-center gap-1">
                            <NavLink to="/" end className={({ isActive }) => `px-4 py-2 text-sm font-semibold uppercase tracking-wide transition-colors duration-150 ${isActive ? linkActive : linkInactive}`}>Home</NavLink>
                            <NavLink to="/about" className={({ isActive }) => `px-4 py-2 text-sm font-semibold uppercase tracking-wide transition-colors duration-150 ${isActive ? linkActive : linkInactive}`}>About</NavLink>
                            <NavLink to="/products" className={({ isActive }) => `px-4 py-2 text-sm font-semibold tracking-wide transition-colors duration-150 ${isActive ? linkActive : linkInactive}`}>PRODUCTS</NavLink>
                            <NavLink to="/contact" className={({ isActive }) => `px-4 py-2 text-sm font-semibold uppercase tracking-wide transition-colors duration-150 ${isActive ? linkActive : linkInactive}`}>Contact</NavLink>
                        </nav>

                        {/* Spacer */}
                        <div className="flex-grow" />

                        {/* Search Box (right side) */}
                        <form onSubmit={handleSearch} className="hidden lg:flex items-center border rounded-lg overflow-hidden" style={{ borderColor: isDark ? 'rgba(255,255,255,0.12)' : '#d1d5db', background: isDark ? 'rgba(255,255,255,0.04)' : '#f9fafb' }}>
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search product..."
                                className="bg-transparent py-2 pl-4 pr-2 text-sm outline-none w-52"
                                style={{ color: 'var(--text-primary)' }}
                            />
                            <button type="submit" className="px-3 py-2 text-gray-400 transition-colors border-l" style={{ borderColor: isDark ? 'rgba(255,255,255,0.1)' : '#e5e7eb' }}>
                                <FiSearch size={16} />
                            </button>
                        </form>

                        {/* Login & Register or Account */}
                        <div className="hidden lg:flex items-center gap-3">
                            {user ? (
                                <Link to="/dashboard" className="flex items-center gap-1.5 text-sm font-bold text-blue-600 transition-colors ">
                                    <FiUser size={14} /> My Account
                                </Link>
                            ) : (
                                <>
                                    <Link to="/login" className="flex items-center gap-1.5 text-sm font-medium transition-colors" style={{ color: 'var(--text-secondary)' }}>
                                        <FiLogIn size={14} /> Login
                                    </Link>
                                    <span style={{ color: 'var(--text-secondary)', opacity: 0.3 }}>|</span>
                                    <Link to="/signup" className="flex items-center gap-1.5 text-sm font-medium transition-colors" style={{ color: 'var(--text-secondary)' }}>
                                        <FiUser size={14} /> Register
                                    </Link>
                                </>
                            )}
                        </div>

                        {/* Book a Technician CTA */}
                        <Link to="/book-technician" className="hidden lg:inline-flex bg-blue-600 text-white text-xs font-black uppercase tracking-widest px-8 py-3 rounded-full transition-all duration-200 whitespace-nowrap">
                            Book Now
                        </Link>

                        {/* Mobile buttons */}
                        <div className="lg:hidden flex items-center gap-2 ml-auto">
                            <button className="p-2 rounded-lg transition-colors" style={{ color: 'var(--text-primary)' }} onClick={() => setMenuOpen(!menuOpen)}>
                                {menuOpen ? <FiX size={22} /> : <FiMenu size={22} />}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── MOBILE MENU ── */}
            <AnimatePresence>
                {menuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        className="lg:hidden border-t px-5 py-6 space-y-5"
                        style={{
                            background: isDark ? '#0A0B0D' : '#ffffff',
                            borderColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'
                        }}
                    >
                        {/* Mobile Search */}
                        <form onSubmit={handleSearch} className="flex items-center border rounded-lg overflow-hidden" style={{ borderColor: isDark ? 'rgba(255,255,255,0.12)' : '#d1d5db' }}>
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search product..."
                                className="bg-transparent py-2.5 pl-4 pr-2 text-sm outline-none flex-grow"
                                style={{ color: 'var(--text-primary)' }}
                            />
                            <button type="submit" className="px-3 py-2.5 text-gray-400 border-l" style={{ borderColor: isDark ? 'rgba(255,255,255,0.1)' : '#e5e7eb' }}>
                                <FiSearch size={16} />
                            </button>
                        </form>

                        {/* Mobile Nav Links */}
                        <div className="space-y-1">
                            {[['/', 'Home'], ['/about', 'About'], ['/products', 'Products'], ['/contact', 'Contact']].map(([path, label]) => (
                                <NavLink key={path} to={path} end={path === '/'} onClick={() => setMenuOpen(false)}
                                    className={({ isActive }) => `block px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors ${isActive ? 'text-blue-600 bg-blue-50 dark:bg-blue-500/10' : 'text-gray-700 dark:text-gray-300 dark:'}`}
                                >
                                    {label}
                                </NavLink>
                            ))}
                        </div>

                        <div className="flex flex-col gap-2 pt-2 border-t" style={{ borderColor: isDark ? 'rgba(255,255,255,0.07)' : '#e5e7eb' }}>
                            <Link to="/login" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
                                <FiLogIn size={15} /> Login &amp; Register
                            </Link>
                            <Link to="/book-technician" onClick={() => setMenuOpen(false)} className="bg-blue-600 hover:bg-blue-700 text-white text-center py-3 rounded-full text-sm font-black uppercase tracking-widest transition-all">
                                Book a Technician
                            </Link>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
}
