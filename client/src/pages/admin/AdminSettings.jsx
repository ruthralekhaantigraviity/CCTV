import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiUser, FiLock, FiBell, FiShield, FiSave, FiCamera, FiMail, FiPhone } from 'react-icons/fi';

export default function AdminSettings() {
    const [activeTab, setActiveTab] = useState('profile');
    const [profile, setProfile] = useState({ name: 'Admin User', email: 'admin@securevision.com', phone: '+91 98765 43210', company: 'SecureVision CCTV' });
    const [passwords, setPasswords] = useState({ current: '', newPass: '', confirm: '' });
    const [notifications, setNotifications] = useState({ newBooking: true, assignmentUpdate: true, enquiry: true, attendance: false });
    const [saved, setSaved] = useState(false);

    const handleSave = () => {
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    const tabs = [
        { id: 'profile', label: 'Profile', icon: FiUser },
        { id: 'security', label: 'Security', icon: FiLock },
        { id: 'notifications', label: 'Notifications', icon: FiBell },
    ];

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-black text-slate-900 tracking-tighter">Settings</h1>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1">System Configuration</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Sidebar Tabs */}
                <div className="space-y-2">
                    {tabs.map(tab => (
                        <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                            className={`w-full flex items-center gap-3 px-5 py-4 text-sm font-black uppercase tracking-wide text-left ${activeTab === tab.id ? 'bg-[#1e3a8a] text-white ' : 'bg-white text-slate-500 border border-gray-100'}`}
                        >
                            <tab.icon size={16} />
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Content */}
                <div className="lg:col-span-3">
                    <motion.div key={activeTab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}
                        className="bg-white p-8 border border-gray-100 "
                    >
                        {/* Profile Tab */}
                        {activeTab === 'profile' && (
                            <div className="space-y-6">
                                <div className="flex items-center gap-6 mb-8 pb-8 border-b border-gray-50">
                                    <div className="w-20 h-20 bg-slate-900 flex items-center justify-center text-white text-3xl font-black ">A</div>
                                    <div>
                                        <h2 className="font-black text-slate-800 text-xl">Admin User</h2>
                                        <p className="text-[10px] font-black text-red-500 uppercase tracking-widest mt-1">Super Admin</p>
                                        <button className="mt-3 flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-wide transition-all">
                                            <FiCamera size={12} /> Change Photo
                                        </button>
                                    </div>
                                </div>
                                {[
                                    { key: 'name', label: 'Full Name', icon: FiUser, type: 'text' },
                                    { key: 'email', label: 'Email Address', icon: FiMail, type: 'email' },
                                    { key: 'phone', label: 'Phone Number', icon: FiPhone, type: 'text' },
                                    { key: 'company', label: 'Company Name', icon: FiShield, type: 'text' },
                                ].map(field => (
                                    <div key={field.key}>
                                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-2">{field.label}</label>
                                        <div className="relative">
                                            <field.icon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={15} />
                                            <input type={field.type} value={profile[field.key]}
                                                onChange={e => setProfile({ ...profile, [field.key]: e.target.value })}
                                                className="w-full pl-10 pr-4 py-3 border border-gray-100 text-sm text-slate-700 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-100"
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Security Tab */}
                        {activeTab === 'security' && (
                            <div className="space-y-6">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-12 h-12 bg-blue-50 flex items-center justify-center text-blue-600"><FiLock size={22} /></div>
                                    <div>
                                        <h2 className="font-black text-slate-800">Change Password</h2>
                                        <p className="text-[10px] font-bold text-slate-400">Keep your account secure</p>
                                    </div>
                                </div>
                                {[
                                    { key: 'current', label: 'Current Password' },
                                    { key: 'newPass', label: 'New Password' },
                                    { key: 'confirm', label: 'Confirm New Password' },
                                ].map(field => (
                                    <div key={field.key}>
                                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-2">{field.label}</label>
                                        <input type="password" value={passwords[field.key]}
                                            onChange={e => setPasswords({ ...passwords, [field.key]: e.target.value })}
                                            placeholder="••••••••"
                                            className="w-full px-4 py-3 border border-gray-100 text-sm text-slate-700 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-100"
                                        />
                                    </div>
                                ))}
                                <div className="p-5 bg-amber-50 border border-amber-100 ">
                                    <p className="text-xs font-bold text-amber-600">⚠️ Use a strong password with at least 8 characters, including numbers and symbols.</p>
                                </div>
                            </div>
                        )}

                        {/* Notifications Tab */}
                        {activeTab === 'notifications' && (
                            <div className="space-y-6">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-12 h-12 bg-blue-50 flex items-center justify-center text-blue-600"><FiBell size={22} /></div>
                                    <div>
                                        <h2 className="font-black text-slate-800">Notification Preferences</h2>
                                        <p className="text-[10px] font-bold text-slate-400">Control what alerts you receive</p>
                                    </div>
                                </div>
                                {[
                                    { key: 'newBooking', label: 'New Booking', desc: 'Alert when a new installation booking is submitted' },
                                    { key: 'assignmentUpdate', label: 'Assignment Updates', desc: 'Alert when a job is assigned or status changes' },
                                    { key: 'enquiry', label: 'Customer Enquiries', desc: 'Alert for new contact form submissions' },
                                    { key: 'attendance', label: 'Attendance Alerts', desc: 'Alert for employee clock-in/out events' },
                                ].map(item => (
                                    <div key={item.key} className="flex items-center justify-between p-5 bg-gray-50 ">
                                        <div>
                                            <p className="font-black text-slate-700 text-sm">{item.label}</p>
                                            <p className="text-xs text-slate-400 mt-0.5">{item.desc}</p>
                                        </div>
                                        <button onClick={() => setNotifications(n => ({ ...n, [item.key]: !n[item.key] }))}
                                            className={`w-14 h-7 rounded-full transition-all relative ${notifications[item.key] ? 'bg-blue-600' : 'bg-gray-200'}`}
                                        >
                                            <div className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow transition-all ${notifications[item.key] ? 'left-8' : 'left-1'}`} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Save Button */}
                        <div className="mt-8 pt-6 border-t border-gray-50 flex justify-end">
                            <button onClick={handleSave}
                                className={`flex items-center gap-2 px-8 py-3 text-[10px] font-black uppercase tracking-widest transition-all ${saved ? 'bg-emerald-500 text-white ' : 'bg-blue-600 text-white '}`}
                            >
                                <FiSave size={15} />
                                {saved ? 'Saved!' : 'Save Changes'}
                            </button>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
