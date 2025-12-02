import { NextResponse } from 'next/server';

export async function GET() {
  const healthStatus = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    services: {
      api: 'up',
      openai: process.env.OPENAI_API_KEY ? 'configured' : 'missing_key',
      redis: process.env.REDIS_URL ? 'configured' : 'not_configured',
    },
    uptime: process.uptime(),
    memory: {
      used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
      total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024),
    }
  };

  return NextResponse.json(healthStatus);
}