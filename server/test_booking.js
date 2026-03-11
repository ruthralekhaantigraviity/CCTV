const http = require('http');

const data = JSON.stringify({
    customerName: 'Test User',
    customerPhone: '1234567890',
    customerAddress: '123 Test St',
    serviceType: 'CCTV Installation',
    date: '2026-03-12',
    timeSlot: 'Morning (9 AM - 12 PM)',
    problemDescription: 'Test booking request'
});

const options = {
    hostname: 'localhost',
    port: 5000,
    path: '/api/jobs',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length
    }
};

const req = http.request(options, (res) => {
    console.log(`STATUS: ${res.statusCode}`);
    res.setEncoding('utf8');
    res.on('data', (chunk) => {
        console.log(`BODY: ${chunk}`);
    });
});

req.on('error', (e) => {
    console.error(`PROBLEM WITH REQUEST: ${e.message}`);
});

req.write(data);
req.end();
