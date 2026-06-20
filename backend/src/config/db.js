import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/aether_coach', {
      serverSelectionTimeoutMS: 2000, // Timeout after 2 seconds instead of hanging
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.warn(`MongoDB Connection Warning: ${error.message}`);
    console.warn('Backend will run in Local In-Memory Fallback Mode. Data will not persist across restarts!');
  }
};

export default connectDB;
