import { motion } from 'framer-motion';
import {
 FiCalendar, FiUsers, FiBox, FiActivity, FiArrowUpRight,
 FiClock, FiAlertCircle, FiCheckCircle, FiLoader, FiMessageSquare,
 FiTruck, FiPlayCircle, FiUserCheck, FiLayers, FiUsers as FiStaff
} from 'react-icons/fi';

export default function AdminOverview() {
 const operationsStats = [
 { label: 'Total Bookings', value: '9', badge: '+12%', icon: FiCalendar, color: 'blue', badgeColor: 'emerald' },
 { label: 'Pending', value: '0', badge: 'NEEDS ACTION', icon: FiClock, color: 'amber', badgeColor: 'slate' },
 { label: 'In Progress', value: '3', badge: 'ACTIVE', icon: FiTruck, color: 'orange', badgeColor: 'blue' },
 { label: 'Completed', value: '6', badge: '+5%', icon: FiCheckCircle, color: 'emerald', badgeColor: 'emerald' },
 ];

 const staffStats = [
 { label: 'Total Employees', value: '3', badge: 'STABLE', icon: FiStaff, color: 'blue', badgeColor: 'slate' },
 { label: 'Present Today', value: '3', badge: 'LIVE', icon: FiUserCheck, color: 'emerald', badgeColor: 'emerald' },
 { label: 'Technicians Active', value: '3', badge: 'FIELD', icon: FiPlayCircle, color: 'blue', badgeColor: 'indigo' },
 ];

 const StatCard = ({ stat, index }) => (
 <motion.div
 initial={{ opacity: 0, y: 10 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ delay: index * 0.1 }}
 className="bg-white p-6 border border-gray-100 hover: transition-all flex items-center justify-between group"
 >
 <div className="flex items-center gap-5">
 <div className={`w-14 h-14 flex items-center justify-center text-xl transition-colors ${stat.color === 'blue' ? 'bg-blue-50 text-blue-600' :
 stat.color === 'emerald' ? 'bg-emerald-50 text-emerald-600' :
 stat.color === 'amber' ? 'bg-amber-50 text-amber-600' :
 stat.color === 'orange' ? 'bg-orange-50 text-orange-600' :
 'bg-gray-50 text-gray-600'
 }`}>
 <stat.icon />
 </div>
 <div>
 <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
 <p className="text-2xl font-black text-slate-800 tracking-tighter leading-none">{stat.value}</p>
 </div>
 </div>

 <div className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border ${stat.badgeColor === 'emerald' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
 stat.badgeColor === 'blue' ? 'bg-blue-50 text-blue-600 border-blue-100' :
 stat.badgeColor === 'slate' ? 'bg-slate-50 text-slate-400 border-slate-100' :
 stat.badgeColor === 'indigo' ? 'bg-indigo-50 text-indigo-600 border-indigo-100' :
 'bg-gray-50 text-gray-400 border-gray-100'
 }`}>
 {stat.badge}
 </div>
 </motion.div>
 );

 return (
 <div className="space-y-12">
 {/* Header */}
 <div>
 <h1 className="text-4xl font-black text-slate-900 tracking-tighter mb-1 mt-2">Overview</h1>
 <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Operations Management Panel</p>
 </div>

 {/* Operations Section */}
 <section className="space-y-6">
 <div className="flex items-center gap-3 text-slate-400 pl-2">
 <FiLayers size={14} />
 <h2 className="text-[10px] font-black uppercase tracking-[0.3em]">Operations</h2>
 </div>
 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
 {operationsStats.map((stat, i) => (
 <StatCard key={stat.label} stat={stat} index={i} />
 ))}
 </div>
 </section>

 {/* Staff Section */}
 <section className="space-y-6">
 <div className="flex items-center gap-3 text-slate-400 pl-2">
 <FiUsers size={14} />
 <h2 className="text-[10px] font-black uppercase tracking-[0.3em]">Staff</h2>
 </div>
 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
 {staffStats.map((stat, i) => (
 <StatCard key={stat.label} stat={stat} index={i + 4} />
 ))}
 </div>
 </section>

 {/* Secondary Intel (Tables/Alerts) */}
 <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-6">
 {/* Recent Bookings */}
 <motion.div
 initial={{ opacity: 0, scale: 0.98 }}
 animate={{ opacity: 1, scale: 1 }}
 className="bg-white border border-gray-100 overflow-hidden"
 >
 <div className="p-8 border-b border-gray-50 flex items-center justify-between">
 <div>
 <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest italic">Rapid Deployment Log</h3>
 <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-1">Real-time Field Operations</p>
 </div>
 <button className="text-[9px] font-black uppercase tracking-[0.2em] text-blue-600 hover:underline">Full Intel →</button>
 </div>
 <div className="overflow-x-auto">
 <table className="w-full text-left">
 <thead className="bg-gray-50/50 text-[9px] uppercase font-black text-slate-400 tracking-widest">
 <tr>
 <th className="px-8 py-4">ID</th>
 <th className="px-8 py-4">Customer</th>
 <th className="px-8 py-4">Technician</th>
 <th className="px-8 py-4">Status</th>
 </tr>
 </thead>
 <tbody className="divide-y divide-gray-50 text-xs">
 {[1, 2, 3].map((_, i) => (
 <tr key={i} className=" transition-colors">
 <td className="px-8 py-5 font-bold text-slate-500">#{3402 + i}</td>
 <td className="px-8 py-5 font-black text-slate-800 uppercase tracking-tighter">Rajesh K.</td>
 <td className="px-8 py-5">
 <div className="flex items-center gap-2">
 <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-[9px] font-bold text-white ">AK</div>
 <span className="font-bold text-slate-600">Amit K.</span>
 </div>
 </td>
 <td className="px-8 py-5">
 <div className="flex items-center gap-2 text-blue-600 font-black uppercase text-[8px] tracking-widest">
 <div className="w-1 h-1 rounded-full bg-blue-600 animate-pulse" /> Live
 </div>
 </td>
 </tr>
 ))}
 </tbody>
 </table>
 </div>
 </motion.div>

 {/* Critical Inventory */}
 <motion.div
 initial={{ opacity: 0, scale: 0.98 }}
 animate={{ opacity: 1, scale: 1 }}
 className="bg-[#0f172a] border border-slate-700 overflow-hidden p-8"
 >
 <div className="flex items-center justify-between mb-8">
 <div>
 <h3 className="text-sm font-black text-white uppercase tracking-widest italic">Inventory Alert System</h3>
 <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-1">Resource Depletion Warning</p>
 </div>
 <div className="px-3 py-1 bg-red-500/10 border border-red-500/20 rounded-full text-[9px] font-black text-red-400 uppercase tracking-widest">
 12 Critical
 </div>
 </div>
 <div className="space-y-4">
 {[1, 2].map((_, i) => (
 <div key={i} className="flex items-center gap-4 p-5 bg-white/5 border border-white/5 transition-all">
 <div className="w-12 h-12 bg-white/10 flex items-center justify-center text-white">
 <FiBox size={20} />
 </div>
 <div className="flex-grow">
 <h4 className="font-black text-white tracking-tight text-xs uppercase italic">Bullet Pro X1</h4>
 <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-1">Qty: 2 • Min: 5</p>
 </div>
 <button className="px-4 py-2 bg-blue-600 text-white text-[9px] font-black uppercase tracking-widest ">Restock</button>
 </div>
 ))}
 </div>
 </motion.div>
 </div>
 </div>
 );
}
