import { motion } from 'framer-motion';
import { FiBarChart2, FiActivity, FiTrendingUp, FiAlertTriangle, FiDownload, FiCalendar, FiPieChart } from 'react-icons/fi';

export default function AdminReports() {
 return (
 <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
 <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
 <div>
 <h1 className="text-3xl font-bold text-slate-800 tracking-tight">System Analytics</h1>
 <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Performance Intelligence Reports</p>
 </div>
 <button className="bg-blue-600 text-white px-8 py-4 rounded-none font-bold uppercase tracking-widest text-[10px] flex items-center gap-3 transition-all">
 <FiDownload size={18} /> Generate Full Intelligence
 </button>
 </div>

 {/* Quick Metrics */}
 <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
 {[
 { label: 'Uptime Efficiency', value: '99.98%', icon: FiActivity, color: 'emerald' },
 { label: 'Network Load', value: '42%', icon: FiTrendingUp, color: 'blue' },
 { label: 'Security Alerts', value: '02', icon: FiAlertTriangle, color: 'amber' },
 { label: 'Intelligence Sync', value: 'Active', icon: FiBarChart2, color: 'indigo' },
 ].map((stat, i) => (
 <div key={i} className="bg-white p-6 rounded-none border border-slate-100 ">
 <div className={`w-10 h-10 rounded-none mb-4 flex items-center justify-center bg-${stat.color}-50 text-${stat.color}-600`}>
 <stat.icon size={20} />
 </div>
 <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
 <h3 className="text-2xl font-bold text-slate-800 tracking-tight">{stat.value}</h3>
 </div>
 ))}
 </div>

 <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
 {/* Traffic Visualization Placeholder */}
 <div className="bg-white rounded-none border border-slate-100 p-10">
 <div className="flex justify-between items-center mb-10">
 <h3 className="text-xl font-bold text-slate-800 tracking-tight">Network Surveillance Traffic</h3>
 <div className="flex gap-2">
 <button className="p-2 border border-slate-100 text-[8px] font-bold uppercase tracking-widest text-slate-400 ">7D</button>
 <button className="p-2 bg-blue-50 border border-blue-100 text-[8px] font-bold uppercase tracking-widest text-blue-600">30D</button>
 </div>
 </div>
 <div className="h-64 flex items-end justify-between gap-3">
 {[40, 60, 45, 90, 65, 80, 50, 75, 55, 100, 70, 85].map((height, i) => (
 <motion.div
 key={i}
 initial={{ height: 0 }}
 animate={{ height: `${height}%` }}
 className="flex-grow bg-gradient-to-t from-[#B0C4DE] to-[#4682B4] rounded-t-lg relative group"
 >
 <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[8px] font-bold px-2 py-1 rounded opacity-0 group- transition-opacity whitespace-nowrap">
 {height}% LOAD
 </div>
 </motion.div>
 ))}
 </div>
 <div className="mt-6 flex justify-between px-2 text-[8px] font-bold text-slate-300 uppercase tracking-widest">
 <span>JAN</span>
 <span>FEB</span>
 <span>MAR</span>
 <span>APR</span>
 <span>MAY</span>
 <span>JUN</span>
 <span>JUL</span>
 <span>AUG</span>
 <span>SEP</span>
 <span>OCT</span>
 <span>NOV</span>
 <span>DEC</span>
 </div>
 </div>

 {/* Maintenance & Health */}
 <div className="bg-white rounded-none border border-slate-100 p-10">
 <div className="flex justify-between items-center mb-10">
 <h3 className="text-xl font-bold text-slate-800 tracking-tight">Hardware Health Matrix</h3>
 <FiPieChart className="text-slate-200" size={24} />
 </div>
 <div className="space-y-8">
 {[
 { label: 'Optical Integrity', status: 'Optimal', health: 100 },
 { label: 'Storage Bandwidth', status: 'Stable', health: 78 },
 { label: 'Compute Power', status: 'Optimal', health: 92 },
 { label: 'Transmission Latency', status: 'Low', health: 15, inverse: true },
 ].map((node, i) => (
 <div key={i} className="space-y-3">
 <div className="flex justify-between items-end">
 <div>
 <p className="text-[10px] font-bold text-slate-800 uppercase tracking-widest">{node.label}</p>
 <p className="text-[8px] font-medium text-slate-400 uppercase tracking-widest leading-none mt-1">{node.status}</p>
 </div>
 <span className={`text-[10px] font-bold ${node.inverse ? 'text-blue-500' : 'text-emerald-500'}`}>{node.health}{node.inverse ? 'ms' : '%'}</span>
 </div>
 <div className="h-2 bg-slate-50 rounded-none overflow-hidden border border-slate-100">
 <motion.div
 initial={{ width: 0 }}
 animate={{ width: `${node.inverse ? (100 - node.health) : node.health}%` }}
 className={`h-full ${node.inverse ? 'bg-blue-400' : 'bg-emerald-400'}`}
 />
 </div>
 </div>
 ))}
 </div>
 </div>
 </div>
 </div>
 );
}
