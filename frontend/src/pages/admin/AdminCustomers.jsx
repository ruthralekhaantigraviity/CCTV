import { motion } from 'framer-motion';
import { FiUser, FiMapPin, FiCalendar, FiVideo, FiSearch, FiFilter, FiDownload, FiCheckCircle } from 'react-icons/fi';

const customers = [
 { id: 'CUST-3902', name: 'Rajesh Kumar', location: 'Anna Nagar, Chennai', cameras: 8, joined: '12 Jan 2024', status: 'Active Subscription' },
 { id: 'CUST-3903', name: 'Meera Jasmine', location: 'T. Nagar, Chennai', cameras: 4, joined: '05 Feb 2024', status: 'Active Subscription' },
 { id: 'CUST-3904', name: 'Siddharth V.', location: 'Adyar, Chennai', cameras: 12, joined: '20 Feb 2024', status: 'Maintenance Due' },
 { id: 'CUST-3905', name: 'Anjali Menon', location: 'Velachery, Chennai', cameras: 6, joined: '01 Mar 2024', status: 'Active Subscription' },
 { id: 'CUST-3906', name: 'Karthik Rao', location: 'Mylapore, Chennai', cameras: 16, joined: '08 Mar 2024', status: 'Elite Gold Plan' },
];

export default function AdminCustomers() {
 return (
 <div className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-700">
 <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
 <div>
 <h1 className="text-4xl font-bold text-slate-800 tracking-tight">Client Intelligence</h1>
 <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mt-1">SecureVision User Base</p>
 </div>
 <div className="flex gap-4">
 <button className="bg-white text-slate-800 border border-slate-200 px-6 py-4 font-bold uppercase tracking-widest text-sm flex items-center gap-3 transition-all">
 <FiDownload size={18} /> Export Registry
 </button>
 <button className="bg-blue-600 text-white px-8 py-4 font-bold uppercase tracking-widest text-sm flex items-center gap-3 transition-all">
 <FiUser size={18} /> New Client Entry
 </button>
 </div>
 </div>

 <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
 <div className="bg-white p-6 border border-slate-100 ">
 <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1">Active Subscriptions</p>
 <div className="flex items-end justify-between">
 <h3 className="text-4xl font-bold text-slate-800 tracking-tight">1,248</h3>
 <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full uppercase">+4.2%</span>
 </div>
 </div>
 <div className="bg-white p-6 border border-slate-100 ">
 <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1">Managed Cameras</p>
 <div className="flex items-end justify-between">
 <h3 className="text-4xl font-bold text-slate-800 tracking-tight">8,492</h3>
 <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-full uppercase">TOTAL ASSETS</span>
 </div>
 </div>
 <div className="bg-white p-6 border border-slate-100 ">
 <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1">Monthly Growth</p>
 <div className="flex items-end justify-between">
 <h3 className="text-4xl font-bold text-slate-800 tracking-tight">124</h3>
 <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-full uppercase">NEW ENTRIES</span>
 </div>
 </div>
 </div>

 <div className="bg-white border border-slate-100 overflow-hidden">
 <div className="p-8 border-b border-slate-50 flex flex-col lg:flex-row gap-6 items-center justify-between">
 <div className="flex items-center bg-slate-50 px-6 py-3 border border-slate-100 w-full lg:w-96 focus-within:border-blue-300 transition-all">
 <FiSearch className="text-slate-400" />
 <input
 type="text"
 placeholder="Find by Client Name or ID..."
 className="bg-transparent border-none outline-none ml-4 text-sm pt-1 w-full font-semibold placeholder:text-slate-300 uppercase tracking-widest"
 />
 </div>
 <div className="flex gap-4 w-full lg:w-auto">
 <button className="flex-grow lg:flex-none flex items-center justify-center gap-3 px-6 py-3 bg-white border border-slate-100 text-sm font-bold uppercase tracking-widest text-slate-400 transition-all">
 <FiFilter /> Filter Matrix
 </button>
 </div>
 </div>

 <div className="overflow-x-auto">
 <table className="w-full text-left">
 <thead className="bg-slate-50 text-sm uppercase font-bold text-slate-400 tracking-widest">
 <tr>
 <th className="px-10 py-6">Identity</th>
 <th className="px-10 py-6">Deployment Location</th>
 <th className="px-10 py-6 text-center">Endpoints</th>
 <th className="px-10 py-6">Status</th>
 <th className="px-10 py-6">Commencement</th>
 </tr>
 </thead>
 <tbody className="divide-y divide-slate-50">
 {customers.map((cust, index) => (
 <motion.tr
 key={cust.id}
 initial={{ opacity: 0, scale: 0.98 }}
 animate={{ opacity: 1, scale: 1 }}
 transition={{ delay: index * 0.05 }}
 className=" transition-colors group cursor-pointer"
 >
 <td className="px-10 py-6">
 <div className="flex items-center gap-4">
 <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400  group- transition-all">
 <FiUser size={20} />
 </div>
 <div>
 <p className="text-base font-bold text-slate-900 tracking-tight">{cust.name}</p>
 <p className="text-xs font-medium text-slate-400 uppercase tracking-widest mt-1">{cust.id}</p>
 </div>
 </div>
 </td>
 <td className="px-10 py-6">
 <div className="flex items-center gap-2 text-sm font-bold text-slate-600">
 <FiMapPin className="text-[#4682B4]" /> {cust.location}
 </div>
 </td>
 <td className="px-10 py-6 text-center">
 <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-50 rounded-none border border-blue-100">
 <FiVideo className="text-blue-600" size={14} />
 <span className="text-sm font-bold text-blue-700">{cust.cameras}</span>
 </div>
 </td>
 <td className="px-10 py-6">
 <div className="flex items-center gap-2 px-4 py-1.5 bg-emerald-50 text-emerald-600 rounded-none border border-emerald-100 w-fit">
 <FiCheckCircle size={12} />
 <span className="text-xs font-bold uppercase tracking-widest">{cust.status}</span>
 </div>
 </td>
 <td className="px-10 py-6">
 <div className="flex items-center gap-2 text-sm font-bold text-slate-500 uppercase tracking-widest">
 <FiCalendar className="text-[#4682B4]" /> {cust.joined}
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
