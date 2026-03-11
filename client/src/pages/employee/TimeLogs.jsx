import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
 FiClock, FiCalendar, FiMapPin, FiBarChart2,
 FiCheckCircle, FiAlertCircle, FiArrowRight, FiInfo
} from 'react-icons/fi';
import axios from 'axios';

export default function TimeLogs() {
 const [logs, setLogs] = useState([]);

 useEffect(() => {
 fetchMyLogs();
 }, []);

 const fetchMyLogs = async () => {
 try {
 const token = localStorage.getItem('token');
 const res = await axios.get('/api/attendance/me', {
 headers: { Authorization:`Bearer ${token}` }
 });
 if (res.data.success) {
 setLogs(res.data.attendance);
 }
 } catch (err) {
 console.error('Failed to fetch logs');
 // Mock for demo
 setLogs([
 { _id: '1', date: '2026-03-08', punchIn: '09:00:00', punchOut: '18:15:00', status: 'Present' },
 { _id: '2', date: '2026-03-07', punchIn: '09:05:00', punchOut: '17:45:00', status: 'Present' },
 { _id: '3', date: '2026-03-06', punchIn: '--:--:--', punchOut: '--:--:--', status: 'Absent' },
 ]);
 }
 };

 return (
 <div className="space-y-8">
 {/* Monthly Recap */}
 <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
 <div className="bg-[#050B14] p-8 rounded-none border border-blue-500/10 flex items-center gap-6">
 <div className="w-14 h-14 bg-blue-600/10 rounded-none flex items-center justify-center text-blue-500 shadow-[0_0_20px_rgba(37,99,235,0.1)]">
 <FiCalendar size={28} />
 </div>
 <div>
 <p className="text-xs font-medium text-slate-500 mb-1">Days Deployed</p>
 <p className="text-[28px] font-medium text-white ">22/26</p>
 </div>
 </div>

 <div className="bg-[#050B14] p-8 rounded-none border border-white/5 flex items-center gap-6">
 <div className="w-14 h-14 bg-emerald-600/10 rounded-none flex items-center justify-center text-emerald-500">
 <FiCheckCircle size={28} />
 </div>
 <div>
 <p className="text-xs font-medium text-slate-500 mb-1">Punctuality</p>
 <p className="text-[28px] font-medium text-white ">98.2%</p>
 </div>
 </div>

 <div className="bg-[#050B14] p-8 rounded-none border border-white/5 flex items-center gap-6">
 <div className="w-14 h-14 bg-indigo-600/10 rounded-none flex items-center justify-center text-indigo-500">
 <FiBarChart2 size={28} />
 </div>
 <div>
 <p className="text-xs font-medium text-slate-500 mb-1">Total Hours</p>
 <p className="text-[28px] font-medium text-white ">176.4h</p>
 </div>
 </div>
 </div>

 {/* Attendance Spreadsheet */}
 <div className="bg-[#050B14] rounded-none border border-white/5 overflow-hidden shadow-2xl">
 <div className="p-8 border-b border-white/5 flex items-center justify-between">
 <div>
 <h3 className="text-[18px] font-medium text-white leading-none mb-1 font-sans">Mission Log Repository</h3>
 </div>
 </div>

 <div className="overflow-x-auto">
 <table className="w-full text-left">
 <thead className="bg-white/5 text-xs font-medium text-slate-400">
 <tr>
 <th className="px-6 py-3">Date Protocol</th>
 <th className="px-6 py-3">Infil (Punch In)</th>
 <th className="px-6 py-3">Exfil (Punch Out)</th>
 <th className="px-6 py-3">Net Duration</th>
 <th className="px-6 py-3">Status Code</th>
 <th className="px-6 py-3 text-right">Data</th>
 </tr>
 </thead>
 <tbody className="divide-y divide-white/5 text-sm">
 {logs.map((log) => (
 <tr key={log._id} className="/[0.02] transition-colors group">
 <td className="px-10 py-8">
 <div className="font-medium text-white ">{log.date}</div>
 </td>
 <td className="px-10 py-8 font-medium text-blue-400">{log.punchIn}</td>
 <td className="px-10 py-8 font-medium text-blue-400">{log.punchOut}</td>
 <td className="px-10 py-8">
 <div className="text-xs font-medium text-slate-500">9h 15m</div>
 </td>
 <td className="px-10 py-8">
 <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-none border text-xs font-medium ${log.status === 'Present' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-red-500/10 text-red-500 border-red-500/20'
 }`}>
 <div className={`w-1.5 h-1.5 rounded-none ${log.status === 'Present' ? 'bg-emerald-500' : 'bg-red-500 animate-pulse'}`} />
 {log.status}
 </div>
 </td>
 <td className="px-10 py-8 text-right">
 <button className="p-2 text-slate-600 transition-all"><FiInfo size={18} /></button>
 </td>
 </tr>
 ))}
 </tbody>
 </table>
 </div>
 </div>
 </div>
 );
}
