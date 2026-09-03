import mongoose from 'mongoose';

const MONGODB_OPTIONS = {
  bufferCommands: true,
  // Fail faster so the UI doesn't wait ~90s on DNS timeouts
  serverSelectionTimeoutMS: 8000,
  connectTimeoutMS: 8000,
  socketTimeoutMS: 45000,
  // Keep a few sockets warm in Next.js / Vercel
  maxPoolSize: 5,
  minPoolSize: 0,
  // Prefer IPv4 — avoids common Windows querySrv / DNS ETIMEOUT issues
  family: 4,
};

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
  const MONGODB_URI = process.env.MONGODB_URI?.trim();

  if (!MONGODB_URI) {
    console.warn('MONGODB_URI not defined. Running in demo mode.');
    return null;
  }

  // Already connected — reuse
  if (cached.conn && mongoose.connection.readyState === 1) {
    return cached.conn;
  }

  // If a connect is already in flight, wait for that single promise
  // (prevents connection storms when dashboard fires 8+ APIs at once)
  if (!cached.promise) {
    cached.promise = mongoose
      .connect(MONGODB_URI, MONGODB_OPTIONS)
      .then((m) => {
        cached.conn = m.connection;
        console.log('✅ MongoDB connected');
        return m.connection;
      })
      .catch((error) => {
        cached.promise = null;
        cached.conn = null;
        throw error;
      });
  }

  try {
    const conn = await cached.promise;
    return conn;
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    return null;
  }
}

export const isConnected = () => mongoose.connection.readyState === 1;

export function getDbUnavailableReason() {
  if (!process.env.MONGODB_URI?.trim()) {
    return 'MONGODB_URI is missing. Add it to Vercel Environment Variables, then redeploy.';
  }
  return 'MongoDB connection timed out. Please try again in a few seconds.';
}

/** Use on write endpoints — retries a couple times before failing. */
export async function ensureConnected(retries = 2) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    const connection = await connectDB();
    if (connection && isConnected()) return true;

    // Allow a fresh attempt after a failed connect
    cached.promise = null;
    cached.conn = null;

    if (attempt < retries) {
      await new Promise((r) => setTimeout(r, 300 * attempt));
    }
  }
  return false;
}

export default connectDB;
