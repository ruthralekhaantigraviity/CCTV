import { motion } from 'framer-motion';

const pages = {
    employees: { title: 'Personnel Directory', subtitle: 'Fleet Member Management' },
    customers: { title: 'Client Intelligence', subtitle: 'SecureVision User Base' },
    reports: { title: 'System Analytics', subtitle: 'Performance Intelligence Reports' },
    settings: { title: 'Control Center', subtitle: 'Global System Configurations' },
};

function PlaceholderPage({ type }) {
    const { title, subtitle } = pages[type];
    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div>
                <h1 className="text-3xl font-black text-slate-800 uppercase tracking-tighter">{title}</h1>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.4rem] mt-2">{subtitle}</p>
            </div>
            <div className="bg-white  border border-slate-100  p-20 flex flex-col items-center justify-center text-center">
                <div className="w-20 h-20 bg-slate-50  flex items-center justify-center mb-6 border border-slate-100 font-black text-slate-200 text-3xl">
                    !
                </div>
                <h2 className="text-xl font-black text-slate-800 uppercase tracking-tighter">Module Initializing</h2>
                <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mt-2 max-w-sm leading-relaxed">
                    This advanced intelligence module is currently being calibrated for SecureVision integration.
                </p>
                <button className="mt-10 px-8 py-4 bg-[#B0C4DE] text-white  font-black uppercase tracking-widest text-[10px]">
                    Check Sync Status
                </button>
            </div>
        </div>
    );
}

export const AdminEmployees = () => <PlaceholderPage type="employees" />;
export const AdminCustomers = () => <PlaceholderPage type="customers" />;
export const AdminReports = () => <PlaceholderPage type="reports" />;
export const AdminSettings = () => <PlaceholderPage type="settings" />;
