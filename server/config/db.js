const mongoose = require('mongoose');

// Default to a placeholder if env var is missing (User must provide this!)
const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://akashstudy21_db_user:JhJGKgUNhcZkWt4b@default.ebjnkbp.mongodb.net/?retryWrites=true&w=majority&appName=DEFAULT';

const connectDB = async () => {
    try {
        if (!process.env.MONGO_URI) {
            console.log('⚠️  MONGO_URI not found in env. Using default connection string.');
        }

        const conn = await mongoose.connect(MONGO_URI, {
            // Mongoose 6+ defaults (no need for deprecated options)
        });

        console.log(`\n🍃 MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`\n❌ MongoDB Connection Error: ${error.message}`);
        console.log('   Please set a valid MONGO_URI in your environment variables.');
        // Don't exit process so the app can still run in "Simulated Mode" if DB fails
        // process.exit(1); 
    }
};

module.exports = connectDB;
