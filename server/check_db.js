import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

console.log('Testing connection to:', process.env.MONGO_URI);

async function check() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Success! Mongoose connected to MongoDB.');
        
        const dbs = await mongoose.connection.db.admin().listDatabases();
        console.log('Available Databases:', dbs.databases.map(d => d.name));
        
        await mongoose.disconnect();
        process.exit(0);
    } catch (err) {
        console.error('❌ Connection Failed:', err.message);
        process.exit(1);
    }
}

check();
