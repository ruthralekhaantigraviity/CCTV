import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FiClipboard, FiMapPin, FiPhone, FiClock, FiCheckCircle,
    FiCamera, FiNavigation, FiInfo, FiChevronRight, FiX, FiCheck, FiTarget
} from 'react-icons/fi';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function MyMissions() {
    const [jobs, setJobs] = useState([]);
    const [selectedJob, setSelectedJob] = useState(null);
    const [loading, setLoading] = useState(false);
    const [showProofUpload, setShowProofUpload] = useState(false);
    const [proofImage, setProofImage] = useState(null);

    useEffect(() => {
        fetchMyJobs();
    }, []);

    const fetchMyJobs = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get('/api/jobs', {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.data.success) {
                // In a real app, the server would filter by assigned employee
                // For this demo, we'll show all and pretend they are assigned
                setJobs(res.data.data);
            }
        } catch (err) {
            console.error('Failed to fetch jobs');
        }
    };

    const updateStatus = async (jobId, newStatus) => {
        try {
            const res = await axios.patch(`/api/jobs/${jobId}/status`, { status: newStatus });
            if (res.data.success) {
                fetchMyJobs();
                if (newStatus === 'completed') setShowProofUpload(false);
            }
        } catch (err) {
            toast.error('Status update failed', {
                style: { borderRadius: '0px', background: '#333', color: '#fff' }
            });
        }
    };

    const handleProofChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setProofImage(reader.result);
            reader.readAsDataURL(file);
        }
    };

    const submitCompletion = async () => {
        if (!proofImage) {
            toast.error('Photo evidence required!', {
                style: { borderRadius: '0px', background: '#333', color: '#fff' }
            });
            return;
        }
        setLoading(true);
        try {
            const res = await axios.patch(`/api/jobs/${selectedJob._id}/status`, {
                status: 'completed',
                completionImage: proofImage
            });
            if (res.data.success) {
                setShowProofUpload(false);
                setSelectedJob(null);
                fetchMyJobs();
                toast.success('Mission Accomplished!', {
                    style: { borderRadius: '0px', background: '#0f172a', color: '#fff' }
                });
            }
        } catch (err) {
            toast.error('Upload failed', {
                style: { borderRadius: '0px', background: '#333', color: '#fff' }
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Mission List */}
                <div className="lg:col-span-5 space-y-4">
                    <h2 className="text-[18px] font-medium text-white mb-6 flex items-center gap-3 font-sans">
                        <FiClipboard className="text-blue-500" /> Active Assignments
                    </h2>

                    {jobs.map((job) => (
                        <motion.div
                            key={job._id}
                            onClick={() => setSelectedJob(job)}
                            className={`p-6 rounded-none border transition-all cursor-pointer relative overflow-hidden group ${selectedJob?._id === job._id
                                ? 'bg-blue-600 border-blue-500 shadow-[0_0_30px_rgba(37,99,235,0.3)]'
                                : 'bg-[#050B14] border-white/5 '
                                }`}
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <p className={`text-xs font-medium ${selectedJob?._id === job._id ? 'text-white/60' : 'text-slate-500'}`}>Target Area</p>
                                    <h3 className={`text-[18px] font-medium leading-none ${selectedJob?._id === job._id ? 'text-white' : 'text-slate-200'}`}>{job.customerName}</h3>
                                </div>
                                <span className={`px-2 py-1 rounded text-[8px] font-medium ${job.status === 'completed' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
                                    }`}>
                                    {job.status.replace('_', ' ')}
                                </span>
                            </div>
                            <div className="flex items-center gap-3 text-xs font-medium text-slate-400">
                                <FiMapPin className={selectedJob?._id === job._id ? 'text-white' : 'text-blue-500'} />
                                <span className="line-clamp-1">{job.customerAddress}</span>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Tactical Operation Center */}
                <div className="lg:col-span-7">
                    <AnimatePresence mode="wait">
                        {selectedJob ? (
                            <motion.div
                                key={selectedJob._id}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="bg-[#050B14] rounded-none border border-white/5 shadow-2xl h-full flex flex-col overflow-hidden"
                            >
                                <div className="p-10 border-b border-white/5 bg-white/[0.02]">
                                    <div className="flex items-center justify-between mb-8">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-blue-600 rounded-none flex items-center justify-center shadow-lg">
                                                <FiTarget className="text-white text-[18px]" />
                                            </div>
                                            <div>
                                                <h3 className="text-[16px] font-medium text-white leading-none mb-1 font-sans">Mission Profile</h3>
                                                <p className="text-xs text-blue-500 font-medium">Job ID: #{selectedJob._id.slice(-8).toUpperCase()}</p>
                                            </div>
                                        </div>
                                        <button onClick={() => setSelectedJob(null)} className="p-3 bg-white/5 rounded-none transition-all text-slate-400"><FiX size={20} /></button>
                                    </div>

                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="p-6 bg-white/[0.03] rounded-none border border-white/5">
                                            <p className="text-xs font-medium text-slate-500 mb-2">Subject Contact</p>
                                            <div className="flex items-center gap-3 text-slate-200">
                                                <FiPhone className="text-blue-500" />
                                                <span className="text-sm font-medium">{selectedJob.customerPhone}</span>
                                            </div>
                                        </div>
                                        <div className="p-6 bg-white/[0.03] rounded-none border border-white/5">
                                            <p className="text-xs font-medium text-slate-500 mb-2">Service Protocol</p>
                                            <div className="flex items-center gap-3 text-slate-200">
                                                <FiInfo className="text-amber-500" />
                                                <span className="text-sm font-medium ">{selectedJob.serviceType}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-10 flex-grow space-y-8">
                                    <div className="p-8 bg-blue-600/5 rounded-none border border-blue-500/20">
                                        <h4 className="text-xs font-medium text-blue-500 tracking-[0.3em] mb-4 font-sans">Location Recon</h4>
                                        <div className="flex items-start gap-4">
                                            <FiMapPin className="text-red-500 mt-1" />
                                            <p className="text-sm font-medium text-slate-300 leading-relaxed">{selectedJob.customerAddress}</p>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <h4 className="text-xs font-medium text-slate-500 tracking-[0.3em] font-sans">Operational Timeline</h4>
                                        <div className="flex gap-4">
                                            <div className="flex-grow p-5 bg-white/[0.03] rounded-none border border-white/5 flex items-center gap-4">
                                                <FiCalendar className="text-slate-500" />
                                                <span className="text-xs font-medium text-slate-300">{selectedJob.date}</span>
                                            </div>
                                            <div className="flex-grow p-5 bg-white/[0.03] rounded-none border border-white/5 flex items-center gap-4">
                                                <FiClock className="text-slate-500" />
                                                <span className="text-xs font-medium text-slate-300">{selectedJob.timeSlot}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-10 bg-black/40 border-t border-white/5">
                                    {selectedJob.status === 'assigned' ? (
                                        <button
                                            onClick={() => updateStatus(selectedJob._id, 'technician_visit')}
                                            className="w-full py-5 bg-blue-600 text-white rounded-none font-medium tracking-[0.3em] text-xs shadow-2xl hover:scale-[1.02] transition-all flex items-center justify-center gap-4"
                                        >
                                            Initialize Arrival Protocol <FiNavigation />
                                        </button>
                                    ) : selectedJob.status === 'technician_visit' ? (
                                        <button
                                            onClick={() => setShowProofUpload(true)}
                                            className="w-full py-5 bg-emerald-600 text-white rounded-none font-medium tracking-[0.3em] text-xs shadow-2xl hover:scale-[1.02] transition-all flex items-center justify-center gap-4"
                                        >
                                            Neutralize Project <FiCheckCircle />
                                        </button>
                                    ) : (
                                        <div className="w-full py-5 bg-white/5 border border-white/10 rounded-none text-slate-500 font-medium tracking-[0.3em] text-xs flex items-center justify-center gap-4">
                                            Mission Success <FiCheck />
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-center p-20 border-2 border-dashed border-white/5 rounded-none">
                                <FiShield size={64} className="text-blue-900/40 mb-6" />
                                <h3 className="text-[18px] font-medium text-slate-700 font-sans">Tactical Control</h3>
                                <p className="text-xs font-medium text-slate-800 mt-2">Select an active mission to engage deployment protocols</p>
                            </div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Completion Proof Modal */}
            <AnimatePresence>
                {showProofUpload && (
                    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowProofUpload(false)} className="absolute inset-0 bg-[#02060C]/95 backdrop-blur-xl" />
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} className="bg-[#050B14] w-full max-w-xl rounded-none border border-white/10 shadow-2xl relative z-10 p-12">
                            <h2 className="text-[28px] font-medium mb-4 text-white font-sans">Visual Evidence</h2>
                            <p className="text-slate-500 text-xs font-medium mb-8">Upload completion proof to verify mission success and system commissioning.</p>

                            <div className="relative group mb-10">
                                <div className="w-full aspect-video rounded-none bg-white/5 border-2 border-dashed border-white/10 flex items-center justify-center overflow-hidden">
                                    {proofImage ? (
                                        <img src={proofImage} alt="Proof" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="text-center">
                                            <FiCamera size={48} className="text-slate-700 mx-auto mb-4" />
                                            <p className="text-xs font-medium text-slate-600">Capture Deployment Proof</p>
                                        </div>
                                    )}
                                </div>
                                <label className="absolute inset-0 cursor-pointer flex items-center justify-center bg-blue-600/20 opacity-0 group- transition-opacity rounded-none">
                                    <input type="file" className="hidden" accept="image/*" onChange={handleProofChange} />
                                </label>
                            </div>

                            <div className="flex gap-4">
                                <button onClick={() => setShowProofUpload(false)} className="flex-grow py-5 bg-white/5 text-slate-500 rounded-none text-xs font-medium">Abort</button>
                                <button
                                    onClick={submitCompletion}
                                    disabled={loading}
                                    className="flex-[2] py-5 bg-emerald-600 text-white rounded-none text-xs font-medium shadow-xl hover:scale-[1.02] transition-all"
                                >
                                    {loading ? 'Transmitting Evidence...' : 'Submit Mission Proof'}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
