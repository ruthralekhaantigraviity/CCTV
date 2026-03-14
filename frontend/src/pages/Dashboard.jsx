import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate, Link } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FiUser, FiShoppingBag, FiHeart, FiMapPin, FiEdit3, FiSettings, FiBell,
    FiShield, FiCheckCircle, FiPlus, FiTrash2, FiTag, FiArrowRight, FiLogOut
} from 'react-icons/fi';

export default function Dashboard() {
    const { user, logout, loading } = useAuth();
    const { wishlist, toggleWishlist } = useWishlist();
    const [activeTab, setActiveTab] = useState('profile');

    const wishlistItems = wishlist;

    const [addresses, setAddresses] = useState([
        { id: 1, type: 'Home', address: user?.phone + ', Anna Salai, Chennai, TN - 600002', primary: true },
        { id: 2, type: 'Office', address: 'Plot 42, OMR Tech Park, Chennai, TN - 600096', primary: false }
    ]);

    const removeFromWishlist = (id) => {
        const product = wishlist.find(i => i.id === id);
        if (product) toggleWishlist(product);
    };

    const deleteAddress = (id) => {
        setAddresses(prev => prev.filter(addr => addr.id !== id));
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        </div>
    );

    if (!user) return <Navigate to="/login" />;

    const sidebarItems = [
        { id: 'orders', label: 'Orders', icon: FiShoppingBag },
        { id: 'wishlist', label: 'Wishlist', icon: FiHeart },
        { id: 'coupons', label: 'Coupons', icon: FiShield },
        { id: 'address', label: 'Addresses', icon: FiMapPin },
        { id: 'profile', label: 'Edit Profile', icon: FiEdit3 },
        { id: 'settings', label: 'Settings', icon: FiSettings }
    ];

    const renderContent = () => {
        switch (activeTab) {
            case 'profile':
                return (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                        {/* Profile Card */}
                        <div className="bg-card p-8 border border-gray-100 shadow-sm rounded-2xl">
                            <div className="flex flex-col md:flex-row items-center gap-8 mb-10">
                                <div className="relative group">
                                    <div className="absolute inset-0 bg-blue-600/5 rounded-full blur-xl opacity-0 group- transition-opacity" />
                                    <div className="w-32 h-32 rounded-full bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center text-blue-400/50 dark:text-blue-400/30 border border-blue-100 dark:border-blue-500/20 shadow-sm relative z-10">
                                        <FiUser size={64} />
                                    </div>
                                    <div className="absolute bottom-1 right-1 w-9 h-9 bg-blue-50 dark:bg-blue-500/10 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400 shadow-sm cursor-pointer dark: transition-all z-20 border border-blue-100 dark:border-blue-500/20">
                                        <FiEdit3 size={16} />
                                    </div>
                                </div>
                                <div className="text-center md:text-left space-y-2">
                                    <h2 className="text-3xl font-black t-primary uppercase tracking-tighter">{user.name}</h2>
                                    <div className="flex flex-wrap justify-center md:justify-start gap-4">
                                        <div className="flex items-center gap-2 text-xs font-bold text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 px-3 py-1.5 rounded-full border border-blue-100 dark:border-blue-500/20">
                                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" /> Verified Account
                                        </div>
                                        <div className="flex items-center gap-2 text-xs font-bold text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 px-3 py-1.5 rounded-full border border-blue-100 dark:border-blue-500/20">
                                            Member since 2026
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-8 pt-8 border-t border-gray-50 dark:border-gray-800">
                                <div className="space-y-1">
                                    <p className="text-[10px] font-bold t-muted uppercase tracking-widest">Email Address</p>
                                    <p className="font-bold t-primary">{user.email}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] font-bold t-muted uppercase tracking-widest">Mobile Number</p>
                                    <p className="font-bold t-primary">{user.phone}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] font-bold t-muted uppercase tracking-widest">Default Location</p>
                                    <p className="font-bold t-primary">Chennai, India</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] font-bold t-muted uppercase tracking-widest">Account Type</p>
                                    <p className="font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider text-sm">Enterprise Tier</p>
                                </div>
                            </div>

                            <button className="mt-10 px-10 py-4 bg-blue-600 text-white font-black uppercase text-xs tracking-widest rounded-lg active:scale-[0.98]">
                                Edit Details
                            </button>
                        </div>

                        {/* Recent Activity Mini-Stats */}
                        <div className="grid md:grid-cols-3 gap-6">
                            {[
                                { title: 'Active Tickets', value: '2', icon: FiBell, color: 'text-orange-500', bg: 'bg-orange-50 dark:bg-orange-950/20' },
                                { title: 'Active Plans', value: '1', icon: FiShield, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-950/20' },
                                { title: 'Cameras', value: '12', icon: FiCheckCircle, color: 'text-green-500', bg: 'bg-green-50 dark:bg-green-950/20' }
                            ].map((stat) => (
                                <div key={stat.title} className="bg-card p-6 border border-gray-100 shadow-sm flex items-center gap-5 rounded-2xl">
                                    <div className={`w-12 h-12 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center`}>
                                        <stat.icon size={20} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold t-muted uppercase tracking-widest">{stat.title}</p>
                                        <p className="text-xl font-black t-primary">{stat.value}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                );
            case 'orders':
                return (
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="bg-card p-8 border border-gray-100 shadow-sm rounded-2xl">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-xl font-bold t-primary">Recent Orders</h3>
                            <span className="text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-3 py-1 rounded-full">3 Orders Total</span>
                        </div>
                        <div className="space-y-4">
                            {[
                                { id: '#ORD-9821', product: 'Bullet Pro 4K CCTV Kit', date: 'Oct 12, 2025', status: 'Delivered', price: '₹45,999' },
                                { id: '#ORD-8742', product: 'Smart Wi-Fi Dome Camera', date: 'Sep 28, 2025', status: 'In Transit', price: '₹8,499' },
                                { id: '#ORD-7210', product: 'NVR 8-Channel Recorder', date: 'Aug 15, 2025', status: 'Delivered', price: '₹12,499' }
                            ].map(order => (
                                <div key={order.id} className="group p-5 border border-gray-50 dark:border-gray-800 dark: dark: rounded-xl transition-all flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-500/20 rounded-xl flex items-center justify-center transition-colors">
                                            <FiShoppingBag />
                                        </div>
                                        <div>
                                            <p className="font-bold t-primary">{order.product}</p>
                                            <p className="text-xs t-muted font-medium">Order ID: {order.id} • {order.date}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-6">
                                        <div className="text-right">
                                            <p className="font-black t-primary">{order.price}</p>
                                            <p className={`text-[10px] font-bold uppercase tracking-widest ${order.status === 'Delivered' ? 'text-green-500' : 'text-blue-500'}`}>{order.status}</p>
                                        </div>
                                        <button className="p-2 t-muted transition-colors"><FiArrowRight /></button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                );
            case 'wishlist':
                return (
                    <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="bg-card p-8 border border-gray-100 shadow-sm rounded-2xl">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-xl font-bold t-primary">My Wishlist</h3>
                            <span className="text-xs font-bold t-muted uppercase tracking-widest">{wishlistItems.length} Items</span>
                        </div>
                        <div className="grid md:grid-cols-2 gap-6">
                            {wishlistItems.length > 0 ? (
                                wishlistItems.map(item => (
                                    <div key={item.id} className="flex gap-4 p-4 border border-gray-50 dark:border-gray-800 rounded-2xl transition-shadow group">
                                        <div className="relative overflow-hidden rounded-xl bg-gray-100 dark:bg-gray-800">
                                            <img src={item.img} alt={item.name} className="w-24 h-24 object-cover group- transition-transform duration-500" />
                                            <div className="absolute inset-0 bg-blue-600/10 opacity-0 group- transition-opacity" />
                                        </div>
                                        <div className="flex-grow flex flex-col justify-between">
                                            <div>
                                                <p className="font-bold t-primary leading-tight mb-1">{item.name}</p>
                                                <p className="text-[10px] t-muted font-bold uppercase tracking-widest">{item.category}</p>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <p className="font-black text-blue-600 dark:text-blue-400 text-sm">₹{item.price.toLocaleString()}</p>
                                                <div className="flex gap-3">
                                                    <button
                                                        onClick={() => removeFromWishlist(item.id)}
                                                        className="text-red-400 transition-colors p-1"
                                                        title="Remove from Wishlist"
                                                    >
                                                        <FiTrash2 size={16} />
                                                    </button>
                                                    <Link 
                                                        to={`/products/${item.slug}`}
                                                        className="text-blue-600 dark:text-blue-400 transition-colors p-1" 
                                                        title="View Product"
                                                    >
                                                        <FiArrowRight size={16} />
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="col-span-2 py-20 text-center space-y-4">
                                    <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 t-muted rounded-full flex items-center justify-center mx-auto">
                                        <FiHeart size={32} />
                                    </div>
                                    <p className="t-muted font-bold uppercase tracking-widest text-xs">Your wishlist is empty</p>
                                    <button
                                        onClick={() => setActiveTab('profile')}
                                        className="text-blue-600 dark:text-blue-400 text-xs font-black uppercase tracking-widest hover:underline"
                                    >
                                        Explore Products
                                    </button>
                                </div>
                            )}
                        </div>
                    </motion.div>
                );
            case 'coupons':
                return (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-card p-8 border border-gray-100 shadow-sm rounded-2xl">
                        <h3 className="text-xl font-bold t-primary mb-8">Active Rewards</h3>
                        <div className="grid md:grid-cols-2 gap-6">
                            {[
                                { code: 'SECURE20', desc: '20% OFF on Installation', expiry: 'Expires in 5 days' },
                                { code: 'UPGRADE50', desc: '50% OFF on Cloud Storage', expiry: 'Active' }
                            ].map(coupon => (
                                <div key={coupon.code} className="p-6 border-2 border-dashed border-blue-100 dark:border-blue-900 rounded-3xl bg-blue-50/30 dark:bg-blue-900/10 flex items-center gap-5">
                                    <div className="w-12 h-12 bg-white dark:bg-blue-900/40 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400 shadow-sm">
                                        <FiTag size={20} />
                                    </div>
                                    <div>
                                        <p className="font-black text-lg t-primary uppercase tracking-tighter">{coupon.code}</p>
                                        <p className="text-xs t-secondary font-semibold">{coupon.desc}</p>
                                        <p className="text-[10px] text-blue-600 dark:text-blue-400 font-bold uppercase tracking-widest mt-2">{coupon.expiry}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                );
            case 'address':
                return (
                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="bg-card p-8 border border-gray-100 shadow-sm rounded-2xl">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-xl font-bold t-primary">Address Book</h3>
                            <button className="flex items-center gap-2 text-xs font-black text-white bg-sky-500 px-5 py-2.5 rounded-lg hover:bg-sky-500 uppercase tracking-widest shadow-none border-none active:scale-[0.98]">
                                <FiPlus /> Add New
                            </button>
                        </div>
                        <div className="grid md:grid-cols-2 gap-6">
                            {addresses.length > 0 ? (
                                addresses.map(addr => (
                                    <div key={addr.id} className={`p-6 border ${addr.primary ? 'border-blue-600/30 dark:border-blue-400/30 bg-blue-50/10 dark:bg-blue-900/10' : 'border-gray-50 dark:border-gray-800'} rounded-2xl`}>
                                        <div className="flex items-center justify-between mb-3">
                                            <p className="font-black uppercase text-xs tracking-widest t-secondary">{addr.type}</p>
                                            {addr.primary && <span className="text-[10px] bg-blue-600/50 dark:bg-blue-500 text-white px-2 py-0.5 rounded font-bold">PRIMARY</span>}
                                        </div>
                                        <p className="text-sm font-bold t-primary mb-4 leading-relaxed">{user.name}</p>
                                        <p className="text-xs t-muted font-medium leading-relaxed mb-6">{addr.address}</p>
                                        <div className="flex gap-4">
                                            <button className="text-xs font-bold t-muted uppercase tracking-widest transition-colors">Edit</button>
                                            <button
                                                onClick={() => deleteAddress(addr.id)}
                                                className="text-xs font-bold text-red-400 uppercase tracking-widest transition-colors"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="col-span-2 py-10 text-center t-muted italic text-sm">
                                    No addresses saved.
                                </div>
                            )}
                        </div>
                    </motion.div>
                );
            case 'settings':
                return (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-card p-8 border border-gray-100 shadow-sm rounded-2xl">
                        <h3 className="text-xl font-bold t-primary mb-8">Account Settings</h3>
                        <div className="space-y-6">
                            {[
                                { title: 'Security Alerts', desc: 'Receive instant notifications for motion detection.', active: true },
                                { title: 'Two-Factor Authentication', desc: 'Add an extra layer of security to your account.', active: false },
                                { title: 'System Updates', desc: 'Automatically update your camera firmware.', active: true }
                            ].map(setting => (
                                <div key={setting.title} className="flex items-center justify-between py-4 border-b border-gray-50 dark:border-gray-800 last:border-0">
                                    <div>
                                        <p className="font-bold t-primary">{setting.title}</p>
                                        <p className="text-xs t-muted font-medium">{setting.desc}</p>
                                    </div>
                                    <div className={`w-12 h-6 rounded-full p-1 transition-colors cursor-pointer ${setting.active ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-800'}`}>
                                        <div className={`w-4 h-4 bg-white rounded-full transition-transform ${setting.active ? 'translate-x-6' : 'translate-x-0'}`} />
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="mt-10 p-6 bg-red-50 dark:bg-red-950/20 rounded-2xl border border-red-100 dark:border-red-900/40">
                            <p className="font-bold text-red-600 dark:text-red-500 mb-2">Danger Zone</p>
                            <p className="text-xs text-red-400 dark:text-red-600 mb-4">Deleting your account will permanently remove all your security logs and recordings.</p>
                            <button className="text-xs font-black uppercase text-red-600 dark:text-red-500 border border-red-200 dark:border-red-900 px-6 py-3 rounded-xl dark: transition-all">Deactivate Account</button>
                        </div>
                    </motion.div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-page pt-24 pb-20 transition-colors duration-300">
            <div className="max-w-[1240px] mx-auto px-4 md:px-8">

                {/* Dashboard Header */}
                <div className="mb-8 pb-8 border-b border-gray-200 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold t-primary">Account</h1>
                        <p className="text-sm t-secondary font-medium">{user.name}</p>
                    </div>
                    <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-4 py-2 rounded-lg">
                        Tier: Enterprise Monitoring System
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-10">

                    {/* Sidebar */}
                    <aside className="w-full lg:w-64 space-y-1">
                        <div className="pb-6 mb-6 border-b border-gray-200">
                            <p className="text-[10px] font-bold t-muted uppercase tracking-widest pl-4 mb-2">Overview</p>
                            {sidebarItems.map((item) => (
                                <button
                                    key={item.id}
                                    onClick={() => setActiveTab(item.id)}
                                    className={`w-full flex items-center gap-4 px-4 py-3 rounded-lg text-lg font-semibold transition-all ${activeTab === item.id ? 'bg-card text-blue-600 shadow-sm border border-gray-100' : 't-primary '}`}
                                >
                                    <item.icon size={22} className={activeTab === item.id ? 'text-blue-600' : 't-muted'} />
                                    {item.label}
                                </button>
                            ))}
                        </div>
                        <button
                            onClick={logout}
                            className="w-full flex items-center gap-4 px-4 py-3 rounded-lg text-lg font-bold text-red-500 dark: transition-all"
                        >
                            <FiLogOut size={22} /> Logout
                        </button>
                    </aside>

                    {/* Main Content Area */}
                    <div className="flex-grow">
                        <AnimatePresence mode="wait">
                            <div key={activeTab}>
                                {renderContent()}
                            </div>
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </div>
    );
}
