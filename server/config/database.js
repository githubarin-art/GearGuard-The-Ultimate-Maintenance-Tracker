const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '..', '..', '.env') });

const envUri = process.env.MONGO_URI || process.env.MONGO_URL;
const defaultLocal = 'mongodb://localhost:27017/gearguard';
const defaultLocalIPv4 = 'mongodb://127.0.0.1:27017/gearguard';

const connectDatabase = async () => {
  const candidates = [];
  if (envUri) candidates.push(envUri);
  candidates.push(defaultLocal);
  candidates.push(defaultLocalIPv4);

  let lastErr = null;
  for (const uri of candidates) {
    try {
      await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
      console.log(`✓ MongoDB connected: ${uri}`);
      return;
    } catch (err) {
      lastErr = err;
      // try next
    }
  }

  console.error('✗ Unable to connect to MongoDB. Tried URIs:', candidates);
  console.error('Error (last):', lastErr && lastErr.message ? lastErr.message : lastErr);
  console.error('Please ensure MongoDB is running or set a valid MONGO_URI in your .env (e.g. mongodb://127.0.0.1:27017/gearguard or your Atlas URI).');
  throw lastErr || new Error('Unable to connect to MongoDB');
};

module.exports = { mongoose, connectDatabase };
