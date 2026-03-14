import { motion } from 'framer-motion';
import { FiArrowRight, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const products = [
  {
    id: 1,
    name: 'ProVision 4K Dome',
    image: '/prod_dome.png',
    price: 4999
  },
  {
    id: 2,
    name: 'NightGuard Bullet',
    image: '/prod_bullet.png',
    price: 5499
  },
  {
    id: 3,
    name: 'Titan PTZ 360',
    image: '/prod_ptz.png',
    price: 12999
  },
  {
    id: 4,
    name: 'Quantum NVR 32',
    image: '/prod_nvr.png',
    price: 24999
  },
  {
    id: 5,
    name: 'Wireless Smart WiFi Cam',
    image: '/prod_wireless.png',
    price: 3199
  },
  {
    id: 6,
    name: 'Pro Face-Detect AI Cam',
    image: '/svc2.png',
    price: 8499
  },
  {
    id: 7,
    name: 'Vandal-Proof Master Cam',
    image: '/svc3.png',
    price: 6799
  },
  {
    id: 8,
    name: 'Ultra-HD Indoor Dome',
    image: '/cam1.png',
    price: 3899
  },
  {
    id: 9,
    name: 'Night-Vision Bullet Pro',
    image: '/cam2.png',
    price: 4599
  }
];

function ProductCard({ product }) {
  return (
    <Link to={`/products`} className="group block w-full">
      <div className="relative aspect-square flex items-center justify-center mb-6 transition-transform duration-500 group-">
        {/* Minimalist Image - No Box */}
        <img
          src={product.image}
          alt={product.name}
          className="w-4/5 h-auto object-contain drop-shadow-2xl"
          onError={(e) => {
            e.target.src = "https://images.unsplash.com/photo-1557862921-37829c790f19?w=400";
          }}
        />
      </div>
      <div className="text-center">
        <h3 className="text-lg font-bold t-primary group- transition-colors uppercase tracking-tight mb-2">
          {product.name}
        </h3>
        <p className="text-xl font-extrabold text-[#d32f2f]">
          ₹{product.price.toLocaleString()}
        </p>
      </div>
    </Link>
  );
}

export default function ProductShowcase() {
 return (
 <section className="py-32 relative overflow-hidden bg-white">
 <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
 {/* Heading Area */}
 <div className="text-center mb-20 text-black">
 <motion.p
 initial={{ opacity: 0, y: 20 }}
 whileInView={{ opacity: 1, y: 0 }}
 viewport={{ once: true }}
 className="text-blue-500 font-semibold uppercase tracking-widest text-sm mb-3"
 >
 Next-Gen Hardware
 </motion.p>
 <motion.h2
 initial={{ opacity: 0, y: 20 }}
 whileInView={{ opacity: 1, y: 0 }}
 viewport={{ once: true }}
 transition={{ delay: 0.1 }}
 className="text-4xl sm:text-5xl font-bold mb-4"
 >
 Elite Surveillance Tools
 </motion.h2>
 <motion.p
 initial={{ opacity: 0, y: 20 }}
 whileInView={{ opacity: 1, y: 0 }}
 viewport={{ once: true }}
 transition={{ delay: 0.2 }}
 className="max-w-2xl mx-auto mb-8 text-gray-400"
 >
 Explore our selection of premium, AI-powered security cameras and networking equipment designed for maximum reliability.
 </motion.p>
 <motion.div
 initial={{ opacity: 0, y: 20 }}
 whileInView={{ opacity: 1, y: 0 }}
 viewport={{ once: true }}
 transition={{ delay: 0.3 }}
 className="flex justify-center"
 >
 <Link to="/products" className="group flex items-center gap-3 font-black uppercase text-[12px] tracking-widest transition-colors">
 View All Products <FiArrowRight className="group-hover:translate-x-2 transition-transform" />
 </Link>
 </motion.div>
 </div>

 <div className="relative px-12">
 <Swiper
 modules={[Autoplay, Navigation, Pagination]}
 spaceBetween={40}
 slidesPerView={1}
 slidesPerGroup={1}
 speed={2000}
 loop={true}
 navigation={{
 prevEl: '.prev-btn',
 nextEl: '.next-btn',
 }}
 autoplay={{ delay: 4000, disableOnInteraction: false }}
 breakpoints={{
 640: { slidesPerView: 2 },
 1024: { slidesPerView: 3 },
 1280: { slidesPerView: 4 },
 }}
 className="product-swiper pb-10"
 >
 {products.map(product => (
 <SwiperSlide key={product.id}>
 <ProductCard product={product} />
 </SwiperSlide>
 ))}
 </Swiper>

 {/* Navigation Buttons */}
 <button className="prev-btn absolute left-0 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 transition-all z-10">
 <FiChevronLeft size={20} />
 </button>
 <button className="next-btn absolute right-0 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 transition-all z-10">
 <FiChevronRight size={20} />
 </button>
 </div>
 </div>
 </section>
 );
}
