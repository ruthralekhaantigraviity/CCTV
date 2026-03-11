import { motion } from 'framer-motion';
import { FiUsers, FiMail, FiPhone, FiShield, FiMoreVertical, FiEdit3, FiTrash2, FiPlus, FiSearch } from 'react-icons/fi';

const employees = [
 { id: 'EMP-101', name: 'Amit Kumar', role: 'Chief Technician', email: 'amit.k@sv.com', phone: '+91 98765 43210', status: 'Active', avatar: 'AK' },
 { id: 'EMP-102', name: 'Naveen Raj', role: 'Security Analyst', email: 'naveen.r@sv.com', phone: '+91 98765 43211', status: 'On Field', avatar: 'NR' },
 { id: 'EMP-103', name: 'Priya Sharma', role: 'Support Engineer', email: 'priya.s@sv.com', phone: '+91 98765 43212', status: 'Active', avatar: 'PS' },
 { id: 'EMP-104', name: 'Vikram Singh', role: 'Installation Expert', email: 'vikram.s@sv.com', phone: '+91 98765 43213', status: 'Offline', avatar: 'VS' },
 { id: 'EMP-105', name: 'Deepa Lakshmi', role: 'Junior Technician', email: 'deepa.l@sv.com', phone: '+91 98765 43214', status: 'Active', avatar: 'DL' },
];

export default function AdminEmployees() {
 return (
 <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
 <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
 <div>
 <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Personnel Directory</h1>
 <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Fleet Member Management</p>
 </div>
 <button className="bg-blue-600 text-white px-8 py-4 font-bold uppercase tracking-widest text-[10px] flex items-center gap-3 transition-all">
 <FiPlus size={18} /> Add New Member
 </button>
 </div>

 <div className="bg-white border border-slate-100 overflow-hidden">
 <div className="p-8 border-b border-slate-50 flex flex-col md:flex-row gap-6 items-center justify-between">
 <div className="flex items-center bg-slate-50 px-6 py-3 border border-slate-100 w-full md:w-96 focus-within:border-[#B0C4DE] transition-all">
 <FiSearch className="text-slate-400" />
 <input
 type="text"
 placeholder="Search names, roles, or IDs..."
 className="bg-transparent border-none outline-none ml-4 text-xs pt-1 w-full font-semibold placeholder:text-slate-300 uppercase tracking-widest"
 />
 </div>
 </div>

 <div className="overflow-x-auto">
 <table className="w-full text-left">
 <thead className="bg-slate-50 text-[10px] uppercase font-bold text-slate-400 tracking-widest">
 <tr>
 <th className="px-10 py-6">Member ID</th>
 <th className="px-10 py-6">Identity</th>
 <th className="px-10 py-6">Designation</th>
 <th className="px-10 py-6">Status</th>
 <th className="px-10 py-6">Contact</th>
 <th className="px-10 py-6 text-right">Actions</th>
 </tr>
 </thead>
 <tbody className="divide-y divide-slate-50">
 {employees.map((emp, index) => (
 <motion.tr
 key={emp.id}
 initial={{ opacity: 0, x: -20 }}
 animate={{ opacity: 1, x: 0 }}
 transition={{ delay: index * 0.05 }}
 className=" transition-colors group"
 >
 <td className="px-10 py-6">
 <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{emp.id}</span>
 </td>
 <td className="px-10 py-6">
 <div className="flex items-center gap-4">
 <div className="w-10 h-10 bg-slate-100 text-slate-600 flex items-center justify-center font-bold text-xs border border-slate-200">
 {emp.avatar}
 </div>
 <div>
 <p className="text-sm font-bold text-slate-900">{emp.name}</p>
 <p className="text-[10px] font-medium text-slate-400 uppercase tracking-widest leading-none mt-1">SV Staff Registered</p>
 </div>
 </div>
 </td>
 <td className="px-10 py-6 text-sm font-bold text-slate-600">
 {emp.role}
 </td>
 <td className="px-10 py-6">
 <span className={`px-4 py-1.5 rounded-none text-[9px] font-bold uppercase tracking-widest border ${emp.status === 'Active' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
 emp.status === 'On Field' ? 'bg-blue-50 text-blue-600 border-blue-100' :
 'bg-slate-50 text-slate-400 border-slate-100'
 }`}>
 {emp.status}
 </span>
 </td>
 <td className="px-10 py-6">
 <div className="flex flex-col gap-1">
 <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-tight">
 <FiMail className="text-[#4682B4]" /> {emp.email}
 </div>
 <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-tight">
 <FiPhone className="text-[#4682B4]" /> {emp.phone}
 </div>
 </div>
 </td>
 <td className="px-10 py-6 text-right">
 <div className="flex items-center justify-end gap-2 opacity-0 group- transition-opacity">
 <button className="p-2 border border-transparent transition-all">
 <FiEdit3 size={16} />
 </button>
 <button className="p-2 border border-transparent transition-all">
 <FiTrash2 size={16} />
 </button>
 </div>
 </td>
 </motion.tr>
 ))}
 </tbody>
 </table>
 </div>
 </div>
 </div>
 );
}
