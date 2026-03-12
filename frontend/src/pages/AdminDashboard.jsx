import { useNavigate } from 'react-router-dom';

export default function AdminDashboard() {
    const navigate = useNavigate();
    
    return (
        <div style={{ minHeight: '100vh', background: 'white', color: 'black', padding: '50px', zIndex: 9999, position: 'relative' }}>
            <h1 style={{ fontSize: '48px', fontWeight: 'bold' }}>ADMIN DASHBOARD LOADED ✅</h1>
            <p>If you can see this, the component is working!</p>
            <button 
                onClick={() => navigate('/admin-dashboard/bookings')}
                style={{ padding: '10px 20px', background: 'blue', color: 'white', border: 'none', marginTop: '20px' }}
            >
                Try Bookings
            </button>
        </div>
    );
}
