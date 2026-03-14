const axios = require('axios');

async function testBooking() {
    try {
        const response = await axios.post('http://localhost:5000/api/jobs', {
            customerName: "ruthra",
            customerPhone: "9876543210",
            customerAddress: "velachery",
            serviceType: "CCTV Installation",
            date: "2026-03-04",
            timeSlot: "Morning (9 AM - 12 PM)",
            problemDescription: "test"
        });
        console.log('SUCCESS:', JSON.stringify(response.data, null, 2));
    } catch (error) {
        if (error.response) {
            console.error('ERROR RESPONSE:', error.response.status, JSON.stringify(error.response.data, null, 2));
        } else {
            console.error('ERROR MESSAGE:', error.message);
        }
    }
}

testBooking();
