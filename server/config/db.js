const mongoose = require('mongoose');

// MongoDB connection string from environment variable
const MONGO_URI = process.env.MONGO_URI;

const connectDB = async () => {
    try {
        if (!MONGO_URI) {
            console.log('⚠️  WARNING: MONGO_URI not found in environment variables.');
            console.log('   The application will run in SIMULATION MODE (no database).');
            console.log('   To enable database features:');
            console.log('   1. Copy .env.example to .env');
            console.log('   2. Add your MongoDB connection string to MONGO_URI');
            return;
        }

        const conn = await mongoose.connect(MONGO_URI, {
            // Mongoose 6+ defaults (no need for deprecated options)
        });

        console.log(`\n🍃 MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`\n❌ MongoDB Connection Error: ${error.message}`);
        console.log('   The application will continue in SIMULATION MODE.');
        console.log('   Please check your MONGO_URI in the .env file.');
        // Don't exit process so the app can still run in "Simulated Mode" if DB fails
        // process.exit(1); 
    }
};

module.exports = connectDB;
