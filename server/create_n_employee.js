require('dotenv').config();
const axios = require('axios');

async function createEmployee() {
    try {
        const API_URL = 'http://localhost:5000/api/auth';
        
        // 1. Login as admin to get token
        console.log('Logging in as admin...');
        const loginRes = await axios.post(`${API_URL}/login`, {
            email: 'admin@sv.com',
            password: 'admin123'
        });
        
        const token = loginRes.data.token;
        console.log('Admin login successful');

        // 2. Create employee n@gmail.com
        console.log('Creating employee n@gmail.com...');
        const createRes = await axios.post(`${API_URL}/employees`, {
            name: 'Nick',
            email: 'n@gmail.com',
            phone: '1234567890',
            password: 'password123',
            employeeId: 'EMP-N-101'
        }, {
            headers: { Authorization: `Bearer ${token}` }
        });

        console.log('Employee created successfully:', createRes.data);

    } catch (err) {
        console.error('Error:', err.response?.data || err.message);
    }
}

createEmployee();
