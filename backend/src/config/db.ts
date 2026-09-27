import mongoose from 'mongoose';
import { config } from './env.js';

let isMongoConnected = false;

export const connectDB = async (): Promise<boolean> => {
  try {
    await mongoose.connect(config.mongoUri, {
      serverSelectionTimeoutMS: 15000,
      connectTimeoutMS: 15000,
    });
    isMongoConnected = true;
    console.log(`[Database] ✅ MongoDB connected successfully.`);
    return true;
  } catch (error: any) {
    isMongoConnected = false;
    console.error(`[Database] ❌ MongoDB connection error: ${error.message}`);
    throw error;
  }
};

export const getIsMongoConnected = () => isMongoConnected;
