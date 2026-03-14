import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
 FiCalendar, FiUser, FiPhone, FiMapPin, FiClock, FiCheckCircle,
 FiX, FiEye, FiUserPlus, FiMoreHorizontal, FiCheck, FiNavigation,
 FiCamera, FiMail, FiSearch, FiFilter
} from 'react-icons/fi';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function BookingManagement() {
 const [bookings, setBookings] = useState([]);
 const [employees, setEmployees] = useState([]);
 const [loading, setLoading] = useState(false);
 const [selectedBooking, setSelectedBooking] = useState(null);
 const [showAssignModal, setShowAssignModal] = useState(false);
 const [showDetailsModal, setShowDetailsModal] = useState(false);

 useEffect(() => {
 fetchBookings();
 fetchEmployees();
 }, []);

 const fetchBookings = async () => {
 try {
 const res = await axios.get('/api/jobs');
 if (res.data.success) {
 setBookings(res.data.data);
 }
 } catch (err) {
 console.error('Failed to fetch bookings');
 }
 };

 const fetchEmployees = async () => {
 try {
 const token = localStorage.getItem('token');
 const res = await axios.get('/api/auth/admin/employees', {
 headers: { Authorization: `Bearer ${token}` }
 });
 if (res.data.success) {
 setEmployees(res.data.employees);
 }
 } catch (err) {
 console.error('Failed to fetch employees');
 }
 };

 const handleAssign = async (employeeId) => {
 try {
 const res = await axios.patch(`/api/jobs/${selectedBooking._id}/accept`, { employeeId });
 if (res.data.success) {
 setShowAssignModal(false);
 fetchBookings();
 }
 } catch (err) {
 alert('Assignment failed');
 }
 };

 const getStatusColor = (status) => {
 switch (status) {
 case 'pending': return 'bg-amber-50 text-amber-600 border-amber-100';
 case 'accepted': return 'bg-blue-50 text-blue-600 border-blue-100';
 case 'technician_visit': return 'bg-indigo-50 text-indigo-600 border-indigo-100';
 case 'completed': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
 case 'cancelled': return 'bg-red-50 text-red-600 border-red-100';
 default: return 'bg-slate-50 text-slate-600 border-slate-100';
 }
 };

 return (
 <div className="space-y-8">
 {/* Summary Cards */}
 <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
 {[
 { label: 'Total', value: bookings.length, color: 'slate' },
 { label: 'Pending', value: bookings.filter(b => b.status === 'pending').length, color: 'amber' },
 { label: 'Accepted', value: bookings.filter(b => b.status === 'accepted').length, color: 'blue' },
 { label: 'In Progress', value: bookings.filter(b => b.status === 'technician_visit').length, color: 'indigo' },
 { label: 'Completed', value: bookings.filter(b => b.status === 'completed').length, color: 'emerald' },
 { label: 'Cancelled', value: bookings.filter(b => b.status === 'cancelled').length, color: 'red' },
 ].map((stat, i) => (
 <div key={i} className="bg-white p-6 border border-slate-200 text-center">
 <p className="text-sm font-bold uppercase text-slate-400 tracking-widest mb-1">{stat.label}</p>
 <p className={`text-4xl font-bold tracking-tighter ${stat.color === 'amber' ? 'text-amber-600' :
 stat.color === 'blue' ? 'text-blue-600' :
 stat.color === 'indigo' ? 'text-indigo-600' :
 stat.color === 'emerald' ? 'text-emerald-600' :
 stat.color === 'red' ? 'text-red-600' :
 'text-slate-900'
 }`}>{stat.value}</p>
 </div>
 ))}
 </div>

 {/* Bookings Table */}
 <div className="bg-white border border-slate-200 overflow-hidden">
 <div className="p-8 border-b border-slate-100 flex items-center justify-between">
 <div>
 <h3 className="text-2xl font-bold text-slate-900 uppercase tracking-tighter">Deployment Registry</h3>
 <p className="text-sm text-slate-400 font-bold uppercase tracking-widest">Active Installation Contracts</p>
 </div>
 <div className="flex gap-4">
 <div className="relative">
 <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
 <input type="text" placeholder="Search Bookings..." className="pl-12 pr-4 py-3 bg-slate-50 border-none text-xs w-64" />
 </div>
 <button className="p-3 bg-slate-50 text-slate-400 "><FiFilter /></button>
 </div>
 </div>

 <div className="overflow-x-auto">
 <table className="w-full text-left">
 <thead className="bg-slate-50 text-sm uppercase font-bold text-slate-400 tracking-widest">
 <tr>
 <th className="px-8 py-4">Contract ID</th>
 <th className="px-8 py-4">Customer Identity</th>
 <th className="px-8 py-4">Deployment Zone</th>
 <th className="px-8 py-4">Assigned Agent</th>
 <th className="px-8 py-4">Status</th>
 <th className="px-8 py-4 text-right">Actions</th>
 </tr>
 </thead>
 <tbody className="divide-y divide-slate-100 text-sm">
 {bookings.map((booking) => (
 <tr key={booking._id} className=" transition-colors group">
 <td className="px-8 py-6 font-bold text-slate-500 uppercase text-sm">#SV-{booking._id.slice(-6)}</td>
 <td className="px-8 py-6">
 <div className="flex flex-col">
 <span className="font-bold text-slate-900 uppercase tracking-tight text-base">{booking.customerName}</span>
 <span className="text-sm font-bold text-slate-400">{booking.customerPhone}</span>
 </div>
 </td>
 <td className="px-8 py-6">
 <p className="text-sm font-bold text-slate-600 line-clamp-1">{booking.customerAddress}</p>
 <div className="flex items-center gap-2 mt-1 text-xs text-slate-400 font-bold uppercase tracking-widest">
 <FiCalendar size={12} /> {booking.date}
 <FiClock size={12} className="ml-2" /> {booking.timeSlot}
 </div>
 </td>
 <td className="px-8 py-6">
 {booking.assignedEmployee ? (
 <div className="flex items-center gap-2">
 <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 text-[11px] flex items-center justify-center font-bold border border-blue-200">
 {booking.assignedEmployee.name.split(' ').map(n => n[0]).join('')}
 </div>
 <span className="font-bold text-sm uppercase tracking-widest">{booking.assignedEmployee.name}</span>
 </div>
 ) : (
 <span className="text-sm font-bold uppercase tracking-widest text-slate-300">Unassigned</span>
 )}
 </td>
 <td className="px-8 py-6">
 <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest border ${getStatusColor(booking.status)}`}>
 {booking.status.replace('_', ' ')}
 </span>
 </td>
 <td className="px-8 py-6 text-right">
 <div className="flex items-center justify-end gap-2">
 <button
 onClick={() => { setSelectedBooking(booking); setShowDetailsModal(true); }}
 className="p-2.5 bg-slate-100 text-slate-600 transition-all"
 >
 <FiEye size={16} />
 </button>
 {booking.status === 'pending' && (
 <button
 onClick={() => { setSelectedBooking(booking); setShowAssignModal(true); }}
 className="p-2.5 bg-[#0A1628] text-white  transition-all"
 >
 <FiUserPlus size={16} />
 </button>
 )}
 </div>
 </td>
 </tr>
 ))}
 </tbody>
 </table>
 </div>
 </div>

 {/* Assign Employee Modal */}
 <AnimatePresence>
 {showAssignModal && (
 <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
 <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowAssignModal(false)} className="absolute inset-0 bg-[#0A1628]/80 backdrop-blur-md" />
 <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="bg-white w-full max-w-2xl rounded-[3rem] overflow-hidden relative z-10 p-12">
 <h2 className="text-4xl font-bold uppercase tracking-tighter mb-8">Deploy Agent</h2>
 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
 {employees.map(emp => (
 <button
 key={emp._id}
 onClick={() => handleAssign(emp._id)}
 className="flex items-center gap-4 p-5 border border-slate-100 hover:border-[#EF4444] transition-all text-left group"
 >
 <div className="w-10 h-10 bg-slate-100 flex items-center justify-center font-black group- transition-colors">{emp.name[0]}</div>
 <div>
 <p className="font-bold text-slate-900 uppercase tracking-tighter text-base">{emp.name}</p>
 <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">{emp.email}</p>
 </div>
 </button>
 ))}
 </div>
 </motion.div>
 </div>
 )}
 </AnimatePresence>

 {/* Details Modal */}
 <AnimatePresence>
 {showDetailsModal && selectedBooking && (
 <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
 <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowDetailsModal(false)} className="absolute inset-0 bg-[#0A1628]/80 backdrop-blur-md" />
 <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} className="bg-white w-full max-w-4xl rounded-[3rem] overflow-hidden relative z-10">
 <div className="grid grid-cols-1 md:grid-cols-2 h-full">
 <div className="bg-[#0A1628] p-12 text-white">
 <div className="w-12 h-12 bg-red-600 mb-8 flex items-center justify-center "><FiCalendar size={24} /></div>
 <h2 className="text-5xl font-bold uppercase tracking-tighter mb-4">Contract<br />Intelligence</h2>
 <div className="space-y-6 mt-10">
 <div>
 <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Status Protocol</p>
 <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest border ${getStatusColor(selectedBooking.status)}`}>{selectedBooking.status}</span>
 </div>
 <div>
 <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Location Coordinates</p>
 <div className="flex items-start gap-3"><FiMapPin className="text-red-500 mt-1" /><p className="text-base font-bold leading-relaxed">{selectedBooking.customerAddress}</p></div>
 </div>
 </div>
 </div>
 <div className="p-12">
 <div className="space-y-8">
 <section>
 <h3 className="text-sm font-bold uppercase text-slate-400 tracking-[0.3em] mb-4">Customer Dossier</h3>
 <div className="p-6 bg-slate-50 space-y-3">
 <div className="flex items-center gap-3"><FiUser className="text-blue-500" /><p className="font-bold text-slate-900 uppercase tracking-tight text-base">{selectedBooking.customerName}</p></div>
 <div className="flex items-center gap-3"><FiPhone className="text-emerald-500" /><p className="text-base font-bold">{selectedBooking.customerPhone}</p></div>
 </div>
 </section>
 <section>
 <h3 className="text-sm font-bold uppercase text-slate-400 tracking-[0.3em] mb-4">Operation Scope</h3>
 <div className="p-6 bg-slate-50 ">
 <p className="text-base font-bold text-slate-900 uppercase tracking-tighter mb-2">Service: {selectedBooking.serviceType}</p>
 <p className="text-sm text-slate-500 leading-relaxed font-medium">{selectedBooking.problemDescription || 'No additional specifications provided.'}</p>
 </div>
 </section>
 {selectedBooking.completionImage && (
 <section>
 <h3 className="text-sm font-bold uppercase text-slate-400 tracking-[0.3em] mb-4">Visual Evidence (Proof)</h3>
 <div className="w-full aspect-video bg-slate-100 border-2 border-dashed border-slate-200 overflow-hidden relative group">
 <img src={selectedBooking.completionImage} alt="Proof" className="w-full h-full object-cover" />
 <div className="absolute inset-0 bg-black/40 opacity-0 group- flex items-center justify-center transition-opacity cursor-pointer">
 <FiEye className="text-white text-3xl" />
 </div>
 </div>
 </section>
 )}
 </div>
 </div>
 </div>
 </motion.div>
 </div>
 )}
 </AnimatePresence>
 </div>
 );
}
