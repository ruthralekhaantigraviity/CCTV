import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiClock, FiUserCheck, FiUsers, FiCalendar, FiSearch } from 'react-icons/fi';
import axios from 'axios';

export default function AttendanceTracking() {
 const [attendance, setAttendance] = useState([]);
 const [employees, setEmployees] = useState([]);
 const [loading, setLoading] = useState(true);
 const [search, setSearch] = useState('');
 const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

 useEffect(() => {
 const fetchData = async () => {
 try {
 const token = localStorage.getItem('token');
 const [attRes, empRes] = await Promise.all([
 axios.get('http://localhost:5000/api/attendance', { headers: { Authorization: `Bearer ${token}` } }),
 axios.get('http://localhost:5000/api/auth/employees', { headers: { Authorization: `Bearer ${token}` } }),
 ]);
 setAttendance(attRes.data.data || []);
 setEmployees(empRes.data.data || []);
 } catch (err) {
 console.error('Failed to fetch attendance');
 } finally {
 setLoading(false);
 }
 };
 fetchData();
 }, []);

 const todayRecords = attendance.filter(a => {
 const aDate = new Date(a.clockIn).toISOString().split('T')[0];
 return aDate === selectedDate;
 });

 const filteredRecords = todayRecords.filter(a =>
 a.employee?.name?.toLowerCase().includes(search.toLowerCase())
 );

 const formatTime = (t) => t ? new Date(t).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : '—';

 if (loading) return (
 <div className="flex items-center justify-center h-64">
 <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
 </div>
 );

 return (
 <div className="space-y-8">
 {/* Header */}
 <div className="flex items-center justify-between flex-wrap gap-4">
 <div>
 <h1 className="text-3xl font-black text-slate-900 tracking-tighter">Attendance</h1>
 <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1">Field Technician Clock-In Log</p>
 </div>
 <input type="date" value={selectedDate} onChange={e => setSelectedDate(e.target.value)}
 className="px-5 py-3 bg-white border border-gray-100 text-sm font-bold text-slate-600 focus:outline-none "
 />
 </div>

 {/* Stats */}
 <div className="grid grid-cols-3 gap-4">
 {[
 { label: 'Total Staff', value: employees.length, icon: FiUsers, color: 'blue' },
 { label: 'Present Today', value: todayRecords.length, icon: FiUserCheck, color: 'emerald' },
 { label: 'Absent', value: Math.max(0, employees.length - todayRecords.length), icon: FiCalendar, color: 'red' },
 ].map((s, i) => (
 <motion.div key={s.label} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
 className="bg-white p-5 border border-gray-100 flex items-center gap-4"
 >
 <div className={`w-12 h-12 flex items-center justify-center ${s.color === 'blue' ? 'bg-blue-50 text-blue-600' : s.color === 'emerald' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-500'}`}>
 <s.icon size={22} />
 </div>
 <div>
 <p className="text-2xl font-black text-slate-800">{s.value}</p>
 <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{s.label}</p>
 </div>
 </motion.div>
 ))}
 </div>

 {/* Search */}
 <div className="relative">
 <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
 <input type="text" placeholder="Search by employee name..." value={search} onChange={e => setSearch(e.target.value)}
 className="w-full pl-10 pr-4 py-3 bg-white border border-gray-100 text-sm text-slate-700 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-100 "
 />
 </div>

 {/* Table */}
 <div className="bg-white border border-gray-100 overflow-hidden">
 <div className="overflow-x-auto">
 <table className="w-full text-left">
 <thead>
 <tr className="border-b border-gray-100 bg-gray-50/60">
 {['Employee', 'Clock In', 'Clock Out', 'Duration', 'Status'].map(col => (
 <th key={col} className="px-6 py-4 text-[9px] font-black uppercase tracking-widest text-slate-400">{col}</th>
 ))}
 </tr>
 </thead>
 <tbody className="divide-y divide-gray-50">
 {filteredRecords.length === 0 ? (
 <tr>
 <td colSpan="5" className="py-20 text-center">
 <FiClock className="mx-auto text-slate-200 mb-3" size={40} />
 <p className="text-xs font-black text-slate-300 uppercase tracking-widest">No attendance records for this date</p>
 </td>
 </tr>
 ) : filteredRecords.map((record, idx) => {
 const duration = record.clockOut
 ? Math.round((new Date(record.clockOut) - new Date(record.clockIn)) / 3600000 * 10) / 10
 : null;
 return (
 <motion.tr key={record._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: idx * 0.04 }}
 className=" transition-colors"
 >
 <td className="px-6 py-5">
 <div className="flex items-center gap-3">
 <div className="w-10 h-10 bg-slate-900 flex items-center justify-center text-white font-black text-sm ">
 {record.employee?.name?.charAt(0).toUpperCase() || '?'}
 </div>
 <div>
 <p className="font-black text-slate-800 text-sm">{record.employee?.name || 'Unknown'}</p>
 <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wide">Technician</p>
 </div>
 </div>
 </td>
 <td className="px-6 py-5">
 <span className="text-sm font-bold text-slate-700">{formatTime(record.clockIn)}</span>
 </td>
 <td className="px-6 py-5">
 <span className="text-sm font-bold text-slate-700">{formatTime(record.clockOut)}</span>
 </td>
 <td className="px-6 py-5">
 <span className="text-sm font-bold text-slate-600">{duration ? `${duration}h` : '—'}</span>
 </td>
 <td className="px-6 py-5">
 {record.clockOut ? (
 <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-emerald-500" /><span className="text-[10px] font-black text-emerald-600 uppercase tracking-wide">Completed</span></div>
 ) : (
 <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" /><span className="text-[10px] font-black text-blue-600 uppercase tracking-wide">On Duty</span></div>
 )}
 </td>
 </motion.tr>
 );
 })}
 </tbody>
 </table>
 </div>
 </div>
 </div>
 );
}
