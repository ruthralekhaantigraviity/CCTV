require('dotenv').config();
const mongoose = require('mongoose');
const Service = require('./models/Service');
const Testimonial = require('./models/Testimonial');

const services = [
    {
        slug: 'cctv-installation',
        title: 'CCTV Installation',
        shortDescription: 'Professional CCTV camera installation for homes and businesses.',
        description: 'Our expert technicians provide end-to-end CCTV installation services tailored to your specific security needs. We assess your property, recommend the best camera placement, and install high-definition cameras with minimal disruption to your operations.',
        icon: 'camera',
        benefits: ['HD & 4K camera options', 'Strategic placement for maximum coverage', 'Weatherproof outdoor cameras', 'Night vision technology', 'Professional cable management', 'Same-day installation available'],
        steps: [
            { title: 'Free Site Survey', description: 'Our security consultant visits your property to assess vulnerabilities and recommend the best setup.' },
            { title: 'System Design', description: 'We design a customized CCTV layout optimized for your building layout and security goals.' },
            { title: 'Professional Installation', description: 'Certified technicians install your system with clean cabling and full configuration.' },
        ],
        faqs: [
            { question: 'How long does installation take?', answer: 'Most residential installations are completed within 4–8 hours. Commercial projects may take 1–3 days depending on scale.' },
            { question: 'Do you offer warranty?', answer: 'Yes, all installations come with a 1-year workmanship warranty and full manufacturer warranty on equipment.' },
            { question: 'Can I view cameras remotely?', answer: 'Yes, we configure remote viewing via mobile app so you can monitor your property from anywhere.' },
        ],
        featured: true,
        order: 1,
    },
    {
        slug: 'cctv-maintenance',
        title: 'CCTV Maintenance',
        shortDescription: 'Regular maintenance to keep your surveillance system at peak performance.',
        description: 'Regular maintenance is essential to ensure your CCTV system operates reliably when you need it most. Our maintenance packages include camera cleaning, firmware updates, recording system checks, and full system health reports.',
        icon: 'tool',
        benefits: ['Annual & quarterly maintenance plans', 'Camera lens cleaning', 'DVR/NVR health checks', 'Firmware & software updates', 'Full system diagnostic report', 'Priority support response'],
        steps: [
            { title: 'System Audit', description: 'We perform a comprehensive check of all cameras, cables, and recording systems.' },
            { title: 'Cleaning & Calibration', description: 'Cameras are cleaned, re-aligned, and settings optimized for best image quality.' },
            { title: 'Report & Recommendations', description: 'You receive a detailed health report with any recommendations for upgrades.' },
        ],
        faqs: [
            { question: 'How often should CCTV be serviced?', answer: 'We recommend at least annual maintenance, with quarterly checks for critical security environments.' },
            { question: 'Do you offer maintenance contracts?', answer: 'Yes, we offer flexible annual maintenance contracts with priority service call-outs.' },
        ],
        featured: true,
        order: 2,
    },
    {
        slug: 'remote-monitoring',
        title: 'Remote Monitoring',
        shortDescription: '24/7 live monitoring by our professional security operations center.',
        description: 'Our 24/7 remote monitoring service provides an additional layer of security with trained operators watching your cameras around the clock. We detect suspicious activity in real time and coordinate with local authorities when needed.',
        icon: 'monitor',
        benefits: ['24/7 live surveillance monitoring', 'Immediate alert response', 'Police & emergency service coordination', 'Monthly monitoring reports', 'Reduce on-site security costs', 'Peace of mind around the clock'],
        steps: [
            { title: 'System Integration', description: 'We connect your existing cameras to our secure monitoring platform.' },
            { title: 'Custom Alert Rules', description: 'We configure specific alert triggers based on your security requirements.' },
            { title: 'Active Monitoring', description: 'Our trained operators monitor feeds 24/7 and respond to any incidents immediately.' },
        ],
        faqs: [
            { question: 'What happens when suspicious activity is detected?', answer: 'Our operators immediately contact you and/or dispatch emergency services based on your response protocol.' },
            { question: 'Can I still access my cameras?', answer: 'Yes, remote monitoring does not restrict your own access to your camera feeds.' },
        ],
        featured: true,
        order: 3,
    },
    {
        slug: 'wireless-camera-setup',
        title: 'Wireless Camera Setup',
        shortDescription: 'Cable-free wireless IP camera solutions for flexible installations.',
        description: 'Wireless CCTV cameras offer flexible placement without the need for extensive cabling. Ideal for rented properties, temporary sites, and locations where cabling is impractical. Our wireless solutions deliver HD video quality with secure encrypted connections.',
        icon: 'wifi',
        benefits: ['No cabling required', 'Easy to relocate', 'Encrypted Wi-Fi connections', 'Battery & solar options available', 'Remote configuration', 'Ideal for temporary sites'],
        steps: [
            { title: 'Network Assessment', description: 'We assess your Wi-Fi coverage to ensure reliable camera connectivity.' },
            { title: 'Camera Placement', description: 'Strategic placement of wireless cameras for optimal coverage.' },
            { title: 'Configuration & Testing', description: 'Full setup, app configuration, and thorough testing of all camera feeds.' },
        ],
        faqs: [
            { question: 'Are wireless cameras as reliable as wired?', answer: 'Modern wireless cameras are highly reliable. We ensure strong Wi-Fi coverage during installation for best performance.' },
            { question: 'What if the Wi-Fi goes down?', answer: 'Many wireless cameras feature local SD storage as backup, and we can configure alert systems for connectivity issues.' },
        ],
        featured: false,
        order: 4,
    },
    {
        slug: 'commercial-security-systems',
        title: 'Commercial Security Systems',
        shortDescription: 'Enterprise-grade security solutions for businesses of all sizes.',
        description: 'Protect your business assets, employees, and customers with our comprehensive commercial security systems. We design and install scalable multi-camera systems with advanced features including license plate recognition, facial recognition, and AI-powered analytics.',
        icon: 'building',
        benefits: ['Scalable enterprise systems', 'AI-powered video analytics', 'License plate recognition', 'Access control integration', 'Multiple site management', 'Compliance & audit support'],
        steps: [
            { title: 'Security Consultation', description: 'Full security audit of your business premises and risk assessment.' },
            { title: 'Custom System Design', description: 'We design an enterprise-grade system tailored to your business needs and budget.' },
            { title: 'Managed Installation', description: 'Project-managed installation with minimal disruption to your business operations.' },
        ],
        faqs: [
            { question: 'Can you manage multiple site locations?', answer: 'Yes, we provide centralized management dashboards for businesses with multiple locations.' },
            { question: 'Do you integrate with access control systems?', answer: 'Absolutely. We integrate CCTV with access control, alarms, and other security infrastructure.' },
        ],
        featured: true,
        order: 5,
    },
    {
        slug: 'home-security-cameras',
        title: 'Home Security Cameras',
        shortDescription: 'Keep your family safe with smart home CCTV solutions.',
        description: 'Protect your home and loved ones with our tailored residential CCTV solutions. From simple doorbell cameras to full multi-camera systems, we provide everything you need to keep your home secure with easy smartphone monitoring.',
        icon: 'home',
        benefits: ['Smartphone monitoring app', 'Doorbell & indoor cameras', 'Cloud & local storage options', 'Motion detection alerts', 'Smart home integration', 'Discreet installation'],
        steps: [
            { title: 'Home Assessment', description: 'We identify key areas of vulnerability around your home.' },
            { title: 'System Selection', description: 'Choose from a range of cameras and recording options to fit your budget.' },
            { title: 'Installation & Demo', description: 'Quick, clean installation with a full walkthrough so you know how to use every feature.' },
        ],
        faqs: [
            { question: 'Can I install it myself?', answer: 'We recommend professional installation for the best results, but we do offer DIY systems with remote support.' },
            { question: 'How long is footage stored?', answer: 'Storage duration depends on your recording device capacity. We recommend 30-day rolling storage for most homes.' },
        ],
        featured: true,
        order: 6,
    },
];

