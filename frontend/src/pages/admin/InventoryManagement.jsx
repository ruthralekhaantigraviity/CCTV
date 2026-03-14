import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiBox, FiAlertCircle, FiPlusCircle, FiSearch, FiEdit2, FiTrash2, FiPackage, FiCamera } from 'react-icons/fi';
import axios from 'axios';
import toast from 'react-hot-toast';
import { confirmToast } from '../../utils/confirmToast';

export default function InventoryManagement() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [showAddModal, setShowAddModal] = useState(false);
    const [editProduct, setEditProduct] = useState(null);
    const [newProduct, setNewProduct] = useState({ 
        name: '', 
        category: '', 
        price: '', 
        quantity: '', 
        sku: '', 
        brand: '', 
        description: '',
        image: null,
        imagePreview: null
    });

    useEffect(() => { fetchProducts(); }, []);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setNewProduct(prev => ({
                    ...prev,
                    image: file,
                    imagePreview: reader.result
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    const fetchProducts = async () => {
        try {
            const res = await axios.get('/api/products');
            setProducts(res.data.data || []);
        } catch (err) {
            toast.error('Failed to fetch products');
        } finally {
            setLoading(false);
        }
    };

    const handleSaveProduct = async () => {
        try {
            const { image, ...restOfNewProduct } = newProduct;
            const payload = { 
                ...restOfNewProduct, 
                stockQuantity: parseInt(newProduct.quantity) || 0,
                price: parseFloat(newProduct.price) || 0
            };
            
            if (editProduct) {
                await axios.put(`/api/products/${editProduct._id}`, payload);
                toast.success('Product updated successfully');
            } else {
                await axios.post('/api/products', payload);
                toast.success('Product added successfully');
            }

            setNewProduct({ name: '', category: '', price: '', quantity: '', sku: '', brand: '', description: '' });
            setShowAddModal(false);
            setEditProduct(null);
            fetchProducts();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to save product');
        }
    };

    const handleDelete = async (id) => {
        confirmToast(
            'Delete Product?',
            'Are you sure you want to remove this equipment from the registry? Inventory value will be updated.',
            async () => {
                try {
                    await axios.delete(`/api/products/${id}`);
                    toast.success('Product deleted');
                    fetchProducts();
                } catch (err) {
                    toast.error('Failed to delete product');
                }
            }
        );
    };

    const filtered = products.filter(p =>
        p.name?.toLowerCase().includes(search.toLowerCase()) ||
        p.category?.toLowerCase().includes(search.toLowerCase()) ||
        p.sku?.toLowerCase().includes(search.toLowerCase())
    );

    const totalValue = products.reduce((acc, p) => acc + (p.price * (p.stockQuantity || p.quantity) || 0), 0);
    const lowStock = products.filter(p => (p.stockQuantity || p.quantity) <= 5).length;

    const stats = [
        { label: 'Total Products', value: products.length, icon: FiBox, color: 'blue' },
        { label: 'Low Stock', value: lowStock, icon: FiAlertCircle, color: 'red' },
        { label: 'In Stock', value: products.filter(p => (p.stockQuantity || p.quantity) > 5).length, icon: FiPackage, color: 'emerald' },
        { label: 'Total Value', value: `₹${(totalValue / 1000).toFixed(1)}K`, icon: FiBox, color: 'indigo' },
    ];

    if (loading) return (
        <div className="flex items-center justify-center h-64">
            <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        </div>
    );

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tighter">Products & Inventory</h1>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1">CCTV Equipment Registry</p>
                </div>
                <button
                    onClick={() => { 
                        setEditProduct(null); 
                        setNewProduct({ name: '', category: '', price: '', quantity: '', sku: '', brand: '', description: '', image: null, imagePreview: null }); 
                        setShowAddModal(true); 
                    }}
                    className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white font-black text-xs uppercase tracking-widest transition-all active:scale-[0.98]"
                >
                    <FiPlusCircle size={16} /> Add New Product
                </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((s, i) => (
                    <motion.div key={s.label} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
                        className="bg-white p-5 border border-gray-100 flex items-center gap-4"
                    >
                        <div className={`w-12 h-12 flex items-center justify-center ${
                            s.color === 'blue' ? 'bg-blue-50 text-blue-600' :
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
                    placeholder="Search by product name, category, or SKU..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-white border border-gray-100 text-sm text-slate-700 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-100"
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
                                    className="transition-colors group hover:bg-slate-50/50"
                                >
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-gray-50 flex items-center justify-center text-slate-300 border border-gray-100 overflow-hidden">
                                                {product.image ? (
                                                    <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                                                ) : (
                                                    <FiCamera size={18} />
                                                )}
                                            </div>
                                            <div>
                                                <p className="font-black text-slate-800 text-sm">{product.name}</p>
                                                <p className="text-[10px] text-slate-400 tracking-tight">{product.sku} • {product.brand}</p>
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
                                        <p className="font-black text-slate-800">{product.stockQuantity || product.quantity}</p>
                                    </td>
                                    <td className="px-6 py-5">
                                        {(product.stockQuantity || product.quantity) <= 5 ? (
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
                                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
                                            <button 
                                                onClick={() => {
                                                    setEditProduct(product);
                                                    setNewProduct({
                                                        name: product.name,
                                                        category: product.category,
                                                        price: product.price,
                                                        status: product.status,
                                                        quantity: product.stockQuantity || product.quantity,
                                                        sku: product.sku || '',
                                                        brand: product.brand || '',
                                                        description: product.description || '',
                                                        image: null,
                                                        imagePreview: product.imageUrl || null
                                                    });
                                                    setShowAddModal(true);
                                                }}
                                                className="p-2 bg-blue-50 text-blue-600 transition-all"
                                            >
                                                <FiEdit2 size={14} />
                                            </button>
                                            <button onClick={() => handleDelete(product._id)} className="p-2 bg-red-50 text-red-500 transition-all hover:bg-red-100">
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

            {/* Add/Edit Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setShowAddModal(false)}>
                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                        className="bg-white p-8 md:p-10 w-full max-w-xl shadow-2xl overflow-y-auto max-h-[90vh]" onClick={e => e.stopPropagation()}
                    >
                        <h2 className="text-2xl font-black text-slate-900 mb-1">{editProduct ? 'Edit Product' : 'Add New Product'}</h2>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-8">SecureVision Equipment Registry</p>
                        
                        {/* Image Upload Box */}
                        <div className="mb-8">
                            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-3">Product Visual Identity</label>
                            <div 
                                onClick={() => document.getElementById('product-image-input').click()}
                                className="w-full aspect-video bg-gray-50 border-2 border-dashed border-gray-200 flex flex-col items-center justify-center relative cursor-pointer group transition-all hover:border-blue-200 hover:bg-blue-50/30 overflow-hidden"
                            >
                                {newProduct.imagePreview ? (
                                    <>
                                        <img src={newProduct.imagePreview} alt="Preview" className="w-full h-full object-contain" />
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <p className="text-[10px] font-black text-white uppercase tracking-widest">Change Image</p>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div className="w-12 h-12 bg-white flex items-center justify-center mb-3 shadow-sm group-hover:scale-110 transition-transform">
                                            <FiCamera className="text-slate-400 group-hover:text-blue-500" size={24} />
                                        </div>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest group-hover:text-blue-500">Upload Product Photo</p>
                                        <p className="text-[8px] font-bold text-slate-300 uppercase tracking-widest mt-1">PNG, JPG up to 5MB</p>
                                    </>
                                )}
                                <input 
                                    id="product-image-input"
                                    type="file" 
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="hidden" 
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="md:col-span-2">
                                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1">Product Name</label>
                                <input 
                                    type="text" 
                                    value={newProduct.name} 
                                    onChange={e => setNewProduct({ ...newProduct, name: e.target.value })} 
                                    className="w-full px-4 py-3 border border-gray-100 text-sm focus:ring-2 focus:ring-blue-100 bg-gray-50/50 outline-none" 
                                    placeholder="e.g. Bullet Pro X1" 
                                />
                            </div>

                            <div>
                                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1">SKU (Stock Keeping Unit)</label>
                                <input 
                                    type="text" 
                                    value={newProduct.sku} 
                                    onChange={e => setNewProduct({ ...newProduct, sku: e.target.value })} 
                                    className="w-full px-4 py-3 border border-gray-100 text-sm focus:ring-2 focus:ring-blue-100 bg-gray-50/50 outline-none" 
                                    placeholder="SKU-001" 
                                />
                            </div>

                            <div>
                                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1">Brand</label>
                                <input 
                                    type="text" 
                                    value={newProduct.brand} 
                                    onChange={e => setNewProduct({ ...newProduct, brand: e.target.value })} 
                                    className="w-full px-4 py-3 border border-gray-100 text-sm focus:ring-2 focus:ring-blue-100 bg-gray-50/50 outline-none" 
                                    placeholder="e.g. Sony" 
                                />
                            </div>

                            <div>
                                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1">Category</label>
                                <input 
                                    type="text" 
                                    value={newProduct.category} 
                                    onChange={e => setNewProduct({ ...newProduct, category: e.target.value })} 
                                    className="w-full px-4 py-3 border border-gray-100 text-sm focus:ring-2 focus:ring-blue-100 bg-gray-50/50 outline-none" 
                                    placeholder="e.g. Indoor Camera" 
                                />
                            </div>

                            <div>
                                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1">Price (₹)</label>
                                <input 
                                    type="number" 
                                    value={newProduct.price} 
                                    onChange={e => setNewProduct({ ...newProduct, price: e.target.value })} 
                                    className="w-full px-4 py-3 border border-gray-100 text-sm focus:ring-2 focus:ring-blue-100 bg-gray-50/50 outline-none" 
                                />
                            </div>

                            <div>
                                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1">Stock Quantity</label>
                                <input 
                                    type="number" 
                                    value={newProduct.quantity} 
                                    onChange={e => setNewProduct({ ...newProduct, quantity: e.target.value })} 
                                    className="w-full px-4 py-3 border border-gray-100 text-sm focus:ring-2 focus:ring-blue-100 bg-gray-50/50 outline-none" 
                                />
                            </div>

                            <div className="md:col-span-2">
                                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1">Description</label>
                                <textarea 
                                    value={newProduct.description} 
                                    onChange={e => setNewProduct({ ...newProduct, description: e.target.value })} 
                                    className="w-full px-4 py-3 border border-gray-100 text-sm focus:ring-2 focus:ring-blue-100 bg-gray-50/50 outline-none h-24 resize-none" 
                                    placeholder="Brief details about the product..." 
                                />
                            </div>
                        </div>

                        <div className="flex gap-4 mt-10">
                            <button 
                                onClick={() => setShowAddModal(false)} 
                                className="flex-1 py-4 border border-gray-100 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-600 transition-colors"
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={handleSaveProduct} 
                                className="flex-[2] py-4 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all active:scale-[0.98]"
                            >
                                {editProduct ? 'Update Inventory' : 'Add to Inventory'}
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
}
