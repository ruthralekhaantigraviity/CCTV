import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMessageCircle, FiX, FiSend, FiSun, FiMoon } from 'react-icons/fi';
import { useTheme } from '../context/ThemeContext';

export default function FloatingWidgets() {
    const { theme, toggleTheme } = useTheme();
    const isDark = theme === 'dark';
    const [isOpen, setIsOpen] = useState(false);
    const [message, setMessage] = useState('');
    const [chatHistory, setChatHistory] = useState([
        { role: 'ai', content: 'Hello! I am your SecureVision AI assistant. How can I help you with your security needs today?' }
    ]);

    const handleSend = (e) => {
        e.preventDefault();
        if (!message.trim()) return;

        const newHistory = [...chatHistory, { role: 'user', content: message }];
        setChatHistory(newHistory);
        setMessage('');

        // Mock AI response
        setTimeout(() => {
            setChatHistory(prev => [...prev, {
                role: 'ai',
                content: "Thank you for reaching out! A security expert will review your message about '" + message + "' and get back to you shortly. For immediate assistance, feel free to call us at +1 (800) 123-4567."
            }]);
        }, 1000);
    };

    return (
        <div className="fixed bottom-6 right-6 z-[9999] flex flex-col items-end gap-4">
            {/* Chat Window */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95, transformOrigin: 'bottom right' }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        className="w-[350px] max-w-[calc(100vw-48px)] h-[500px] max-h-[calc(100vh-120px)] rounded-2xl shadow-2xl flex flex-col overflow-hidden border"
                        style={{
                            background: isDark ? '#111827' : '#ffffff',
                            borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'
                        }}
                    >
                        {/* Header */}
                        <div className="p-4 bg-blue-600 text-white flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                                    <FiMessageCircle size={20} />
                                </div>
                                <div>
                                    <p className="font-bold">SecureVision AI</p>
                                    <p className="text-[10px] opacity-80 uppercase tracking-widest font-bold">Online</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="p-2 hover:bg-white/10 rounded-full transition-colors"
                            >
                                <FiX size={20} />
                            </button>
                        </div>

                        {/* Messages */}
                        <div className="flex-grow overflow-y-auto p-4 space-y-4 flex flex-col">
                            {chatHistory.map((chat, i) => (
                                <div
                                    key={i}
                                    className={`max-w-[80%] p-3 rounded-2xl text-sm ${chat.role === 'ai'
                                            ? 'self-start bg-blue-500/10 border border-blue-500/20'
                                            : 'self-end bg-blue-600 text-white'
                                        }`}
                                    style={{
                                        color: chat.role === 'ai' ? (isDark ? '#e5e7eb' : '#374151') : '#ffffff'
                                    }}
                                >
                                    {chat.content}
                                </div>
                            ))}
                        </div>

                        {/* Input */}
                        <form onSubmit={handleSend} className="p-4 border-t" style={{ borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }}>
                            <div className="relative">
                                <input
                                    type="text"
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    placeholder="Type your message..."
                                    className="w-full py-3 pl-4 pr-12 rounded-xl text-sm outline-none border transition-all"
                                    style={{
                                        background: isDark ? 'rgba(255,255,255,0.05)' : '#f9fafb',
                                        borderColor: isDark ? 'rgba(255,255,255,0.1)' : '#e5e7eb',
                                        color: isDark ? '#ffffff' : '#000000'
                                    }}
                                />
                                <button
                                    type="submit"
                                    className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-blue-600 text-white rounded-lg flex items-center justify-center hover:bg-blue-700 transition-colors"
                                >
                                    <FiSend size={14} />
                                </button>
                            </div>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Buttons Container */}
            <div className="flex flex-col gap-3">
                {/* Theme Toggle Button */}
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={toggleTheme}
                    className="w-12 h-12 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 border"
                    style={{
                        background: isDark ? '#1f2937' : '#ffffff',
                        borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
                        color: isDark ? '#fbbf24' : '#2563eb'
                    }}
                    title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                >
                    {isDark ? <FiSun size={20} /> : <FiMoon size={20} />}
                </motion.button>

                {/* Chat Trigger Button */}
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsOpen(!isOpen)}
                    className="w-14 h-14 rounded-full bg-blue-600 text-white shadow-xl flex items-center justify-center hover:bg-blue-700 transition-all duration-300 relative group"
                >
                    {isOpen ? <FiX size={24} /> : <FiMessageCircle size={24} />}
                    <span className="absolute right-full mr-4 bg-gray-900 text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow-xl border border-white/10">
                        Chat with AI
                    </span>
                    {!isOpen && (
                        <span className="absolute top-0 right-0 w-4 h-4 bg-green-500 border-2 border-white dark:border-gray-900 rounded-full"></span>
                    )}
                </motion.button>
            </div>
        </div>
    );
}
