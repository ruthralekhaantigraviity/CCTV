import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
 FiCheckCircle, FiClock, FiActivity, FiNavigation,
 FiShield, FiTarget, FiZap, FiPhone, FiMapPin, FiArrowRight
} from 'react-icons/fi';
import axios from 'axios';

export default function EmployeeOverview() {
 const [status, setStatus] = useState('offline');
 const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());

 useEffect(() => {
 const timer = setInterval(() => setCurrentTime(new Date().toLocaleTimeString()), 1000);
 return () => clearInterval(timer);
 }, []);

 const toggleStatus = (newStatus) => {
 setStatus(newStatus);
 };

 return (
 <div className="space-y-10">
 {/* Mission Critical Stats */}
 <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
 {/* Punch Panel */}
 <div className="lg:col-span-2 bg-gradient-to-br from-blue-900/20 via-[#050B14] to-[#050B14] p-8 rounded-none border border-blue-500/10 relative overflow-hidden group">
 <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 blur-[80px] rounded-none translate-x-1/2 -translate-y-1/2 transition-all group-" />

 <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
 <div>
 <h2 className="text-[52px] font-medium text-white leading-none mb-2 font-sans">{currentTime}</h2>
 <p className="text-xs font-medium text-slate-500">{new Date().toDateString().toUpperCase()}</p>
 </div>

 <div className="flex flex-col gap-3">
 {status === 'offline' ? (
 <button
 onClick={() => toggleStatus('active')}
 className="px-6 py-3 bg-blue-600 text-white rounded-none font-medium tracking-[0.3em] text-xs shadow-none active:scale-95 transition-all flex items-center gap-3"
 >
 <FiZap /> Initialize Shift
 </button>
 ) : (
 <button
 onClick={() => toggleStatus('offline')}
 className="px-6 py-3 bg-slate-800 text-slate-400 border border-white/10 rounded-none font-medium tracking-[0.3em] text-xs transition-all flex items-center gap-3"
 >
 <FiClock /> Terminate Shift
 </button>
 )}
 <div className="flex items-center gap-2 px-6 py-2 bg-white/5 rounded-none border border-white/5 justify-center">
 <div className={`w-1.5 h-1.5 rounded-none ${status === 'active' ? 'bg-emerald-500 animate-pulse shadow-[0_0_8px_#10b981]' : 'bg-slate-600'}`} />
 <span className="text-xs font-medium text-slate-500">Status: {status.toUpperCase()}</span>
 </div>
 </div>
 </div>
 </div>

 {/* Jobs Summary */}
 <div className="bg-[#050B14] p-8 rounded-none border border-white/5 flex flex-col justify-between">
 <div className="w-12 h-12 bg-blue-600/10 border border-blue-500/20 rounded-none flex items-center justify-center text-blue-400 mb-6">
 <FiTarget size={24} />
 </div>
 <div>
 <p className="text-xs font-medium text-slate-500 mb-1">Assigned Missions</p>
 <p className="text-4xl font-medium text-white ">04</p>
 </div>
 <div className="mt-6 flex items-center gap-3 text-xs font-medium text-blue-500">
 View Dossier <FiArrowRight />
 </div>
 </div>

 {/* Completed Today */}
 <div className="bg-[#050B14] p-8 rounded-none border border-white/5 flex flex-col justify-between">
 <div className="w-12 h-12 bg-emerald-600/10 border border-emerald-500/20 rounded-none flex items-center justify-center text-emerald-400 mb-6">
 <FiCheckCircle size={24} />
 </div>
 <div>
 <p className="text-xs font-medium text-slate-500 mb-1">Neutralized Jobs</p>
 <p className="text-4xl font-medium text-white ">02</p>
 </div>
 <div className="mt-6 flex items-center gap-3 text-xs font-medium text-emerald-500">
 Efficiency: 100%
 </div>
 </div>
 </div>

 {/* Active Deployment */}
 <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
 <div className="bg-[#050B14] rounded-none border border-white/5 overflow-hidden">
 <div className="p-8 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
 <h3 className="text-sm font-medium text-white  font-sans">Current Deployment Intel</h3>
 <div className="px-3 py-1 bg-blue-600/10 border border-blue-500/20 rounded-none text-xs font-medium text-blue-400 animate-pulse">Live Link</div>
 </div>
 <div className="p-8">
 <div className="space-y-8">
 <div className="flex items-start justify-between">
 <div>
 <p className="text-xs font-medium text-slate-500 mb-2">Subject Identity</p>
 <h4 className="text-2xl font-medium text-white  font-sans">Mr. Rajesh Sharma</h4>
 <div className="flex items-center gap-3 mt-2">
 <FiPhone className="text-blue-500" />
 <span className="text-xs font-medium text-slate-400">+91 98765 43210</span>
 </div>
 </div>
 <div className="text-right">
 <p className="text-xs font-medium text-slate-500 mb-2">Deployment Schedule</p>
 <p className="text-xs font-medium text-white ">14:00 - 16:00 HRS</p>
 </div>
 </div>

 <div className="p-8 bg-white/5 rounded-none border border-white/5 space-y-4">
 <div className="flex items-start gap-4">
 <FiMapPin className="text-blue-500 mt-1" />
 <p className="text-xs font-medium leading-relaxed text-slate-300">
 7th Floor, Cyber Plaza, Outer Ring Road, Mahadevapura, Bangalore, KA - 560048
 </p>
 </div>
 <div className="flex items-start gap-4">
 <div className="w-5 h-5 flex-shrink-0"><FiActivity className="text-red-500" /></div>
 <p className="text-xs font-medium leading-relaxed text-slate-300">
 Type: 4K Bullet Camera Installation (04 Units) + NVR Setup.
 </p>
 </div>
 </div>

 <button className="w-full py-5 bg-white text-[#050B14] rounded-none font-medium tracking-[0.3em] text-xs shadow-2xl transition-all">
 Establish Arrival Protocol
 </button>
 </div>
 </div>
 </div>

 {/* Performance Analytics Placeholder */}
 <div className="bg-[#050B14] rounded-none border border-white/5 p-12 flex flex-col items-center justify-center text-center relative overflow-hidden">
 <div className="absolute inset-0 bg-blue-600/5 -skew-y-12 translate-y-20 pointer-events-none" />
 <div className="relative z-10">
 <div className="w-20 h-20 bg-blue-600/10 border-2 border-dashed border-blue-500/20 rounded-none flex items-center justify-center mb-6 mx-auto">
 <FiActivity size={32} className="text-blue-500" />
 </div>
 <h3 className="text-[18px] font-medium text-white mb-3 font-sans">Field Performance Index</h3>
 <p className="text-xs font-medium text-slate-500 max-w-xs mx-auto mb-8">Synchronizing historical deployment data for comprehensive efficiency analysis.</p>
 <div className="inline-flex items-center gap-4 px-6 py-2 bg-white/5 rounded-none border border-white/5">
 <span className="text-xs font-medium text-blue-400">8.9 Alpha Score</span>
 </div>
 </div>
 </div>
 </div>
 </div>
 );
}
