const express = require('express');
const app = express();
const jobsRouter = require('./routes/jobs');

app.use('/api/jobs', jobsRouter);

console.log('--- Express Routes ---');
app._router.stack.forEach(r => {
    if (r.route) {
        console.log(`${Object.keys(r.route.methods).join(', ').toUpperCase()} ${r.route.path}`);
    } else if (r.name === 'router') {
        r.handle.stack.forEach(sr => {
            if (sr.route) {
                console.log(`${Object.keys(sr.route.methods).join(', ').toUpperCase()} /api/jobs${sr.route.path}`);
            }
        });
    }
});
process.exit();
