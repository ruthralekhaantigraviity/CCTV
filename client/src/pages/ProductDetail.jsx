import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
 FiStar, FiCheckCircle, FiShield, FiTruck, FiLock,
 FiMapPin, FiShare2, FiHeart, FiArrowLeft, FiShoppingBag, FiVideo
} from 'react-icons/fi';
import { products } from '../data/products';
import CTABanner from '../components/CTABanner';

export default function ProductDetail() {
 const { slug } = useParams();
 const [qty, setQty] = useState(1);
 const [activeImg, setActiveImg] = useState(0);

 const product = products.find((p) => p.slug === slug);

 if (!product) {
 return (
 <div className="pt-36 pb-20 text-center bg-gray-50 min-h-screen">
 <h1 className="text-3xl font-bold mb-4">Product Not Found</h1>
 <Link to="/products" className="text-blue-500 hover:underline">Return to Shop</Link>
 </div>
 );
 }

 const related = products.filter(p => p.category === product.category && p.slug !== product.slug);

 return (
 <div className="pt-24 min-h-screen pb-20 bg-white">
 {/* Breadcrumbs */}
 <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
 <div className="flex items-center gap-2 text-xs text-gray-500 font-medium">
 <Link to="/" className=" transition-colors">Home</Link>
 <span>/</span>
 <Link to="/products" className=" transition-colors">Shop</Link>
 <span>/</span>
 <span className="text-gray-900">{product.name}</span>
 </div>
 </div>

 <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col lg:flex-row gap-12">

 {/* Left: Product Images */}
 <div className="w-full lg:w-1/2">
 <div className="flex flex-col-reverse md:flex-row gap-4">
 {/* Gallery Thumbs */}
 <div className="flex flex-row md:flex-col gap-3">
 {[product.img, product.img, product.img].map((img, i) => (
 <button
 key={i}
 onClick={() => setActiveImg(i)}
 className={`w-20 h-20 border-2 p-2 bg-gray-50 transition-all ${activeImg === i ? 'border-blue-600' : 'border-gray-100 '}`}
 >
 <img src={img} className="w-full h-full object-contain mix-blend-multiply" alt="thumb" />
 </button>
 ))}
 </div>

 {/* Main Visual */}
 <div className="flex-grow aspect-square bg-gray-50 flex items-center justify-center p-12 border border-gray-100 relative group overflow-hidden">
 <motion.img
 key={activeImg}
 initial={{ opacity: 0, scale: 0.9 }}
 animate={{ opacity: 1, scale: 1 }}
 src={product.img}
 className="w-full h-full object-contain mix-blend-multiply transition-transform duration-700 group-"
 alt={product.name}
 />
 <div className="absolute top-6 right-6 flex flex-col gap-3">
 <button className="p-3 bg-white rounded-full shadow-lg text-gray-400 transition-all">
 <FiHeart />
 </button>
 <button className="p-3 bg-white rounded-full shadow-lg text-gray-400 transition-all">
 <FiShare2 />
 </button>
 </div>
 </div>
 </div>
 </div>

 {/* Right: Product Details */}
 <div className="flex-grow space-y-8">
 <div className="space-y-4">
 <div className="flex items-center gap-4">
 <span className="bg-blue-600 text-white text-[10px] font-bold px-3 py-1 uppercase tracking-widest">In Stock</span>
 <div className="flex items-center gap-1 text-orange-400">
 {[...Array(5)].map((_, i) => <FiStar key={i} fill={i < Math.floor(product.rating) ? 'currentColor' : 'none'} size={14} />)}
 <span className="text-gray-400 text-sm ml-2 font-medium">({product.reviews} Customer Reviews)</span>
 </div>
 </div>

 <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 leading-tight">
 {product.name}
 </h1>

 <p className="text-base text-gray-600 leading-relaxed max-w-2xl">
 {product.desc}
 </p>
 </div>

 <div className="py-6 border-y border-gray-100 space-y-2">
 <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Starting From</p>
 <div className="flex items-baseline gap-4">
 <span className="text-3xl font-extrabold text-[#d32f2f]">₹{product.price.toLocaleString()}</span>
 {product.oldPrice && (
 <span className="text-sm text-gray-400 line-through font-medium">₹{product.oldPrice.toLocaleString()}</span>
 )}
 <span className="bg-green-100 text-green-700 text-[10px] font-bold px-2 py-0.5 rounded-full">Save ₹{(product.oldPrice - product.price).toLocaleString()}</span>
 </div>
 </div>

 <div className="space-y-6">
 <div className="flex flex-wrap items-center gap-3">
 <Link
 to="/book-technician"
 className="flex-grow md:flex-none h-11 bg-[#0F1111] text-white px-8 rounded-full font-bold text-sm transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-gray-200 flex items-center justify-center"
 >
 Book a Slot
 </Link>

 <Link
 to="/contact"
 state={{ prefilledService: 'Other' }}
 className="flex-grow md:flex-none h-11 bg-white border-2 border-[#0F1111] text-[#0F1111] px-8 rounded-full font-bold text-sm transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center"
 >
 Enquiry
 </Link>

 <button className="w-11 h-11 flex items-center justify-center border-2 border-gray-100 rounded-full text-gray-600 transition-all">
 <FiShoppingBag size={18} />
 </button>
 </div>

 {/* Video Section Placeholder */}
 <div className="pt-4">
 <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
 <FiVideo className="text-red-600" /> Product Video Overview
 </h3>
 <div className="aspect-video bg-gray-900 rounded-xl overflow-hidden relative group cursor-pointer border border-gray-100 shadow-inner">
 <img
 src={product.img}
 className="w-full h-full object-cover opacity-40 blur-[2px] group-hover:blur-0 transition-all duration-500"
 alt="video placeholder"
 />
 <div className="absolute inset-0 flex items-center justify-center">
 <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/30 group- transition-transform">
 <div className="w-0 h-0 border-t-[10px] border-t-transparent border-l-[18px] border-l-white border-b-[10px] border-b-transparent ml-1" />
 </div>
 </div>
 <div className="absolute bottom-4 left-4 text-white text-[10px] font-bold tracking-widest bg-black/50 px-3 py-1 rounded">
 4K PRODUCT REVEAL
 </div>
 </div>
 </div>

 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-4">
 <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl border border-gray-100">
 <FiTruck className="text-blue-600 text-xl" />
 <div className="text-xs">
 <p className="font-bold">Fast Delivery</p>
 <p className="text-gray-500">Scheduled within 24-48 hrs</p>
 </div>
 </div>
 <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl border border-gray-100">
 <FiShield className="text-blue-600 text-xl" />
 <div className="text-xs">
 <p className="font-bold">Official Warranty</p>
 <p className="text-gray-500">2 Years Manufacturer Warranty</p>
 </div>
 </div>
 </div>
 </div>

 <div className="space-y-4">
 <h3 className="text-lg font-bold text-gray-900 border-b pb-2">Key Specifications</h3>
 <ul className="grid grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-8">
 {product.features.map((f, i) => (
 <li key={i} className="flex items-center gap-3 text-sm text-gray-600">
 <FiCheckCircle className="text-green-500 flex-shrink-0" />
 <span>{f}</span>
 </li>
 ))}
 <li className="flex items-center gap-3 text-sm text-gray-600">
 <FiCheckCircle className="text-green-500 flex-shrink-0" />
 <span>Mobile App Integration</span>
 </li>
 <li className="flex items-center gap-3 text-sm text-gray-600">
 <FiCheckCircle className="text-green-500 flex-shrink-0" />
 <span>Cloud & Local Recording</span>
 </li>
 </ul>
 </div>
 </div>
 </div>

 {/* Suggested Products */}
 <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-gray-100">
 <h2 className="text-2xl font-black text-gray-900 mb-12 uppercase tracking-tighter italic">Recommended Solutions</h2>
 <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
 {related.slice(0, 4).map(p => (
 <Link key={p.id} to={`/products/${p.slug}`} className="group space-y-4">
 <div className="aspect-square bg-gray-50 border border-gray-100 p-8 flex items-center justify-center relative overflow-hidden">
 <img src={p.img} alt={p.name} className="w-full h-full object-contain mix-blend-multiply group- transition-transform duration-500" />
 <div className="absolute inset-0 bg-blue-600/5 opacity-0 group- transition-opacity" />
 </div>
 <div className="space-y-1">
 <p className="text-sm font-bold text-gray-900 group- transition-colors line-clamp-1">{p.name}</p>
 <div className="flex items-baseline gap-2">
 <span className="text-lg font-black text-[#d32f2f]">₹{p.price.toLocaleString()}</span>
 <span className="text-xs text-gray-400 line-through">₹{p.oldPrice.toLocaleString()}</span>
 </div>
 </div>
 </Link>
 ))}
 </div>
 </section>

 <CTABanner />
 </div>
 );
}
