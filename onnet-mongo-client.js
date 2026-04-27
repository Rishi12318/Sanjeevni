// onnet-mongo-client.js - Native MongoDB driver connection for onnet application
const { MongoClient } = require('mongodb');

const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/progome';

class OnnetMongoClient {
  constructor() {
    this.client = new MongoClient(uri);
    this.db = null;
  }

  async connect() {
    try {
      await this.client.connect();
      this.db = this.client.db(); // Uses 'progome' from URI
      console.log('✓ Onnet: Connected to MongoDB (native driver)');
      console.log('  Database:', this.db.databaseName);
      return this.db;
    } catch (err) {
      console.error('✗ Onnet: MongoDB connection error:', err.message);
      throw err;
    }
  }

  async disconnect() {
    await this.client.close();
    console.log('✓ Onnet: Disconnected from MongoDB');
  }

  getDb() {
    if (!this.db) {
      throw new Error('Database not connected. Call connect() first.');
    }
    return this.db;
  }

  getCollection(name) {
    return this.getDb().collection(name);
  }
}

module.exports = OnnetMongoClient;
