const mongoose = require('mongoose');

async function search() {
    const dbs = ['securevision', 'securevision_db'];
    for (const dbName of dbs) {
        try {
            const uri = `mongodb://127.0.0.1:27017/${dbName}`;
            console.log(`Searching in ${dbName}...`);
            const conn = await mongoose.createConnection(uri).asPromise();
            const User = conn.model('User', new mongoose.Schema({ email: String, employeeId: String }));
            const user = await User.findOne({ email: 'n@gmail.com' });
            if (user) {
                console.log(`FOUND in ${dbName}:`, user);
            } else {
                console.log(`NOT found in ${dbName}`);
            }
            await conn.close();
        } catch (err) {
            console.error(`Error searching ${dbName}:`, err.message);
        }
    }
}

search();
