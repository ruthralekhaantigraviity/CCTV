import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiTrash2, FiMinus, FiPlus, FiShoppingBag } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import { Link, useNavigate } from 'react-router-dom';

export default function CartDrawer() {
    const { items, isOpen, setIsOpen, removeFromCart, updateQty, totalItems, totalPrice } = useCart();
    const navigate = useNavigate();

    const continueShopping = () => {
        setIsOpen(false);
        navigate('/products');
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsOpen(false)}
                        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60]"
                    />

                    {/* Drawer */}
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 28, stiffness: 300 }}
                        className="fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-[70] flex flex-col"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b border-gray-100">
                            <div className="flex items-center gap-3">
                                <FiShoppingBag size={20} className="text-blue-600" />
                                <h2 className="text-lg font-bold text-slate-900">Your Cart</h2>
                                {totalItems > 0 && (
                                    <span className="bg-blue-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                                        {totalItems}
                                    </span>
                                )}
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-all"
                            >
                                <FiX size={20} />
                            </button>
                        </div>

                        {/* Items */}
                        <div className="flex-grow overflow-y-auto p-6 space-y-4">
                            {items.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-full text-center gap-4">
                                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center text-gray-300">
                                        <FiShoppingBag size={32} />
                                    </div>
                                    <p className="text-gray-500 font-medium">Your cart is empty</p>
                                    <button
                                        onClick={continueShopping}
                                        className="text-blue-600 text-sm font-bold hover:underline"
                                    >
                                        Continue Shopping →
                                    </button>
                                </div>
                            ) : (
                                items.map(item => (
                                    <motion.div
                                        key={item.id}
                                        layout
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, x: 50 }}
                                        className="flex gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100"
                                    >
                                        {/* Product image */}
                                        <div className="w-20 h-20 bg-white rounded-lg border border-gray-100 flex items-center justify-center p-2 flex-shrink-0">
                                            <img src={item.img} alt={item.name} className="w-full h-full object-contain mix-blend-multiply" />
                                        </div>
                                        {/* Info */}
                                        <div className="flex-grow min-w-0">
                                            <p className="font-bold text-slate-800 text-sm leading-snug line-clamp-2">{item.name}</p>
                                            <p className="text-blue-600 font-extrabold text-sm mt-1">₹{(item.price * item.qty).toLocaleString()}</p>
                                            {/* Qty controls */}
                                            <div className="flex items-center gap-2 mt-2">
                                                <button
                                                    onClick={() => updateQty(item.id, item.qty - 1)}
                                                    className="w-7 h-7 flex items-center justify-center bg-white border border-gray-200 rounded-lg text-gray-600 hover:border-blue-400 transition-all"
                                                >
                                                    <FiMinus size={12} />
                                                </button>
                                                <span className="text-sm font-bold w-5 text-center">{item.qty}</span>
                                                <button
                                                    onClick={() => updateQty(item.id, item.qty + 1)}
                                                    className="w-7 h-7 flex items-center justify-center bg-white border border-gray-200 rounded-lg text-gray-600 hover:border-blue-400 transition-all"
                                                >
                                                    <FiPlus size={12} />
                                                </button>
                                                <button
                                                    onClick={() => removeFromCart(item.id)}
                                                    className="ml-auto p-1.5 text-red-400 hover:bg-red-50 rounded-lg transition-all"
                                                >
                                                    <FiTrash2 size={14} />
                                                </button>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))
                            )}
                        </div>

                        {/* Footer */}
                        {items.length > 0 && (
                            <div className="p-6 border-t border-gray-100 space-y-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-slate-600 font-medium">Subtotal</span>
                                    <span className="text-xl font-extrabold text-slate-900">₹{totalPrice.toLocaleString()}</span>
                                </div>
                                <p className="text-xs text-gray-400">Taxes and shipping calculated at checkout</p>
                                <Link
                                    to="/book-technician"
                                    onClick={() => setIsOpen(false)}
                                    className="block w-full bg-blue-600 hover:bg-blue-700 text-white text-center py-4 rounded-xl font-black text-sm uppercase tracking-widest transition-all"
                                >
                                    Proceed to Book →
                                </Link>
                                <button
                                    onClick={continueShopping}
                                    className="block w-full text-center text-sm text-gray-400 hover:text-gray-600 font-medium transition-colors"
                                >
                                    Continue Shopping
                                </button>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
