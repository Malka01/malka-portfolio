import mongoose from 'mongoose';

/**
 * MongoDB connection with singleton caching.
 *
 * Why a singleton: Next.js API routes are hot-reloaded in dev, and serverless
 * functions reuse containers. Without caching, we would create a new MongoDB
 * connection on every request and exhaust the connection pool.
 */

let cached = global.__medicare360_mongoose;
if (!cached) {
  cached = global.__medicare360_mongoose = {
    conn: null,
    promise: null,
  };
}

export async function connectDB() {
  if (cached.conn) return cached.conn;

  const uri = process.env.MONGODB_URI;

  if (!uri) {
    throw new Error(
      'MONGODB_URI is not defined. Add it to .env.local'
    );
  }

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(uri, {
        bufferCommands: false,
        serverSelectionTimeoutMS: 5000,
      })
      .then((m) => m);
  }

  try {
    cached.conn = await cached.promise;
  } catch (err) {
    cached.promise = null;
    throw err;
  }

  return cached.conn;
}

export async function isDBConnected() {
  try {
    await connectDB();
    return mongoose.connection.readyState === 1;
  } catch {
    return false;
  }
}