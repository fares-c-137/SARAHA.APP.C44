import mongoose from 'mongoose';
import logUtil from '../utils/logUtil.js';

export const connect = async () => {
  const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/anonymous';
  try {
    await mongoose.connect(uri, {
      autoIndex: true,
      serverSelectionTimeoutMS: 15000
    });
    logUtil.success('Database connected successfully');
  } catch (err) {
    logUtil.error('MongoDB connection error:', err.message);
    process.exit(1);
  }
};