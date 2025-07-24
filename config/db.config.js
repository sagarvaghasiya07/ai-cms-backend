const mongoose = require('mongoose');

//connect to mongodb
const db = async () => {
    try {
        const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/ai-cms';
        await mongoose.connect(mongoUri, {});
        console.log('Connected to MongoDB');
    } catch (err) {
        console.log('Error connecting to MongoDB', err);
        // Continue running the server even if MongoDB connection fails
    }
};

module.exports = db;