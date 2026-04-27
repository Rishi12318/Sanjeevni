// test-connection.js - Test MongoDB connection and basic operations
const OnnetMongoClient = require('./onnet-mongo-client');

async function testConnection() {
  const client = new OnnetMongoClient();
  
  try {
    console.log('Testing MongoDB connection to mongodb://localhost:27017/progome\n');
    
    // Connect
    await client.connect();
    
    // Test database operations
    const db = client.getDb();
    
    // List collections
    const collections = await db.listCollections().toArray();
    console.log('\n📋 Collections in progome database:');
    if (collections.length === 0) {
      console.log('  (No collections found - database is empty)');
    } else {
      collections.forEach(col => console.log('  -', col.name));
    }
    
    // Test onnet collection
    const onnetCollection = client.getCollection('onnet');
    
    // Insert a test document
    const testDoc = {
      name: 'onnet-test',
      timestamp: new Date(),
      message: 'Connection test successful'
    };
    
    const insertResult = await onnetCollection.insertOne(testDoc);
    console.log('\n✓ Inserted test document:', insertResult.insertedId);
    
    // Query the document
    const foundDoc = await onnetCollection.findOne({ _id: insertResult.insertedId });
    console.log('✓ Retrieved test document:', foundDoc);
    
    // Count documents
    const count = await onnetCollection.countDocuments();
    console.log('\n📊 Total documents in onnet collection:', count);
    
    // Clean up test document (optional - comment out to keep it)
    await onnetCollection.deleteOne({ _id: insertResult.insertedId });
    console.log('✓ Cleaned up test document');
    
    console.log('\n✅ All tests passed! MongoDB connection is working correctly.\n');
    
  } catch (err) {
    console.error('\n❌ Test failed:', err.message);
    console.error('\nMake sure:');
    console.error('  1. MongoDB is running on localhost:27017');
    console.error('  2. You have permission to access the progome database');
    console.error('  3. Run: npm install\n');
    process.exit(1);
  } finally {
    await client.disconnect();
  }
}

// Run the test
testConnection();