const testimonials = [
    { name: 'James Thompson', role: 'Operations Manager', company: 'Retail Chain', review: 'SecureVision installed cameras across all 5 of our retail locations. The quality is outstanding and the team was incredibly professional. Our theft incidents have dropped by 80% since installation.', rating: 5, featured: true },
    { name: 'Sarah Mitchell', role: 'Homeowner', company: '', review: 'I can now watch my home from work on my phone. The installation was clean and fast, and the team explained everything thoroughly. Highly recommended for any homeowner!', rating: 5, featured: true },
    { name: 'David Patel', role: 'Warehouse Director', company: 'LogiCorp Ltd', review: 'We needed a large-scale system for our 80,000 sq ft warehouse. SecureVision delivered perfectly on time and within budget. The remote monitoring service gives us complete peace of mind.', rating: 5, featured: true },
    { name: 'Emma Rodriguez', role: 'School Principal', company: 'Greenfield Academy', review: 'Student safety is our top priority. SecureVision created a comprehensive security system for our campus. The team was sensitive to our environment and work was done during school holidays.', rating: 5, featured: true },
    { name: 'Michael Chen', role: 'Property Developer', company: 'Chen Developments', review: 'I use SecureVision across all my construction sites. Their wireless camera solutions are perfect for temporary sites. Reliable, great quality, and excellent ongoing support.', rating: 5, featured: false },
    { name: 'Lisa Harrington', role: 'Restaurant Owner', company: 'The Brasserie', review: 'After a break-in, SecureVision transformed our security setup completely. The new HD cameras and 24/7 monitoring means we never have to worry again. Brilliant service!', rating: 5, featured: false },
];

async function seed() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        await Service.deleteMany({});
        await Testimonial.deleteMany({});

        await Service.insertMany(services);
        await Testimonial.insertMany(testimonials);

        console.log('✅ Database seeded successfully!');
        console.log(`   - ${services.length} services inserted`);
        console.log(`   - ${testimonials.length} testimonials inserted`);
        process.exit(0);
    } catch (error) {
        console.error('Seed error:', error);
        process.exit(1);
    }
}

seed();
