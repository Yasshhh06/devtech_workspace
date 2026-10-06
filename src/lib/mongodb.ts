import mongoose from "mongoose";

const DEFAULT_URI = "mongodb+srv://mohiteyash940_db_user:Yash06042026@cluster0.psjkfim.mongodb.net/devtech_workspace?retryWrites=true&w=majority";
const MONGODB_URI = process.env.MONGODB_URI || DEFAULT_URI;

/**
 * Global is used here to maintain a cached connection across hot reloads in development
 * and Vercel serverless function invocations.
 */
let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

export async function connectToDatabase() {
  if (cached.conn && mongoose.connection.readyState === 1) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 5000, // Fail quickly after 5s if Atlas is unreachable
      connectTimeoutMS: 5000,
    };

    cached.promise = mongoose
      .connect(MONGODB_URI, opts)
      .then((mongooseInstance) => {
        console.log("✅ Successfully connected to MongoDB Atlas Database!");
        return mongooseInstance;
      })
      .catch((err) => {
        console.error("❌ MongoDB connection error:", err.message);
        cached.promise = null;
        return null;
      });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    return null;
  }

  return cached.conn;
}
