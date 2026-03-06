import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <Router>
          <div className="min-h-screen flex flex-col" style={{ background: 'var(--bg-primary)' }}>
            <Navbar />
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
              </Routes>
            </main>
            <Footer />
            <FloatingWidgets />
          </div>
        </Router>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;

