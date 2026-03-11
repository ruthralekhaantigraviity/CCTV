import { motion } from 'framer-motion';
import { FiVideo, FiMapPin, FiCheckCircle, FiAlertCircle, FiEdit3, FiTrash2, FiPlus, FiSearch, FiLayout } from 'react-icons/fi';

const cameras = [
 { id: 'CAM-01', name: 'Main Entrance Bullet', location: 'Anna Nagar Entrance', status: 'Online', ip: '192.168.1.101' },
 { id: 'CAM-02', name: 'Server Room Dome', location: 'Floor 2 IT Bay', status: 'Online', ip: '192.168.1.102' },
 { id: 'CAM-03', name: 'Parking Lot PTZ', location: 'Basement Site A', status: 'Offline', ip: '192.168.1.105' },
 { id: 'CAM-04', name: 'Loading Dock Fixed', location: 'Warehouse Sector 4', status: 'Online', ip: '192.168.1.108' },
 { id: 'CAM-05', name: 'Reception Wide Angle', location: 'Main Lobby', status: 'Online', ip: '192.168.1.110' },
 { id: 'CAM-06', name: 'Perimeter Boundary 1', location: 'North Wall Boundary', status: 'Online', ip: '192.168.1.112' },
];

export default function AdminCameras() {
 return (
 <div className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-700">
 <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
 <div>
 <h1 className="text-3xl font-black text-slate-800 uppercase tracking-tighter">Camera Asset Registry</h1>
 <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.4rem] mt-2">Active Surveillance Management</p>
 </div>
 <div className="flex gap-4">
 <div className="bg-white px-6 py-4 border border-slate-100 hidden sm:flex flex-col justify-center">
 <p className="text-[8px] font-black text-slate-300 uppercase tracking-widest leading-none">Matrix Status</p>
 <p className="text-sm font-black text-emerald-500 uppercase tracking-tighter mt-1">05 / 06 READY</p>
 </div>
 <button className="bg-[#4682B4] text-white px-8 py-4 font-black uppercase tracking-widest text-[10px] flex items-center gap-3  transition-all">
 <FiPlus size={18} /> Add New Asset
 </button>
 </div>
 </div>

 {/* Filter Bar */}
 <div className="bg-white p-6 border border-slate-100 flex flex-col md:flex-row gap-6 items-center justify-between">
 <div className="flex items-center bg-slate-50 px-6 py-3 border border-slate-100 w-full md:w-96 focus-within:border-[#B0C4DE] transition-all">
 <FiSearch className="text-slate-400" />
 <input
 type="text"
 placeholder="Filter by Name, ID or Location..."
 className="bg-transparent border-none outline-none ml-4 text-xs pt-1 w-full font-bold placeholder:text-slate-300 uppercase tracking-widest"
 />
 </div>
 <div className="flex gap-4 w-full md:w-auto">
 <select className="bg-white border border-slate-100 px-6 py-3 text-[10px] font-black uppercase tracking-widest outline-none focus:border-[#B0C4DE] transition-all w-full md:w-auto">
 <option>All Assets</option>
 <option>Online Only</option>
 <option>Offline Only</option>
 </select>
 </div>
 </div>

 {/* Camera Grid */}
 <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
 {cameras.map((cam, index) => (
 <motion.div
 key={cam.id}
 initial={{ opacity: 0, scale: 0.95 }}
 animate={{ opacity: 1, scale: 1 }}
 transition={{ delay: index * 0.1 }}
 className="bg-white border border-slate-100 hover: hover: transition-all group overflow-hidden"
 >
 {/* Preview Placeholder */}
 <div className="aspect-[16/10] bg-slate-900 relative overflow-hidden">
 <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&q=80&w=600')] bg-cover bg-center opacity-30 group- transition-transform duration-[2000ms]" />
 <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-60" />

 {/* Live Badge */}
 <div className="absolute top-5 left-5 flex items-center gap-2 bg-black/60 backdrop-blur-md px-3 py-1.5 border border-white/10">
 <div className={`w-2 h-2 rounded-full ${cam.status === 'Online' ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`} />
 <span className="text-[10px] font-black text-white uppercase tracking-widest">{cam.status}</span>
 </div>

 {/* Camera Info Overlay */}
 <div className="absolute bottom-6 left-8 right-8">
 <h3 className="text-xl font-black text-white uppercase tracking-tighter leading-none mb-1">{cam.name}</h3>
 <p className="text-[10px] font-bold text-white/50 uppercase tracking-widest flex items-center gap-2">
 <FiLayout size={12} /> {cam.id} • {cam.ip}
 </p>
 </div>
 </div>

 {/* Details & Actions */}
 <div className="p-8 space-y-6">
 <div className="flex items-start gap-4 p-4 bg-slate-50 border border-slate-100/50">
 <div className="p-3 bg-white text-blue-500 ">
 <FiMapPin size={18} />
 </div>
 <div>
 <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Physical Installation</p>
 <p className="text-sm font-black text-slate-800">{cam.location}</p>
 </div>
 </div>

 <div className="grid grid-cols-2 gap-4">
 <button className="flex items-center justify-center gap-3 py-4 border-2 border-slate-100 text-[10px] font-black uppercase tracking-widest text-[#4682B4] hover:border-[#B0C4DE] transition-all">
 <FiEdit3 size={16} /> Edit Asset
 </button>
 <button className="flex items-center justify-center gap-3 py-4 border-2 border-slate-100 text-[10px] font-black uppercase tracking-widest text-red-400 transition-all">
 <FiTrash2 size={16} /> Remove
 </button>
 </div>
 </div>
 </motion.div>
 ))}
 </div>
 </div>
 );
}
