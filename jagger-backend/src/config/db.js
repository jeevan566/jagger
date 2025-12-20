import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const MONGO_URI = process.env.MONGO_URI || '';

export const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI, {
      // useNewUrlParser, useUnifiedTopology default in Mongoose 6+
    });
    console.log('✅ MongoDB connected');
  } catch (err) {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  }
};
