// onnet-db.js - MongoDB connection module for onnet application
const mongoose = require('mongoose');

const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/progome';

async function connect() {
  try {
    await mongoose.connect(uri);
    console.log('✓ Onnet: Connected to MongoDB');
    console.log('  Database:', mongoose.connection.name);
    console.log('  Host:', mongoose.connection.host);
    console.log('  Port:', mongoose.connection.port);
    return mongoose.connection;
  } catch (err) {
    console.error('✗ Onnet: MongoDB connection error:', err.message);
    throw err;
  }
}

async function disconnect() {
  await mongoose.disconnect();
  console.log('✓ Onnet: Disconnected from MongoDB');
}

// Handle connection events
mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected');
});

module.exports = { connect, disconnect, mongoose };
