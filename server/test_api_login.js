const axios = require('axios');

async function testLogin() {
    try {
        console.log("Testing POST /api/auth/login...");
        const res = await axios.post('http://localhost:5000/api/auth/login', {
            email: 'ruthralekha1212@gmail.com',
            password: '123123'
        });
        console.log("✅ Success! Response:", res.data);
    } catch (err) {
        console.error("❌ Failed!");
        console.error("Status:", err.response?.status);
        console.error("Message:", err.response?.data);
    }
}

testLogin();
