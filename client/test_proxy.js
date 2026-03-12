const axios = require('axios');

async function testViteProxy() {
    try {
        console.log("Pinging the Vite server (port 5173)...");
        const res = await axios.post('http://localhost:5173/api/auth/login', {
            email: 'ruthralekha1212@gmail.com',
            password: '123123'
        });
        console.log("✅ Proxy works! Response:", res.data);
    } catch (err) {
        console.error("❌ Proxy failed!");
        console.error("Status:", err.response?.status);
        console.error("Message:", err.response?.data);
    }
}

testViteProxy();
