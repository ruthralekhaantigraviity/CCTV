import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useSearchParams } from 'react-router-dom';
import {
 FiSearch, FiChevronDown, FiChevronUp, FiStar,
 FiHeart, FiShoppingBag
} from 'react-icons/fi';
import { products } from '../data/products';

export default function Products() {
 const [searchParams, setSearchParams] = useSearchParams();
 const querySearch = searchParams.get('search') || '';

 const [searchTerm, setSearchTerm] = useState(querySearch);
 const [category, setCategory] = useState('All');
 const [priceRange, setPriceRange] = useState(50000);
 const [reviews, setReviews] = useState(0);
 const [sortBy, setSortBy] = useState('Default Sorting');

 // Update local search term when URL param changes
 useEffect(() => {
 setSearchTerm(querySearch);
 }, [querySearch]);

 // Sidebar Section States (Accordions)
 const [sections, setSections] = useState({
 categories: true,
 price: true,
 reviews: true
 });

 const categories = useMemo(() => {
 const counts = products.reduce((acc, p) => {
 acc[p.category] = (acc[p.category] || 0) + 1;
 return acc;
 }, {});
 return Object.entries(counts);
 }, []);

 const toggleSection = (name) => {
 setSections(prev => ({ ...prev, [name]: !prev[name] }));
 };

 const filteredProducts = useMemo(() => {
 return products
 .filter(p => {
 const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
 const matchesCategory = category === 'All' || p.category === category;
 const matchesPrice = p.price <= priceRange;
 const matchesReviews = p.rating >= reviews;
 return matchesSearch && matchesCategory && matchesPrice && matchesReviews;
 })
 .sort((a, b) => {
 if (sortBy === 'Price: Low to High') return a.price - b.price;
 if (sortBy === 'Price: High to Low') return b.price - a.price;
 if (sortBy === 'Rating') return b.rating - a.rating;
 return 0; // Default
 });
 }, [searchTerm, category, priceRange, reviews, sortBy]);

 return (
 <div className="products-page pt-32 min-h-screen pb-20" style={{ background: '#f8f9fa' }}>
 <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
 <div className="flex flex-col lg:flex-row gap-8">

 {/* Sidebar */}
 <aside className="w-full lg:w-[600px] space-y-6">
 {/* Search Box */}
 <div className="bg-white p-6 shadow-sm border border-gray-100 rounded-sm">
 <div className="relative">
 <input
 type="text"
 placeholder="Search products..."
 value={searchTerm}
 onChange={(e) => setSearchTerm(e.target.value)}
 className="w-full bg-gray-100 py-3 px-4 pr-10 rounded-lg text-sm outline-none border border-transparent focus:border-blue-500 transition-all"
 />
 <FiSearch className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
 </div>
 </div>

 {/* Categories Accordion */}
 <div className="bg-white shadow-sm border border-gray-100 rounded-sm overflow-hidden">
 <button
 onClick={() => toggleSection('categories')}
 className="w-full flex items-center justify-between p-5 text-sm font-bold uppercase tracking-wider"
 >
 Categories
 {sections.categories ? <FiChevronUp /> : <FiChevronDown />}
 </button>
 <AnimatePresence>
 {sections.categories && (
 <motion.div
 initial={{ height: 0 }}
 animate={{ height: 'auto' }}
 exit={{ height: 0 }}
 className="overflow-hidden px-5 pb-5 space-y-3"
 >
 <div className="flex items-center gap-3 text-sm cursor-pointer" onClick={() => setCategory('All')}>
 <input type="checkbox" checked={category === 'All'} readOnly className="rounded border-gray-300" />
 All Products
 </div>
 {categories.map(([name, count]) => (
 <div
 key={name}
 className="flex items-center justify-between text-sm cursor-pointer transition-colors"
 onClick={() => setCategory(name)}
 >
 <div className="flex items-center gap-3">
 <input type="checkbox" checked={category === name} readOnly className="rounded border-gray-300" />
 <span>{name}</span>
 </div>
 <span className="text-gray-400">({count})</span>
 </div>
 ))}
 </motion.div>
 )}
 </AnimatePresence>
 </div>

 {/* Price Filter */}
 <div className="bg-white shadow-sm border border-gray-100 rounded-sm overflow-hidden">
 <button
 onClick={() => toggleSection('price')}
 className="w-full flex items-center justify-between p-5 text-sm font-bold uppercase tracking-wider"
 >
 Price
 {sections.price ? <FiChevronUp /> : <FiChevronDown />}
 </button>
 <AnimatePresence>
 {sections.price && (
 <motion.div
 initial={{ height: 0 }}
 animate={{ height: 'auto' }}
 exit={{ height: 0 }}
 className="overflow-hidden px-5 pb-5"
 >
 <input
 type="range"
 min="1000"
 max="50000"
 value={priceRange}
 onChange={(e) => setPriceRange(parseInt(e.target.value))}
 className="w-full accent-red-600 mb-4"
 />
 <div className="flex justify-between text-sm font-medium">
 <span>₹1,000</span>
 <span>₹{priceRange.toLocaleString()}</span>
 </div>
 </motion.div>
 )}
 </AnimatePresence>
 </div>

 {/* Customer Review */}
 <div className="bg-white shadow-sm border border-gray-100 rounded-sm overflow-hidden">
 <button
 onClick={() => toggleSection('reviews')}
 className="w-full flex items-center justify-between p-5 text-sm font-bold uppercase tracking-wider"
 >
 Customer Review
 {sections.reviews ? <FiChevronUp /> : <FiChevronDown />}
 </button>
 <AnimatePresence>
 {sections.reviews && (
 <motion.div
 initial={{ height: 0 }}
 animate={{ height: 'auto' }}
 exit={{ height: 0 }}
 className="overflow-hidden px-5 pb-5 space-y-2"
 >
 {[4, 3, 2, 1].map(stars => (
 <button
 key={stars}
 onClick={() => setReviews(stars)}
 className={`flex items-center gap-2 text-sm transition-colors ${reviews === stars ? 'text-blue-600 font-bold' : 'text-gray-600'}`}
 >
 <div className="flex text-orange-400">
 {[...Array(5)].map((_, i) => (
 <FiStar key={i} fill={i < stars ? 'currentColor' : 'none'} size={14} />
 ))}
 </div>
 & Up
 </button>
 ))}
 </motion.div>
 )}
 </AnimatePresence>
 </div>
 </aside>

 {/* Main Content */}
 <main className="flex-grow">
 {/* Toolbar */}
 <div className="bg-white p-4 shadow-sm border border-gray-100 flex items-center justify-between mb-8 rounded-sm">
 <p className="text-sm font-medium text-gray-600">
 Showing <span className="text-black font-bold">{filteredProducts.length}</span> of <span className="text-black font-bold">{products.length}</span> results
 </p>
 <div className="flex items-center gap-2">
 <span className="text-sm text-gray-500">Sort by:</span>
 <select
 className="text-sm font-medium outline-none border rounded px-2 py-1 cursor-pointer"
 value={sortBy}
 onChange={(e) => setSortBy(e.target.value)}
 >
 <option>Default Sorting</option>
 <option>Price: Low to High</option>
 <option>Price: High to Low</option>
 <option>Rating</option>
 </select>
 </div>
 </div>

 {/* Grid */}
 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
 {filteredProducts.map((p) => (
 <motion.div
 layout
 key={p.id}
 className="bg-white border border-gray-100 rounded-none p-3 transition-all group"
 >
 {/* Image Container */}
 <div className="relative aspect-square bg-gray-50 mb-4 flex items-center justify-center p-6">
 <img
 src={p.img}
 alt={p.name}
 className="w-full h-full object-contain mix-blend-multiply"
 />
 <button className="absolute top-4 right-4 w-9 h-9 bg-white rounded-full flex items-center justify-center shadow-md text-gray-400 transition-colors">
 <FiHeart />
 </button>
 </div>

 {/* Info */}
 <div className="space-y-3">
 <div className="flex justify-between items-start">
 <Link
 to={`/products/${p.slug}`}
 className="text-sm font-bold text-gray-900 line-clamp-2 transition-colors"
 >
 {p.name}
 </Link>
 <div className="flex items-center gap-1 text-orange-400 text-sm font-bold">
 <FiStar fill="currentColor" /> {p.rating}
 </div>
 </div>

 <div className="pt-2">
 <p className="text-[10px] text-gray-400 font-bold tracking-widest uppercase">Starting From</p>
 <div className="flex items-baseline gap-3 mt-1">
 <span className="text-2xl font-extrabold text-[#d32f2f]">₹{p.price.toLocaleString()}</span>
 {p.oldPrice && (
 <span className="text-sm text-gray-400 line-through">₹{p.oldPrice.toLocaleString()}</span>
 )}
 </div>
 </div>

 <div className="pt-4 flex gap-2">
 <Link
 to={`/products/${p.slug}`}
 className="flex-grow bg-[#0F1111] text-white py-3 px-4 rounded-full text-sm font-bold text-center transition-colors"
 >
 View Details
 </Link>
 <button className="p-3 bg-gray-100 text-gray-600 rounded-full transition-all">
 <FiShoppingBag />
 </button>
 </div>
 </div>
 </motion.div>
 ))}
 </div>

 {filteredProducts.length === 0 && (
 <div className="text-center py-20 bg-white border border-dashed border-gray-300 rounded-xl mt-10">
 <p className="text-xl text-gray-500">No products matching your filters.</p>
 <button
 onClick={() => { setCategory('All'); setSearchTerm(''); setPriceRange(50000); }}
 className="mt-6 px-10 py-3 bg-blue-600 text-white font-bold rounded-lg"
 >
 Clear Selection
 </button>
 </div>
 )}
 </main>
 </div>
 </div>
 </div>
 );
}
