import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { connectDB } from '@/lib/medicare360/db';

const START_TIME = Date.now();

async function checkDatabase() {
  try {
    await connectDB();
    return mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
  } catch {
    return 'error';
  }
}

async function checkAuth() {
  const secret = process.env.JWT_SECRET;
  return secret && secret.length >= 32 ? 'configured' : 'not_configured';
}

export async function GET() {
  const dbStatus = await checkDatabase();
  const authStatus = await checkAuth();

  const payload = {
    success: true,
    project: 'MediCare360',
    version: '0.2.0',
    phase: 2,
    environment: process.env.NODE_ENV || 'development',
    services: {
      api: 'online',
      database: dbStatus,
      auth: authStatus,
    },
    uptimeSeconds: Math.floor((Date.now() - START_TIME) / 1000),
    timestamp: new Date().toISOString(),
    disclaimer:
      'Demo healthcare management platform developed as a portfolio project.',
  };

  return NextResponse.json(payload, {
    status: 200,
    headers: { 'Cache-Control': 'no-store' },
  });
}