import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
 FiClock, FiMapPin, FiPhone, FiUser, FiCheckCircle,
 FiAlertCircle, FiTrendingUp, FiLogOut, FiLayout,
 FiBriefcase, FiCalendar, FiMessageSquare, FiSettings,
 FiBell, FiSearch, FiMenu, FiChevronRight, FiEdit2, FiEdit3, FiShield,
 FiArrowRight, FiActivity, FiMail, FiMap, FiFileText
} from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import EmployeeLeave from './employee/EmployeeLeave';

export default function EmployeeDashboard() {
 const { user, logout } = useAuth();
 const navigate = useNavigate();
 const [jobs, setJobs] = useState([]);
 const [loading, setLoading] = useState(true);
 const [activeTab, setActiveTab] = useState('dashboard'); // sidebar tabs
 const [workflowTab, setWorkflowTab] = useState('available'); // inner dashboard tabs
 const [jobImages, setJobImages] = useState({}); // { jobId: base64Image }

 const [ignoredJobs, setIgnoredJobs] = useState(() => {
 const saved = localStorage.getItem('ignoredJobs');
 return saved ? JSON.parse(saved) : [];
 });

 const [attendance, setAttendance] = useState(() => {
 const saved = localStorage.getItem('attendance');
 return saved ? JSON.parse(saved) : { punchIn: null, punchOut: null };
 });

 const [messages, setMessages] = useState([
 { sender: 'HQ', text: 'Team, we have a high-priority installation in Anna Nagar. Please check the Jobs board.', time: '09:12 AM', id: 1 },
 { sender: 'ME', text:"Understood. I'm finishing current maintenance and heading there.", time: '09:45 AM', id: 2 }
 ]);
 const [newMessage, setNewMessage] = useState('');

 const [settings, setSettings] = useState(() => {
 const saved = localStorage.getItem('employeeSettings');
 return saved ? JSON.parse(saved) : {
 notifications: true,
 availability: true,
 autoAccept: false,
 locationTracking: true
 };
 });

 const [serviceFilter, setServiceFilter] = useState('All Services');

 const [isEditingProfile, setIsEditingProfile] = useState(false);
 const [profileForm, setProfileForm] = useState({
 name: '',
 email: '',
 phone: ''
 });

 const { updateUser } = useAuth();

 useEffect(() => {
 localStorage.setItem('ignoredJobs', JSON.stringify(ignoredJobs));
 }, [ignoredJobs]);

 useEffect(() => {
 localStorage.setItem('attendance', JSON.stringify(attendance));
 }, [attendance]);

 useEffect(() => {
 localStorage.setItem('employeeSettings', JSON.stringify(settings));
 }, [settings]);

 useEffect(() => {
 fetchJobs();
 const interval = setInterval(fetchJobs, 5000);

 // Auto punch-in on mount if not already punched in
 if (!attendance.punchIn) {
 const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
 setAttendance(prev => ({ ...prev, punchIn: now }));
 }

 return () => clearInterval(interval);
 }, []);

 const fetchJobs = async () => {
 try {
 const response = await fetch('/api/jobs');
 const data = await response.json();
 if (data.success) {
 setJobs(data.data);
 }
 setLoading(false);
 } catch (error) {
 console.error('Error fetching jobs:', error);
 setLoading(false);
 }
 };

 const handleAcceptJob = async (id) => {
 if (!user?.id) {
 alert('Authentication required to accept jobs.');
 return;
 }

 try {
 const response = await fetch(`/api/jobs/${id}/accept`, {
 method: 'PATCH',
 headers: { 'Content-Type': 'application/json' },
 body: JSON.stringify({ employeeId: user.id })
 });
 const data = await response.json();
 if (data.success) {
 fetchJobs();
 setWorkflowTab('my-jobs');
 } else {
 alert(data.message || 'Someone already took this job.');
 fetchJobs();
 }
 } catch (error) {
 console.error('Error accepting job:', error);
 }
 };

 const handleIgnoreJob = (id) => {
 setIgnoredJobs(prev => [...prev, id]);
 };

 const handleUpdateStatus = async (id, nextStatus) => {
 try {
 const body = { status: nextStatus };
 if (nextStatus === 'completed' && jobImages[id]) {
 body.completionImage = jobImages[id];
 }

 const response = await fetch(`/api/jobs/${id}/status`, {
 method: 'PATCH',
 headers: { 'Content-Type': 'application/json' },
 body: JSON.stringify(body)
 });
 const data = await response.json();
 if (data.success) {
 fetchJobs();
 if (nextStatus === 'completed') {
 setWorkflowTab('completed');
 setJobImages(prev => {
 const next = { ...prev };
 delete next[id];
 return next;
 });
 }
 } else {
 alert(data.message || 'Failed to update job status.');
 }
 } catch (error) {
 console.error('Error updating status:', error);
 alert('A network error occurred while updating the job.');
 }
 };

 const handleImageUpload = (jobId, e) => {
 const file = e.target.files[0];
 if (!file) return;

 // Limit size to 10MB (approx 13.3MB Base64) to stay under MongoDB's 16MB document limit
 if (file.size > 10 * 1024 * 1024) {
 alert('Image is too large. Please select a photo smaller than 10MB.');
 return;
 }

 const reader = new FileReader();
 reader.onloadend = () => {
 setJobImages(prev => ({ ...prev, [jobId]: reader.result }));
 };
 reader.readAsDataURL(file);
 };

 const handleLogout = async () => {
 if (attendance.punchIn && !attendance.punchOut) {
 const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
 const finalAttendance = { ...attendance, punchOut: now };
 setAttendance(finalAttendance);
 localStorage.setItem('attendance', JSON.stringify(finalAttendance));
 }
 await logout();
 navigate('/employee/login');
 };


 const handleSendMessage = (e) => {
 e.preventDefault();
 if (!newMessage.trim()) return;
 const msg = {
 sender: 'ME',
 text: newMessage,
 time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
 id: Date.now()
 };
 setMessages([...messages, msg]);
 setNewMessage('');
 };

 const toggleSetting = (key) => {
 setSettings(prev => ({ ...prev, [key]: !prev[key] }));
 };

 const handleEditToggle = () => {
 if (!isEditingProfile) {
 setProfileForm({
 name: user?.name || '',
 email: user?.email || '',
 phone: user?.phone || ''
 });
 }
 setIsEditingProfile(!isEditingProfile);
 };

 const handleProfileUpdate = async (e) => {
 e.preventDefault();
 try {
 await updateUser(profileForm);
 setIsEditingProfile(false);
 alert('Profile updated successfully!');
 } catch (error) {
 console.error('Error updating profile:', error);
 alert('Failed to update profile.');
 }
 };

 const filteredJobs = jobs.filter(job => {
 const matchesWorkflow =
 (workflowTab === 'available' && job.status === 'pending' && !ignoredJobs.includes(job._id)) ||
 (workflowTab === 'my-jobs' && (job.status === 'accepted' || job.status === 'progress') && job.assignedEmployee?._id === user?.id) ||
 (workflowTab === 'completed' && job.status === 'completed' && job.assignedEmployee?._id === user?.id);

 const matchesSearch = true; // Search removed

 const matchesService = serviceFilter === 'All Services' || job.serviceType === serviceFilter;

 return matchesWorkflow && matchesSearch && matchesService;
 });

 const directoryJobs = jobs.filter(job => {
 const matchesSearch = true; // Search removed
 const matchesService = serviceFilter === 'All Services' || job.serviceType === serviceFilter;
 return matchesSearch && matchesService;
 });

 const renderJobCard = (job) => {
 const isAssignedToMe = user?.id && job.assignedEmployee?._id === user.id;
 const isTakenByOther = job.status !== 'pending' && !isAssignedToMe;

 return (
 <motion.div
 key={job._id}
 layout
 initial={{ opacity: 0, y: 20 }}
 animate={{ opacity: 1, y: 0 }}
 exit={{ opacity: 0, scale: 0.95 }}
 className="bg-white p-8 rounded-none border border-gray-100 transition-all group"
 >
 <div className="flex justify-between items-start mb-8">
 <div className="w-12 h-12 bg-gray-50 rounded-none flex items-center justify-center text-blue-600 group- group- transition-all">
 <FiBriefcase size={24} />
 </div>
 <div className={`px-4 py-1.5 rounded-none text-xs font-semibold ${job.status === 'pending' ? 'bg-red-50 text-red-600' :
 job.status === 'accepted' ? 'bg-green-50 text-green-600' :
 job.status === 'progress' ? 'bg-purple-50 text-purple-600' :
 'bg-blue-50 text-blue-600'
 }`}>
 {isTakenByOther ?`Taken by ${job.assignedEmployee?.name || 'Technician'}` : job.status.replace('_', ' ')}
 </div>
 </div>

 <h3 className="text-[18px] font-semibold text-slate-800 mb-6 font-sans">{job.serviceType}</h3>

 <div className="space-y-4 mb-8">
 <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-none group- border border-transparent group- transition-all">
 <FiUser className="text-blue-500" />
 <div>
 <p className="text-xs text-gray-400 font-semibold mb-0.5">Customer</p>
 <p className="text-sm font-semibold text-slate-800">{job.customerName}</p>
 </div>
 </div>
 {isAssignedToMe && (
 <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-none group- border border-transparent group- transition-all">
 <FiPhone className="text-green-500" />
 <div>
 <p className="text-xs text-gray-400 font-semibold mb-0.5">Phone</p>
 <a href={`tel:${job.customerPhone}`} className="text-sm font-semibold text-[#0a1628] transition-colors">{job.customerPhone}</a>
 </div>
 </div>
 )}
 <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-none group- border border-transparent group- transition-all">
 <FiMapPin className="text-red-500" />
 <div>
 <p className="text-xs text-gray-400 font-semibold mb-0.5">Location</p>
 <p className="text-sm font-semibold text-[#0a1628] line-clamp-1">{job.customerAddress}</p>
 {isAssignedToMe && (
 <a
 href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(job.customerAddress)}`}
 target="_blank"
 rel="noopener noreferrer"
 className="text-xs font-semibold text-blue-600 mt-1 inline-block"
 >
 Open Maps →
 </a>
 )}
 </div>
 </div>
 {isAssignedToMe && job.problemDescription && (
 <div className="flex items-start gap-4 p-4 bg-blue-50/50 rounded-none border border-blue-100 transition-all">
 <FiAlertCircle className="text-blue-500 mt-0.5" />
 <div>
 <p className="text-xs text-gray-400 font-semibold mb-0.5">Problem Details</p>
 <p className="text-xs font-semibold text-[#0a1628] leading-relaxed">{job.problemDescription}</p>
 </div>
 </div>
 )}
 <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-none group- border border-transparent group- transition-all">
 <FiClock className="text-amber-500" />
 <div>
 <p className="text-xs text-gray-400 font-semibold mb-0.5">Appointment</p>
 <p className="text-sm font-semibold text-[#0a1628]">{job.date} | {job.timeSlot}</p>
 </div>
 </div>
 </div>

 <div className="pt-2">
 {job.status === 'pending' && !isTakenByOther && (
 <div className="grid grid-cols-2 gap-3">
 <button
 onClick={() => handleIgnoreJob(job._id)}
 className="py-5 bg-gray-100 text-gray-400 font-semibold rounded-none transition-all text-xs"
 >
 Ignore
 </button>
 <button
 onClick={() => handleAcceptJob(job._id)}
 className="py-5 bg-blue-600 text-white font-semibold rounded-none transition-all text-xs"
 >
 Accept Job
 </button>
 </div>
 )}

 {isTakenByOther && (
 <div className="flex items-center justify-center gap-2 text-gray-400 font-semibold text-xs py-5 bg-gray-50 rounded-none border border-gray-100">
 Already Taken
 </div>
 )}

 {isAssignedToMe && job.status === 'accepted' && (
 <button
 onClick={() => handleUpdateStatus(job._id, 'progress')}
 className="w-full py-5 bg-[#10b981] text-white font-semibold rounded-none transition-all text-xs"
 >
 Enter Progress Stage
 </button>
 )}
 {isAssignedToMe && job.status === 'progress' && (
 <div className="space-y-4">
 {!jobImages[job._id] ? (
 <div className="relative group">
 <input
 type="file"
 accept="image/*"
 onChange={(e) => handleImageUpload(job._id, e)}
 className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
 />
 <div className="w-full py-8 border-2 border-dashed border-blue-100 bg-blue-50/30 rounded-none flex flex-col items-center justify-center gap-2 group- transition-all">
 <div className="w-10 h-10 bg-blue-100 rounded-none flex items-center justify-center text-blue-600">
 <FiArrowRight className="rotate-[-90deg]" />
 </div>
 <p className="text-xs font-semibold text-blue-600">Upload Mission Proof</p>
 </div>
 </div>
 ) : (
 <div className="relative group">
 <img src={jobImages[job._id]} alt="Proof" className="w-full h-32 object-cover border border-gray-100" />
 <button
 onClick={() => setJobImages(prev => {
 const next = { ...prev };
 delete next[job._id];
 return next;
 })}
 className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-none shadow-none opacity-0 group- transition-all"
 >
 <FiAlertCircle />
 </button>
 </div>
 )}
 <button
 onClick={() => handleUpdateStatus(job._id, 'completed')}
 disabled={!jobImages[job._id]}
 className={`w-full py-5 font-semibold rounded-none transition-all text-xs flex items-center justify-center gap-2 ${jobImages[job._id] ? 'bg-[#3b82f6] text-white shadow-none ' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}
 >
 <FiCheckCircle /> Mark Completed
 </button>
 </div>
 )}
 {job.status === 'completed' && (
 <div className="space-y-4">
 {job.completionImage && (
 <img src={job.completionImage} alt="Completion Proof" className="w-full h-32 object-cover border border-gray-100 opacity-60 grayscale" />
 )}
 <div className="flex items-center justify-center gap-2 text-[#10b981] font-semibold text-xs py-5 bg-green-50 rounded-none border border-green-100">
 <FiCheckCircle size={14} /> Mission Successful
 </div>
 </div>
 )}
 </div>
 </motion.div>
 );
 };

 const renderDashboard = () => (
 <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
 {/* Stats Grid */}
 <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
 <div className="bg-sky-50 p-6 rounded-none text-sky-900 border border-sky-100 group hover:scale-[1.02] transition-all cursor-pointer" onClick={() => setWorkflowTab('available')}>
 <div className="flex justify-between items-start mb-4">
 <div className="p-3 bg-sky-100 rounded-none text-sky-600"><FiAlertCircle size={24} /></div>
 <span className="text-xs font-semibold bg-sky-100 text-sky-700 px-3 py-1 rounded-none">New Requests</span>
 </div>
 <p className="text-4xl font-semibold mb-1">{jobs.filter(j => j.status === 'pending').length}</p>
 <p className="text-xs font-semibold opacity-70 flex items-center gap-1 text-sky-600">Immediate attention required <FiChevronRight /></p>
 </div>

 <div className="bg-amber-50 p-6 rounded-none text-amber-900 border border-amber-100 group hover:scale-[1.02] transition-all cursor-pointer" onClick={() => setWorkflowTab('my-jobs')}>
 <div className="flex justify-between items-start mb-4">
 <div className="p-3 bg-amber-100 rounded-none text-amber-600"><FiBriefcase size={24} /></div>
 <span className="text-xs font-semibold bg-amber-100 text-amber-700 px-3 py-1 rounded-none">My Jobs</span>
 </div>
 <p className="text-4xl font-semibold mb-1">{jobs.filter(j => j.status === 'accepted' || j.status === 'progress').length}</p>
 <p className="text-xs font-semibold opacity-70 flex items-center gap-1 text-amber-600">View active assignments <FiChevronRight /></p>
 </div>

 <div className="bg-[#f0fdf4] p-6 rounded-none text-emerald-900 border border-emerald-100 group hover:scale-[1.02] transition-all cursor-pointer" onClick={() => setWorkflowTab('completed')}>
 <div className="flex justify-between items-start mb-4">
 <div className="p-3 bg-emerald-100 rounded-none text-emerald-600"><FiCheckCircle size={24} /></div>
 <span className="text-xs font-semibold bg-emerald-100 text-emerald-700 px-3 py-1 rounded-none">Completed Jobs</span>
 </div>
 <p className="text-4xl font-semibold mb-1">{jobs.filter(j => j.status === 'completed').length}</p>
 <p className="text-xs font-semibold opacity-70 flex items-center gap-1 text-emerald-600">Review work history <FiChevronRight /></p>
 </div>
 </div>

 {/* Workflow Section */}
 <div className="bg-white rounded-none p-8 lg:p-12 border border-blue-50">
 <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
 <div>
 <h2 className="text-[18px] font-semibold mb-1 font-sans">Job Workflow Management</h2>
 <p className="text-gray-400 text-sm font-medium">Manage and track service requests through lifecycle stages.</p>
 </div>

 <div className="flex p-1.5 bg-gray-100 rounded-none">
 {[
 { id: 'available', label: 'Pending' },
 { id: 'my-jobs', label: 'Active' },
 { id: 'completed', label: 'Completed' }
 ].map(tab => (
 <button
 key={tab.id}
 onClick={() => setWorkflowTab(tab.id)}
 className={`px-6 py-3 rounded-none text-xs font-semibold transition-all ${workflowTab === tab.id ? 'bg-[#0a1628] text-white' : 'text-gray-400'}`}
 >
 {tab.label}
 </button>
 ))}
 </div>
 </div>

 <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
 <AnimatePresence mode="popLayout">
 {filteredJobs.length === 0 ? (
 <motion.div
 initial={{ opacity: 0 }}
 animate={{ opacity: 1 }}
 className="col-span-full py-20 text-center bg-gray-50 rounded-none border-2 border-dashed border-gray-200"
 >
 <FiAlertCircle size={48} className="mx-auto text-gray-300 mb-4" />
 <p className="text-gray-400 font-semibold text-xs">Queue focus clear. Check back later.</p>
 </motion.div>
 ) : (
 filteredJobs.map(job => renderJobCard(job))
 )}
 </AnimatePresence>
 </div>
 </div>
 </motion.div>
 );

 const renderJobs = () => (
 <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}>
 <div className="bg-white p-8 rounded-none border border-gray-100">
 <div className="flex justify-between items-center mb-10">
 <h2 className="text-[18px] font-medium text-slate-900 font-sans">Job Directory</h2>
 <div className="flex gap-4">
 <select
 value={serviceFilter}
 onChange={(e) => setServiceFilter(e.target.value)}
 className="bg-gray-50 border border-gray-200 rounded-none px-4 py-2 text-xs font-semibold outline-none focus:border-blue-600 transition-all cursor-pointer"
 >
 <option>All Services</option>
 <option>Installation</option>
 <option>Maintenance</option>
 <option>Repair</option>
 <option>Consultation</option>
 </select>
 </div>
 </div>
 <div className="space-y-6">
 {directoryJobs.length === 0 ? (
 <div className="py-20 text-center bg-gray-50 rounded-none border-2 border-dashed border-gray-200">
 <FiSearch size={48} className="mx-auto text-gray-300 mb-4" />
 <p className="text-gray-400 font-semibold text-xs">No matching jobs found in directory.</p>
 </div>
 ) : (
 directoryJobs.map(job => (
 <div key={job._id} className="flex flex-col md:flex-row items-center justify-between p-6 bg-gray-50 rounded-none transition-all border border-transparent group">
 <div className="flex items-center gap-6 mb-4 md:mb-0">
 <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-none flex items-center justify-center font-semibold">
 #{job._id.slice(-4).toUpperCase()}
 </div>
 <div>
 <p className="font-medium text-[#0a1628]">{job.serviceType}</p>
 <p className="text-xs text-gray-500">{job.customerName} • {job.date}</p>
 </div>
 </div>
 <div className="flex items-center gap-8">
 <div className={`px-4 py-1.5 rounded-none text-xs font-semibold ${job.status === 'pending' ? 'bg-red-50 text-red-600' :
 job.status === 'accepted' ? 'bg-green-50 text-green-600' :
 'bg-blue-50 text-blue-600'
 }`}>
 {job.status.replace('_', ' ')}
 </div>
 <button
 onClick={() => {
 setActiveTab('dashboard');
 if (job.status === 'pending') setWorkflowTab('available');
 else if (job.status === 'completed') setWorkflowTab('completed');
 else setWorkflowTab('my-jobs');
 }}
 className="p-3 bg-white border border-gray-200 rounded-none text-gray-400 transition-all"
 >
 <FiArrowRight />
 </button>
 </div>
 </div>
 ))
 )}
 </div>
 </div>
 </motion.div>
 );


 const renderMessages = () => (
 <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}>
 <div className="bg-white rounded-none border border-gray-100 overflow-hidden flex flex-col h-[600px]">
 <div className="p-8 border-b border-gray-100 flex justify-between items-center">
 <div>
 <h2 className="text-[18px] font-semibold font-sans">Internal Communications</h2>
 <p className="text-xs text-gray-400 font-semibold mt-1">Direct contact with HQ</p>
 </div>
 <div className="w-3 h-3 bg-green-500 rounded-none animate-pulse" />
 </div>
 <div className="flex-grow p-8 space-y-6 overflow-y-auto bg-gray-50/50">
 {messages.map((msg) => (
 <div key={msg.id} className={`flex gap-4 max-w-[80%] ${msg.sender === 'ME' ? 'ml-auto flex-row-reverse' : ''}`}>
 <div className={`w-10 h-10 rounded-none flex items-center justify-center text-white flex-shrink-0 font-semibold ${msg.sender === 'ME' ? 'bg-[#0a1628]' : 'bg-blue-600'}`}>
 {msg.sender}
 </div>
 <div className={`p-5 rounded-none border ${msg.sender === 'ME' ? 'bg-[#0a1628] text-white rounded-tr-none border-[#0a1628]' : 'bg-white text-gray-700 rounded-tl-none border-gray-100'}`}>
 <p className="text-sm font-medium">{msg.text}</p>
 <p className={`text-xs font-semibold mt-2 ${msg.sender === 'ME' ? 'opacity-40' : 'text-gray-400'}`}>{msg.time}</p>
 </div>
 </div>
 ))}
 </div>
 <form onSubmit={handleSendMessage} className="p-6 bg-white border-t border-gray-100 flex gap-4">
 <input
 type="text"
 value={newMessage}
 onChange={(e) => setNewMessage(e.target.value)}
 placeholder="Type a message..."
 className="flex-grow bg-gray-50 border border-gray-200 rounded-none px-6 py-4 text-sm font-medium outline-none focus:border-blue-600 transition-all font-sans"
 />
 <button type="submit" className="p-4 bg-blue-600 text-white rounded-none transition-all shadow-none">
 <FiMessageSquare />
 </button>
 </form>
 </div>
 </motion.div>
 );

 const renderProfile = () => (
 <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
 <div className="bg-white p-8 rounded-none border border-gray-100 shadow-none">
 <div className="flex flex-col md:flex-row items-center gap-8 mb-12">
                 <div className="relative">
                    <div className="w-40 h-40 rounded-none border-2 border-blue-50 bg-blue-50 flex items-center justify-center shadow-none">
                        <FiUser size={80} className="text-blue-300" />
                    </div>
                    <button
                        onClick={handleEditToggle}
                        className="absolute bottom-1 right-1 w-11 h-11 rounded-none flex items-center justify-center bg-white text-blue-500 border border-blue-100 shadow-none hover:scale-110 transition-all z-10"
                    >
                        {isEditingProfile ? <FiChevronRight className="rotate-90" /> : <FiEdit2 size={18} />}
                    </button>
                </div>
 <div className="text-center md:text-left flex-grow">
 {!isEditingProfile ? (
 <>
 <div className="flex items-center justify-center md:justify-start gap-4 mb-2">
 <h2 className="text-4xl font-semibold text-[#0a1628] font-sans">{user?.name}</h2>
 <div className="bg-green-100 text-green-600 px-3 py-1 rounded-none text-xs font-semibold">Active</div>
 </div>
 <p className="text-blue-600 font-semibold text-xs mb-6">Senior Security Technician</p>
 </>
 ) : (
 <div className="space-y-4">
 <h2 className="text-[18px] font-semibold text-[#0a1628] mb-4 font-sans">Edit Profile Information</h2>
 <div className="grid md:grid-cols-2 gap-4">
 <div className="space-y-2">
 <label className="text-xs font-semibold text-gray-400 px-2">Full Name</label>
 <input
 type="text"
 value={profileForm.name}
 onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
 className="w-full bg-gray-50 border border-gray-100 rounded-none px-6 py-4 outline-none focus:border-blue-600 font-semibold text-[14px]"
 />
 </div>
 <div className="space-y-2">
 <label className="text-xs font-semibold text-gray-400 px-2">Professional Email</label>
 <input
 type="email"
 value={profileForm.email}
 onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
 className="w-full bg-gray-50 border border-gray-100 rounded-none px-6 py-4 outline-none focus:border-blue-600 font-semibold text-[14px]"
 />
 </div>
 <div className="space-y-2">
 <label className="text-xs font-semibold text-gray-400 px-2">Contact Number</label>
 <input
 type="text"
 value={profileForm.phone}
 onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
 className="w-full bg-gray-50 border border-gray-100 rounded-none px-6 py-4 outline-none focus:border-blue-600 font-semibold text-[14px]"
 />
 </div>
 <div className="flex items-end pb-1">
 <button
 onClick={handleProfileUpdate}
 className="w-full bg-[#10b981] text-white font-semibold rounded-none py-4 text-xs shadow-none transition-all"
 >
 Save Changes
 </button>
 </div>
 </div>
 </div>
 )}
 {!isEditingProfile && (
 <div className="flex flex-wrap justify-center md:justify-start gap-4">
 <div className="bg-gray-50 px-5 py-3 rounded-none flex items-center gap-3">
 <FiStar className="text-amber-500" fill="currentColor" />
 <p className="font-semibold text-[14px] text-[#0a1628]">4.9 <span className="text-gray-400 font-semibold ml-1">Rating</span></p>
 </div>
 <div className="bg-gray-50 px-5 py-3 rounded-none flex items-center gap-3">
 <FiActivity className="text-blue-500" />
 <p className="font-semibold text-[14px] text-[#0a1628]">128 <span className="text-gray-400 font-semibold ml-1">Jobs</span></p>
 </div>
 </div>
 )}
 </div>
 </div>

 {!isEditingProfile && (
 <div className="grid md:grid-cols-2 gap-8 pt-10 border-t border-gray-50">
 <div className="space-y-6">
 <div className="p-6 bg-gray-50 rounded-none group border border-transparent transition-all">
 <p className="text-xs text-gray-400 font-semibold mb-1">Office Email</p>
 <p className="font-semibold text-[#0a1628] flex items-center gap-3"><FiMail /> {user?.email}</p>
 </div>
 <div className="p-6 bg-gray-50 rounded-none group border border-transparent transition-all">
 <p className="text-xs text-gray-400 font-semibold mb-1">Contact Number</p>
 <p className="font-semibold text-[#0a1628] flex items-center gap-3"><FiPhone /> {user?.phone}</p>
 </div>
 </div>
 <div className="space-y-6">
 <div className="p-6 bg-gray-50 rounded-none group border border-transparent transition-all">
 <p className="text-xs text-gray-400 font-semibold mb-1">Base Location</p>
 <p className="font-semibold text-[#0a1628] flex items-center gap-3"><FiMap /> Chennai HQ</p>
 </div>
 <div className="p-6 bg-gray-50 rounded-none group border border-transparent transition-all">
 <p className="text-xs text-gray-400 font-semibold mb-1">Access Level</p>
 <p className="font-semibold text-blue-600 flex items-center gap-3 r text-xs"><FiShield /> Field Agent Elite</p>
 </div>
 </div>
 </div>
 )}
 </div>
 </motion.div>
 );

 const renderSettings = () => (
 <motion.div initial={{ opacity: 0, scale: 1.05 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}>
 <div className="bg-white p-8 rounded-none border border-gray-100 shadow-none">
 <h2 className="text-[18px] font-semibold mb-10 text-[#0a1628] font-sans">System Preferences</h2>
 <div className="space-y-8">
 {[
 { id: 'notifications', title: 'Push Notifications', desc: 'Get real-time updates for new job broadcasts.' },
 { id: 'availability', title: 'Availability Status', desc: 'Control your visibility for immediate assignments.' },
 { id: 'autoAccept', title: 'Auto-Accept High Priority', desc: 'Automatically accept jobs from premium clients.' },
 { id: 'locationTracking', title: 'Location Tracking', desc: 'Enable for optimized routing to service sites.' }
 ].map((s) => (
 <div key={s.id} className="flex items-center justify-between p-6 bg-gray-50 rounded-none group border border-transparent transition-all">
 <div>
 <p className="font-semibold text-[#0a1628] mb-1">{s.title}</p>
 <p className="text-xs text-gray-400 font-semibold">{s.desc}</p>
 </div>
 <div
 onClick={() => toggleSetting(s.id)}
 className={`w-14 h-8 rounded-full p-1.5 transition-all cursor-pointer ${settings[s.id] ? 'bg-blue-600' : 'bg-gray-200'}`}
 >
 <div className={`w-5 h-5 bg-white rounded-full transition-transform ${settings[s.id] ? 'translate-x-6' : 'translate-x-0'}`} />
 </div>
 </div>
 ))}
 <div className="pt-10">
 <button className="px-6 py-2.5 bg-blue-600 text-white font-semibold rounded-none text-xs transition-all">
 Save System Configuration
 </button>
 </div>
 </div>
 </div>
 </motion.div>
 );

 const renderActiveTab = () => {
 switch (activeTab) {
 case 'dashboard': return renderDashboard();
 case 'jobs': return renderJobs();
 case 'messages': return renderMessages();
 case 'profile': return renderProfile();
 case 'settings': return renderSettings();
 case 'leave': return <EmployeeLeave />;
 default: return renderDashboard();
 }
 };

 if (loading) return (
 <div className="h-screen w-full flex items-center justify-center bg-[#f0f4f8] portal-theme">
 <div className="flex flex-col items-center gap-4">
 <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-none animate-spin"></div>
 <p className="text-blue-900 font-semibold text-xs">Synchronizing Core...</p>
 </div>
 </div>
 );

 return (
 <div className="flex min-h-screen bg-gray-50 font-sans text-slate-900 admin-theme">

 {/* Sidebar (Matched to Customer Dashboard) */}
 <aside className="w-24 lg:w-72 bg-white border-r border-gray-100 flex flex-col transition-all duration-300 z-20">
 <div className="p-8 mb-4">
 <div className="flex flex-col">
 <span className="font-semibold text-[18px] text-[#0f172a] orbitron">SecureVision</span>
 <span className="text-xs font-semibold text-blue-600">Cctv Solutions</span>
 </div>
 </div>

 <nav className="flex-grow px-4 space-y-1">
 <p className="text-xs font-medium text-slate-400 pl-4 mb-4 mt-8">Overview</p>
 {[
 { id: 'dashboard', icon: FiLayout, label: 'Dashboard' },
 { id: 'jobs', icon: FiBriefcase, label: 'Jobs' },
 { id: 'messages', icon: FiMessageSquare, label: 'Messages' },
 { id: 'leave', icon: FiFileText, label: 'Leave' },
 { id: 'profile', icon: FiUser, label: 'Profile' },
 { id: 'settings', icon: FiSettings, label: 'Settings' },
 ].map((item) => (
 <button
 key={item.id}
 onClick={() => setActiveTab(item.id)}
 className={`w-full flex items-center gap-4 px-4 py-3 rounded-none transition-all group ${activeTab === item.id ? 'bg-blue-50 text-blue-600' : 'text-slate-500 '}`}
 >
 <item.icon size={18} className={activeTab === item.id ? 'text-[#2563eb]' : 'text-[#94a3b8] group-hover:text-[#0f172a]'} />
 <span className="hidden lg:block font-semibold text-[14px]">{item.label}</span>
 </button>
 ))}
 </nav>

 <div className="p-6 mt-auto border-t border-gray-100">
 <button
 onClick={handleLogout}
 className="w-full flex items-center justify-center lg:justify-start gap-4 px-4 py-3 text-red-500 font-semibold text-[14px] rounded-none transition-all group"
 >
 <FiLogOut size={18} className="group-hover:translate-x-1 transition-transform" />
 <span className="hidden lg:block">Logout</span>
 </button>
 </div>
 </aside>

 {/* Main Content Area */}
 <div className="flex-grow flex flex-col bg-white">
 {/* Top Header */}
 <header className="h-20 bg-white border-b border-gray-100 px-6 lg:px-12 flex items-center justify-between sticky top-0 z-10">
 <div className="flex items-center gap-6">
 <div className="lg:hidden p-3 bg-white border border-gray-200 rounded-none text-gray-500">
 <FiMenu size={20} />
 </div>
 </div>
 <div className="flex items-center gap-6">
 <div className="flex items-center gap-4 border-l border-gray-100 pl-6 ml-2">
 <button className="p-3.5 bg-white border border-gray-200 rounded-none text-gray-500 transition-all relative group">
 <FiBell size={20} className="group-hover:rotate-12 transition-transform" />
 <span className="absolute top-3 right-3 w-2.5 h-2.5 bg-red-500 rounded-none border-2 border-white"></span>
 </button>
 <div className="flex items-center gap-3 cursor-pointer group" onClick={() => setActiveTab('profile')}>
 <div className="text-right hidden sm:block">
 <div className="flex items-center justify-end gap-2 mb-0.5">
 <span className="w-2 h-2 bg-green-500 rounded-none animate-pulse"></span>
 <span className="text-xs font-medium text-green-600">Present</span>
 </div>
 <p className="text-xs font-medium text-slate-800">{user?.name}</p>
 <p className="text-xs text-blue-500 font-medium">Technician 01</p>
 </div>
 <div className="w-12 h-12 bg-gray-100 rounded-none overflow-hidden border-2 border-white group- transition-transform">
 <img src={`https://ui-avatars.com/api/?name=${user?.name || 'T'}&background=3b82f6&color=fff`} alt="Profile" />
 </div>
 </div>
 </div>
 </div>
 </header>

 {/* Sub-page Content */}
 <main className="p-6 lg:p-12 transition-all duration-300 flex-grow">
 <AnimatePresence mode="wait">
 {renderActiveTab()}
 </AnimatePresence>
 </main>
 </div>
 </div>
 );
}

// Extra icons needed for profile
function FiStar(props) {
 return (
 <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg" {...props}>
 <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
 </svg>
 );
}
