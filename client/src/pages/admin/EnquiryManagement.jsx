import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiMail, FiSearch, FiCheck, FiTrash2, FiInbox, FiMessageCircle } from 'react-icons/fi';
import axios from 'axios';

const API_URL = '/api/contact';

export default function EnquiryManagement() {
    const [enquiries, setEnquiries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');

    useEffect(() => { fetchEnquiries(); }, []);

    const fetchEnquiries = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const res = await axios.get(API_URL, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.data.success) setEnquiries(res.data.data);
        } catch (err) {
            console.error('Failed to fetch enquiries');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateStatus = async (id, newStatus) => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.patch(`${API_URL}/${id}`, { status: newStatus }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.data.success)
                setEnquiries(enquiries.map(enq => enq._id === id ? res.data.data : enq));
        } catch (err) {
            console.error('Failed to update status');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this enquiry?')) return;
        try {
            const token = localStorage.getItem('token');
            const res = await axios.delete(`${API_URL}/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.data.success) setEnquiries(enquiries.filter(enq => enq._id !== id));
        } catch (err) {
            console.error('Failed to delete enquiry');
        }
    };

    const filtered = enquiries.filter(enq => {
        const matchSearch = enq.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            enq.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            enq.phone?.includes(searchTerm);
        const matchStatus = filterStatus === 'all' || enq.status === filterStatus;
        return matchSearch && matchStatus;
    });

    const formatDate = (d) => new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }).toUpperCase();

    const newCount = enquiries.filter(e => e.status === 'new').length;
    const readCount = enquiries.filter(e => e.status === 'read').length;

    if (loading) return (
        <div className="flex items-center justify-center h-64">
            <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        </div>
    );

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-black text-slate-900 tracking-tighter">Customer Enquiries</h1>
            </div>



            {/* Search + Filter */}
            <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-grow">
                    <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                    <input type="text" placeholder="Search by name, email, or phone..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-white border border-gray-100 text-sm text-slate-700 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-100 "
                    />
                </div>
                <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
                    className="px-5 py-3 bg-white border border-gray-100 text-sm font-bold text-slate-600 focus:outline-none "
                >
                    <option value="all">All Statuses</option>
                    <option value="new">New</option>
                    <option value="read">Read</option>
                    <option value="resolved">Resolved</option>
                </select>
            </div>

            {/* Table */}
            <div className="bg-white border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-gray-100 bg-gray-50/60">
                                {['Inquirer', 'Credentials', 'Inquiry Focus', 'Interaction', 'Registry Date', 'Disposition', 'Clearance'].map(col => (
                                    <th key={col} className="px-6 py-4 text-[9px] font-black uppercase tracking-widest text-slate-400">{col}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {filtered.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="py-20 text-center">
                                        <FiInbox className="mx-auto text-slate-200 mb-3" size={40} />
                                        <p className="text-xs font-black text-slate-300 uppercase tracking-widest">No entries found</p>
                                    </td>
                                </tr>
                            ) : filtered.map((enq, idx) => (
                                <motion.tr key={enq._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: idx * 0.04 }}
                                    className=" transition-colors group"
                                >
                                    <td className="px-6 py-5">
                                        <p className="font-black text-slate-800 text-sm leading-tight">{enq.name}</p>
                                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">{enq.phone}</p>
                                    </td>
                                    <td className="px-6 py-5">
                                        <span className="text-sm font-bold text-slate-900">{enq.email}</span>
                                    </td>
                                    <td className="px-6 py-5">
                                        <span className="text-sm font-black text-slate-800">{enq.service}</span>
                                    </td>
                                    <td className="px-6 py-5 max-w-[160px]">
                                        <p className="text-xs text-slate-500 truncate">"{enq.message}"</p>
                                    </td>
                                    <td className="px-6 py-5 whitespace-nowrap">
                                        <span className="text-sm font-bold text-slate-500">{formatDate(enq.createdAt)}</span>
                                    </td>
                                    <td className="px-6 py-5">
                                        <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${enq.status === 'new' ? 'bg-slate-100 text-slate-500' :
                                            enq.status === 'read' ? 'bg-blue-50 text-blue-600' :
                                                'bg-emerald-50 text-emerald-600'
                                            }`}>{enq.status || 'NEW'}</span>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex gap-2 opacity-0 group- transition-all">
                                            <button onClick={() => handleUpdateStatus(enq._id, 'read')}
                                                className="w-8 h-8 bg-blue-50 text-blue-600 flex items-center justify-center transition-all" title="Mark Read">
                                                <FiCheck size={14} />
                                            </button>
                                            <button onClick={() => handleDelete(enq._id)}
                                                className="w-8 h-8 bg-red-50 text-red-500 flex items-center justify-center transition-all" title="Delete">
                                                <FiTrash2 size={14} />
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
