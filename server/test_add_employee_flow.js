const axios = require('axios');

async function testFlow() {
    const API_BASE = 'http://localhost:5000/api/auth';
    
    try {
        console.log('1. Logging in as Admin...');
        const loginRes = await axios.post(`${API_BASE}/login`, {
            email: 'admin@sv.com',
            password: 'admin123'
        });
        
        const token = loginRes.data.token;
        console.log('   Login Successful. Token:', token.substring(0, 15) + '...');
        console.log('   User Role:', loginRes.data.user.role);

        console.log('\n2. Attempting to add a new employee...');
        const addRes = await axios.post(`${API_BASE}/employees`, {
            name: 'Test Employee',
            email: 'test_emp_new@gmail.com',
            phone: '1122334455',
            password: 'password123',
            employeeId: 'EMP-TEST-999'
        }, {
            headers: { Authorization: `Bearer ${token}` }
        });

        console.log('   Employee Added Successfully:', addRes.data.success);
        console.log('   Response Data:', JSON.stringify(addRes.data, null, 2));

    } catch (err) {
        console.error('\n❌ ERROR:');
        if (err.response) {
            console.error('Status:', err.response.status);
            console.error('Data:', JSON.stringify(err.response.data, null, 2));
        } else {
            console.error('Message:', err.message);
        }
    }
}

testFlow();
