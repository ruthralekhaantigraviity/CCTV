import { useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FiGrid, FiCalendar, FiBox, FiUsers, FiUser,
    FiTruck, FiMail, FiSettings, FiLogOut, FiChevronLeft, FiFileText
} from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';

// Import Admin Sub-pages
import AdminOverview from './admin/AdminOverview';
import AdminBooking from './admin/AdminBooking';
import AdminDashboardHome from './admin/AdminDashboardHome';
import AdminAttendance from './admin/AdminAttendance';
import AdminLeave from './admin/AdminLeave';
import InventoryManagement from './admin/InventoryManagement';
import EmployeeManagement from './admin/EmployeeManagement';
import InstallationTracking from './admin/InstallationTracking';
import EnquiryManagement from './admin/EnquiryManagement';
import AdminSettings from './admin/AdminSettings';

export default function AdminDashboard() {
    const { logout, user, loading: authLoading } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (!authLoading && (!user || user.role !== 'admin')) {
            logout();
            navigate('/admin/login');
        }
    }, [user, authLoading, navigate, logout]);

    if (authLoading) return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        </div>
    );

    const menuItems = [
        { id: 'dashboard', label: 'Dashboard', icon: FiGrid, path: '/admin-dashboard' },
        { id: 'bookings', label: 'Bookings', icon: FiCalendar, path: '/admin-dashboard/bookings' },
        { id: 'employees', label: 'Employees', icon: FiUsers, path: '/admin-dashboard/employees' },
        { id: 'attendance', label: 'Attendance', icon: FiUser, path: '/admin-dashboard/attendance' },
        { id: 'leave', label: 'Leave', icon: FiFileText, path: '/admin-dashboard/leave' },
        { id: 'tracked', label: 'Tracked', icon: FiTruck, path: '/admin-dashboard/tracked' },
        { id: 'enquiries', label: 'Enquiries', icon: FiMail, path: '/admin-dashboard/enquiries' },
        { id: 'settings', label: 'Settings', icon: FiSettings, path: '/admin-dashboard/settings' },
    ];

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="flex min-h-screen bg-gray-50 font-sans text-slate-900 admin-theme">
            {/* Sidebar (Matched to Employee Dashboard) */}
            <aside className="w-24 lg:w-72 bg-white border-r border-gray-100 flex flex-col transition-all duration-300 z-20 fixed h-screen">
                <div className="p-8 mb-4">
                    <div className="flex flex-col">
                        <span className="font-semibold text-xl tracking-tighter text-[#0f172a] uppercase orbitron">SecureVision</span>
                        <span className="text-[10px] font-semibold tracking-[0.2em] text-blue-600 uppercase">Cctv Solutions</span>
                    </div>
                </div>

                <nav className="flex-grow px-4 space-y-1 overflow-y-auto">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-4 mb-4 mt-8">Overview</p>
                    {menuItems.map((item) => {
                        const isActive = location.pathname === item.path ||
                            (item.id === 'dashboard' && location.pathname === '/admin-dashboard');
                        return (
                            <button
                                key={item.id}
                                onClick={() => navigate(item.path)}
                                className={`w-full flex items-center gap-4 px-4 py-3 rounded-none transition-all group ${isActive
                                    ? 'bg-blue-50 text-blue-600'
                                    : 'text-slate-500 '
                                    }`}
                            >
                                <item.icon size={22} className={isActive ? 'text-[#2563eb]' : 'text-[#94a3b8] group-hover:text-[#0f172a]'} />
                                <span className="hidden lg:block font-semibold text-lg tracking-tight">{item.label}</span>
                            </button>
                        );
                    })}
                </nav>

                <div className="p-6 mt-auto border-t border-gray-100">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center justify-center lg:justify-start gap-4 px-4 py-3 text-red-500 font-bold text-lg rounded-none transition-all"
                    >
                        <FiLogOut size={24} className="" />
                        <span className="hidden lg:block">Logout</span>
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-grow lg:ml-72 p-6 lg:p-12 min-h-screen relative bg-white">
                <div className="admin-content-wrapper">
                    <Routes>
                        <Route index element={<AdminDashboardHome />} />
                        <Route path="overview" element={<AdminOverview />} />
                        <Route path="bookings" element={<AdminBooking />} />
                        <Route path="products" element={<InventoryManagement />} />
                        <Route path="employees" element={<EmployeeManagement />} />
                        <Route path="attendance" element={<AdminAttendance />} />
                        <Route path="leave" element={<AdminLeave />} />
                        <Route path="tracked" element={<InstallationTracking />} />
                        <Route path="enquiries" element={<EnquiryManagement />} />
                        <Route path="settings" element={<AdminSettings />} />
                    </Routes>
                </div>
            </main>
        </div>
    );
}
