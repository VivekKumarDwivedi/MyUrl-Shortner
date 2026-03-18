import mongoose from 'mongoose';
import { serverConfig } from '.';
export async function connectDB() {
  try {
    await mongoose.connect(serverConfig.MONGO_URI);
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
}
