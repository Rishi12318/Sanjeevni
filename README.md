# Onnet MongoDB Application

Node.js application that connects to MongoDB database `progome` at `mongodb://localhost:27017/progome`.

## Quick Start

### 1. Install Dependencies
```powershell
npm install
```

### 2. Make Sure MongoDB is Running
Ensure MongoDB is running on `localhost:27017`. You can start it with:
```powershell
mongod
```
Or if installed as a service:
```powershell
net start MongoDB
```

### 3. Test the Connection
```powershell
npm test
```

### 4. Run the Application
```powershell
npm start
```

## Project Structure

- **`onnet-db.js`** - Mongoose-based connection module (recommended for schema-based apps)
- **`onnet-mongo-client.js`** - Native MongoDB driver client (recommended for flexibility)
- **`test-connection.js`** - Connection test script with CRUD operations
- **`index.js`** - Main application entry point
- **`package.json`** - Node.js project configuration

## Configuration

### Default Connection
```
mongodb://localhost:27017/progome
```

### Custom Connection (Environment Variable)
Set `MONGO_URI` environment variable:
```powershell
$env:MONGO_URI="mongodb://username:password@host:port/progome"
npm start
```

Or create a `.env` file and use dotenv package.

## Usage Examples

### Using Mongoose (onnet-db.js)
```javascript
const { connect, mongoose } = require('./onnet-db');

await connect();

// Define a model
const MyModel = mongoose.model('mycollection', new mongoose.Schema({
  name: String,
  data: Object
}));

// Use the model
const doc = await MyModel.create({ name: 'test', data: { foo: 'bar' } });
```

### Using Native Driver (onnet-mongo-client.js)
```javascript
const OnnetMongoClient = require('./onnet-mongo-client');

const client = new OnnetMongoClient();
await client.connect();

const collection = client.getCollection('mycollection');
await collection.insertOne({ name: 'test', data: { foo: 'bar' } });
```

## Import Data into MongoDB

### Import JSON Array
```powershell
mongoimport --uri="mongodb://localhost:27017/progome" --collection onnet --file data.json --jsonArray
```

### Import Newline-Delimited JSON
```powershell
mongoimport --uri="mongodb://localhost:27017/progome" --collection onnet --file data.ndjson --type json
```

### Import CSV
```powershell
mongoimport --uri="mongodb://localhost:27017/progome" --collection onnet --type csv --headerline --file data.csv
```

### Restore from mongodump
```powershell
mongorestore --uri="mongodb://localhost:27017/progome" C:\path\to\dump
```

## Troubleshooting

**Connection Error**: Make sure MongoDB is running
```powershell
# Check if MongoDB service is running
Get-Service MongoDB

# Start MongoDB service
net start MongoDB
```

**Port Already in Use**: Check if another process is using port 27017
```powershell
netstat -ano | findstr :27017
```

**Database Access**: Ensure you have permissions to access the `progome` database

## Next Steps

1. Modify `index.js` to add your application logic
2. Define Mongoose schemas/models in separate files
3. Add Express.js for REST API endpoints
4. Implement authentication and authorization
5. Add error handling and logging

## License

ISC
