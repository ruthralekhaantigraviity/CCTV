import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import axios from 'axios';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import ServiceDetail from './pages/ServiceDetail';
import Industries from './pages/Industries';
import TestimonialsPage from './pages/TestimonialsPage';
import Careers from './pages/Careers';
import Contact from './pages/Contact';
import Blog from './pages/Blog';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import BookTechnician from './pages/BookTechnician';
import Login from './pages/Login';
import Signup from './pages/Signup';
import FloatingWidgets from './components/FloatingWidgets';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import CartDrawer from './components/CartDrawer';
import Dashboard from './pages/Dashboard';
import AdminLogin from './pages/AdminLogin';
import AdminSignup from './pages/AdminSignup';
import AdminDashboard from './pages/AdminDashboard';
import EmployeeDashboard from './pages/EmployeeDashboard';
import EmployeeLogin from './pages/EmployeeLogin';

// Configure global axios base URL
axios.defaults.baseURL = import.meta.env.VITE_API_URL || 'https://cctv-kgck.onrender.com';
axios.defaults.withCredentials = true;

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <ThemeProvider>
          <Router>
            <AppContent />
            <CartDrawer />
          </Router>
        </ThemeProvider>
      </CartProvider>
    </AuthProvider>
  );
}

function AppContent() {
  const location = useLocation();
  const isAdminPath = ['/admin', '/admin-dashboard', '/employee', '/employee-dashboard'].some(path =>
    location.pathname.toLowerCase().startsWith(path.toLowerCase())
  );

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--bg-primary)' }}>
      {!isAdminPath && <Navbar />}
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/services/:slug" element={<ServiceDetail />} />
          <Route path="/industries" element={<Industries />} />
          <Route path="/testimonials" element={<TestimonialsPage />} />
          <Route path="/careers" element={<Careers />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:slug" element={<ProductDetail />} />
          <Route path="/book-technician" element={<BookTechnician />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/admin/signup" element={<AdminSignup />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin-dashboard/*" element={<AdminDashboard />} />
          <Route path="/employee/login" element={<EmployeeLogin />} />
          <Route path="/employee-dashboard/*" element={<EmployeeDashboard />} />
          <Route path="*" element={<div className="min-h-screen flex items-center justify-center bg-gray-50 flex-col gap-4">
            <h1 className="text-4xl font-bold text-slate-800">404 - Page Not Found</h1>
            <p className="text-slate-500">The gateway you are looking for does not exist.</p>
            <a href="/" className="px-6 py-2 bg-blue-600 text-white rounded-lg">Return Home</a>
          </div>} />
        </Routes>
      </main>
      {!isAdminPath && <Footer />}
      {!isAdminPath && <FloatingWidgets />}
    </div>
  );
}

export default App;

