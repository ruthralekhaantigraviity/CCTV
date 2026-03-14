import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { FiTrash2, FiAlertCircle, FiX, FiCheck } from 'react-icons/fi';

/**
 * confirmToast - A premium-styled confirmation dialog using toast.custom
 * @param {string} title - The main question or title (e.g., "Delete Employee?")
 * @param {string} message - Secondary message for context
 * @param {function} onConfirm - Callback executed when Confirm is clicked
 * @param {object} options - Optional styling overrides (danger: boolean)
 */
export const confirmToast = (title, message, onConfirm, options = {}) => {
  const isDanger = options.danger !== false;

  toast.custom((t) => (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: 20 }}
      className={`${
        t.visible ? 'animate-enter' : 'animate-leave'
      } max-w-sm w-full bg-slate-900 shadow-2xl overflow-hidden pointer-events-auto flex flex-col`}
    >
      <div className="p-6">
        <div className="flex items-start gap-4">
          <div className={`w-10 h-10 flex items-center justify-center shrink-0 ${isDanger ? 'bg-red-500/10 text-red-500' : 'bg-blue-500/10 text-blue-500'}`}>
            {isDanger ? <FiTrash2 size={20} /> : <FiAlertCircle size={20} />}
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-black text-white uppercase tracking-wider">{title}</h3>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1 leading-relaxed">
              {message || "This action cannot be undone. Please confirm to proceed with the registry update."}
            </p>
          </div>
        </div>

        <div className="flex gap-3 mt-8">
          <button
            onClick={() => toast.dismiss(t.id)}
            className="flex-1 py-3 bg-slate-800 text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] hover:bg-slate-700 transition-all active:scale-95"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              toast.dismiss(t.id);
              onConfirm();
            }}
            className={`flex-1 py-3 text-[9px] font-black text-white uppercase tracking-[0.2em] transition-all active:scale-95 ${
              isDanger ? 'bg-red-600 hover:bg-red-500 shadow-[0_0_20px_rgba(220,38,38,0.2)]' : 'bg-blue-600 hover:bg-blue-500 shadow-[0_0_20px_rgba(37,99,235,0.2)]'
            }`}
          >
            Confirm
          </button>
        </div>
      </div>
      
      {/* Progress line for visual feedback */}
      <motion.div 
        initial={{ width: "100%" }}
        animate={{ width: "0%" }}
        transition={{ duration: 5, ease: "linear" }}
        className={`h-1 ${isDanger ? 'bg-red-500' : 'bg-blue-500'}`}
      />
    </motion.div>
  ), {
    duration: 5000,
    position: 'bottom-right',
  });
};
