import { useState } from 'react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
 FiHome, FiClipboard, FiClock, FiMapPin, FiSettings,
 FiLogOut, FiMenu, FiX, FiLayers, FiZap, FiUser, FiNavigation
} from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';

export default function EmployeeLayout() {
 const [isSidebarOpen, setIsSidebarOpen] = useState(true);
 const location = useLocation();
 const navigate = useNavigate();
 const { user, logout } = useAuth();

 const menuItems = [
 { icon: FiHome, label: 'Tactical Hub', path: '/employee' },
 { icon: FiClipboard, label: 'My Missions', path: '/employee/jobs' },
 { icon: FiClock, label: 'Time Logs', path: '/employee/attendance' },
 { icon: FiNavigation, label: 'Deployment Area', path: '/employee/map' },
 { icon: FiSettings, label: 'Core Config', path: '/employee/settings' },
 ];

 const handleLogout = () => {
 logout();
 navigate('/employee/login');
 };

 return (
 <div className="flex min-h-screen bg-[#02060C] font-['Inter'] text-slate-300">
 {/* Sidebar */}
 <motion.aside
 initial={false}
 animate={{ width: isSidebarOpen ? '280px' : '80px' }}
 className="bg-[#050B14] border-r border-blue-900/20 flex flex-col fixed h-full z-50 transition-all duration-300"
 >
 {/* Tactical Header */}
 <div className="p-6 flex items-center justify-between border-b border-blue-900/20 bg-gradient-to-b from-blue-900/10 to-transparent">
 <AnimatePresence>
 {isSidebarOpen && (
 <motion.div
 initial={{ opacity: 0, x: -20 }}
 animate={{ opacity: 1, x: 0 }}
 exit={{ opacity: 0, x: -20 }}
 className="flex items-center gap-3"
 >
 <div className="w-8 h-8 bg-blue-600 rounded-none flex items-center justify-center shadow-[0_0_15px_rgba(37,99,235,0.4)]">
 <FiZap className="text-white text-[18px]" />
 </div>
 <span className="text-[18px] font-medium text-white">Ops Center</span>
 </motion.div>
 )}
 </AnimatePresence>
 <button
 onClick={() => setIsSidebarOpen(!isSidebarOpen)}
 className="p-2 rounded-none transition-colors text-blue-400"
 >
 {isSidebarOpen ? <FiX size={20} /> : <FiMenu size={20} />}
 </button>
 </div>

 {/* Tactical Navigation */}
 <nav className="flex-grow py-8 overflow-y-auto custom-scrollbar">
 {menuItems.map((item, index) => {
 const isActive = location.pathname === item.path;
 return (
 <Link
 key={index}
 to={item.path}
 className={`flex items-center gap-4 px-6 py-5 transition-all relative group
 ${isActive ? 'text-blue-400 bg-blue-600/5' : 'text-slate-500 '}
`}
 >
 {isActive && (
 <motion.div
 layoutId="employeeActiveTab"
 className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500 shadow-[0_0_10px_#3b82f6]"
 />
 )}
 <item.icon className={`text-[18px] ${isActive ? 'text-blue-400' : 'group- transition-colors'}`} />
 <AnimatePresence>
 {isSidebarOpen && (
 <motion.span
 initial={{ opacity: 0, x: -10 }}
 animate={{ opacity: 1, x: 0 }}
 exit={{ opacity: 0, x: -10 }}
 className="text-[14px] font-medium whitespace-nowrap"
 >
 {item.label}
 </motion.span>
 )}
 </AnimatePresence>
 </Link>
 );
 })}
 </nav>

 {/* Operative Profile */}
 <div className="p-6 border-t border-blue-900/20 bg-black/40">
 <div className="flex items-center gap-4">
 <div className="relative">
 <div className="w-10 h-10 rounded-none bg-slate-800 flex items-center justify-center border border-white/10 overflow-hidden shadow-2xl">
 {user?.avatar ? (
 <img src={user.avatar} alt="" className="w-full h-full object-cover" />
 ) : (
 <FiUser className="text-[18px]" />
 )}
 </div>
 <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-none border-2 border-[#050B14]" />
 </div>
 {isSidebarOpen && (
 <div className="flex-grow min-w-0">
 <p className="text-xs font-medium truncate text-white ">{user?.name}</p>
 <p className="text-[8px] text-blue-500 font-medium">Field Operative</p>
 </div>
 )}
 {isSidebarOpen && (
 <button
 onClick={handleLogout}
 className="p-2 text-slate-500 transition-colors"
 >
 <FiLogOut size={18} />
 </button>
 )}
 </div>
 </div>
 </motion.aside>

 {/* Main Deployment Area */}
 <main
 className="flex-grow transition-all duration-300 min-h-screen relative"
 style={{ marginLeft: isSidebarOpen ? '280px' : '80px' }}
 >
 {/* Tactical Header */}
 <header className="bg-[#02060C]/80 backdrop-blur-xl border-b border-blue-900/20 sticky top-0 z-40 px-10 py-5 flex items-center justify-between">
 <div>
 <h2 className="text-[18px] font-medium text-white leading-none font-sans">
 {menuItems.find(item => item.path === location.pathname)?.label || 'Tactical Hub'}
 </h2>
 </div>

 <div className="flex items-center gap-6">
 <div className="text-right hidden sm:block">
 <p className="text-xs text-slate-500 font-medium mb-1">Grid Coordinates</p>
 <span className="text-xs font-mono text-blue-400">12.9716° N, 77.5946° E</span>
 </div>
 <div className="h-8 w-px bg-blue-900/30" />
 <div className="flex flex-col items-end">
 <div className="px-3 py-1 bg-blue-600/10 border border-blue-500/20 rounded-none">
 <span className="text-xs font-medium text-blue-400">Sector-7 Active</span>
 </div>
 </div>
 </div>
 </header>

 {/* Content Area */}
 <div className="p-10 relative">
 {/* Background Glows */}
 <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/5 blur-[120px] rounded-none -z-10 pointer-events-none" />

 <Outlet />
 </div>
 </main>
 </div>
 );
}
