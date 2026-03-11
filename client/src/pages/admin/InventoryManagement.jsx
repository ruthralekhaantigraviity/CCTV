import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiBox, FiAlertCircle, FiPlusCircle, FiSearch, FiEdit2, FiTrash2, FiPackage } from 'react-icons/fi';
import axios from 'axios';

export default function InventoryManagement() {
 const [products, setProducts] = useState([]);
 const [loading, setLoading] = useState(true);
 const [search, setSearch] = useState('');
 const [showAddModal, setShowAddModal] = useState(false);
 const [newProduct, setNewProduct] = useState({ name: '', category: '', price: '', quantity: '', description: '' });
 const [editProduct, setEditProduct] = useState(null);

 useEffect(() => { fetchProducts(); }, []);

 const fetchProducts = async () => {
 try {
 const token = localStorage.getItem('token');
 const res = await axios.get('/api/products', { headers: { Authorization: `Bearer ${token}` } });
 setProducts(res.data.data || []);
 } catch (err) {
 console.error('Failed to fetch products');
 } finally {
 setLoading(false);
 }
 };

 const handleAddProduct = async () => {
 try {
 const token = localStorage.getItem('token');
 await axios.post('/api/products', newProduct, { headers: { Authorization: `Bearer ${token}` } });
 setNewProduct({ name: '', category: '', price: '', quantity: '', description: '' });
 setShowAddModal(false);
 fetchProducts();
 } catch (err) {
 console.error('Failed to add product');
 }
 };

 const handleDelete = async (id) => {
 if (!window.confirm('Delete this product?')) return;
 try {
 const token = localStorage.getItem('token');
 await axios.delete(`/api/products/${id}`, { headers: { Authorization: `Bearer ${token}` } });
 fetchProducts();
 } catch (err) {
 console.error('Failed to delete product');
 }
 };

 const filtered = products.filter(p =>
 p.name?.toLowerCase().includes(search.toLowerCase()) ||
 p.category?.toLowerCase().includes(search.toLowerCase())
 );

 const totalValue = products.reduce((acc, p) => acc + (p.price * p.quantity || 0), 0);
 const lowStock = products.filter(p => p.quantity <= 5).length;

 const stats = [
 { label: 'Total Products', value: products.length, icon: FiBox, color: 'blue' },
 { label: 'Low Stock', value: lowStock, icon: FiAlertCircle, color: 'red' },
 { label: 'In Stock', value: products.filter(p => p.quantity > 5).length, icon: FiPackage, color: 'emerald' },
 { label: 'Total Value', value: `₹${(totalValue / 1000).toFixed(0)}K`, icon: FiBox, color: 'indigo' },
 ];

 if (loading) return (
 <div className="flex items-center justify-center h-64">
 <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
 </div>
 );

 return (
 <div className="space-y-8">
 {/* Header */}
 <div>
 <h1 className="text-3xl font-black text-slate-900 tracking-tighter">Products & Inventory</h1>
 <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1">CCTV Equipment Registry</p>
 </div>

 {/* Stats */}
 <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
 {stats.map((s, i) => (
 <motion.div key={s.label} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
 className="bg-white p-5 border border-gray-100 flex items-center gap-4"
 >
 <div className={`w-12 h-12 flex items-center justify-center ${s.color === 'blue' ? 'bg-blue-50 text-blue-600' :
 s.color === 'red' ? 'bg-red-50 text-red-500' :
 s.color === 'emerald' ? 'bg-emerald-50 text-emerald-600' :
 'bg-indigo-50 text-indigo-600'}`}>
 <s.icon size={22} />
 </div>
 <div>
 <p className="text-2xl font-black text-slate-800">{s.value}</p>
 <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{s.label}</p>
 </div>
 </motion.div>
 ))}
 </div>

 {/* Search */}
 <div className="relative">
 <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
 <input
 type="text"
 placeholder="Search by product name or category..."
 value={search}
 onChange={e => setSearch(e.target.value)}
 className="w-full pl-10 pr-4 py-3 bg-white border border-gray-100 text-sm text-slate-700 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-100 "
 />
 </div>

 {/* Table */}
 <div className="bg-white border border-gray-100 overflow-hidden">
 <div className="overflow-x-auto">
 <table className="w-full text-left">
 <thead>
 <tr className="border-b border-gray-100 bg-gray-50/60">
 {['Product', 'Category', 'Price', 'Qty', 'Stock Status', 'Actions'].map(col => (
 <th key={col} className="px-6 py-4 text-[9px] font-black uppercase tracking-widest text-slate-400">{col}</th>
 ))}
 </tr>
 </thead>
 <tbody className="divide-y divide-gray-50">
 {filtered.length === 0 ? (
 <tr>
 <td colSpan="6" className="py-20 text-center">
 <FiBox className="mx-auto text-slate-200 mb-3" size={40} />
 <p className="text-xs font-black text-slate-300 uppercase tracking-widest">No products in inventory</p>
 </td>
 </tr>
 ) : filtered.map((product, idx) => (
 <motion.tr key={product._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: idx * 0.03 }}
 className=" transition-colors group"
 >
 <td className="px-6 py-5">
 <div className="flex items-center gap-3">
 <div className="w-10 h-10 bg-slate-900 flex items-center justify-center text-white">
 <FiCamera size={18} />
 </div>
 <div>
 <p className="font-black text-slate-800 text-sm">{product.name}</p>
 <p className="text-[10px] text-slate-400">{product.description?.slice(0, 30)}...</p>
 </div>
 </div>
 </td>
 <td className="px-6 py-5">
 <span className="px-3 py-1 bg-slate-50 text-slate-600 text-[10px] font-black uppercase tracking-wide border border-gray-100">
 {product.category}
 </span>
 </td>
 <td className="px-6 py-5">
 <p className="font-black text-slate-800">₹{product.price?.toLocaleString()}</p>
 </td>
 <td className="px-6 py-5">
 <p className="font-black text-slate-800">{product.quantity}</p>
 </td>
 <td className="px-6 py-5">
 {product.quantity <= 5 ? (
 <div className="flex items-center gap-2">
 <div className="w-2 h-2 rounded-full bg-red-500" />
 <span className="text-[10px] font-black text-red-500 uppercase tracking-wide">Low Stock</span>
 </div>
 ) : (
 <div className="flex items-center gap-2">
 <div className="w-2 h-2 rounded-full bg-emerald-500" />
 <span className="text-[10px] font-black text-emerald-600 uppercase tracking-wide">In Stock</span>
 </div>
 )}
 </td>
 <td className="px-6 py-5">
 <div className="flex gap-2 opacity-0 group- transition-all">
 <button className="p-2 bg-blue-50 text-blue-600 transition-all">
 <FiEdit2 size={14} />
 </button>
 <button onClick={() => handleDelete(product._id)} className="p-2 bg-red-50 text-red-500 transition-all">
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

 {/* Add Modal */}
 {showAddModal && (
 <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50" onClick={() => setShowAddModal(false)}>
 <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
 className="bg-white p-10 w-full max-w-lg" onClick={e => e.stopPropagation()}
 >
 <h2 className="text-xl font-black text-slate-900 mb-1">Add New Product</h2>
 <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-8">CCTV Equipment Registry</p>
 <div className="space-y-4">
 {[
 { key: 'name', label: 'Product Name', placeholder: 'e.g. Bullet Pro X1' },
 { key: 'category', label: 'Category', placeholder: 'e.g. Outdoor Camera' },
 { key: 'price', label: 'Price (₹)', placeholder: '0' },
 { key: 'quantity', label: 'Quantity', placeholder: '0' },
 { key: 'description', label: 'Description', placeholder: 'Short description...' }
 ].map(field => (
 <div key={field.key}>
 <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1">{field.label}</label>
 <input
 type="text"
 placeholder={field.placeholder}
 value={newProduct[field.key]}
 onChange={e => setNewProduct({ ...newProduct, [field.key]: e.target.value })}
 className="w-full px-4 py-3 border border-gray-100 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-100 bg-gray-50"
 />
 </div>
 ))}
 </div>
 <div className="flex gap-3 mt-8">
 <button onClick={() => setShowAddModal(false)} className="flex-1 py-3 border border-gray-200 text-sm font-bold text-slate-500 ">Cancel</button>
 <button onClick={handleAddProduct} className="flex-1 py-3 bg-blue-600 text-white text-sm font-black ">Add Product</button>
 </div>
 </motion.div>
 </div>
 )}
 </div>
 );
}
