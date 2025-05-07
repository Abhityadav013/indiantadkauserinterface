import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || '';  // Your MongoDB URI

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable');
}

let cachedDb: mongoose.Connection | null = null;

export const connectToDatabase = async () => {
  if (cachedDb) {
    return cachedDb;
  }

  try {
    const db = await mongoose.connect(MONGODB_URI);
    cachedDb = db.connection;
    return cachedDb;
  } catch (error) {
    console.error('Failed to connect to MongoDB', error);
    throw new Error('Database connection failed');
  }
};
