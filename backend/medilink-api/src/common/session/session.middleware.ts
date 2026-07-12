import session from 'express-session';
import connectRedis from 'connect-redis';
import Redis from 'ioredis';

const RedisStore = new (connectRedis as any)(session);

const redisUrl = process.env.REDIS_URL;
const redisHost = process.env.REDIS_HOST || 'localhost';
const redisPort = parseInt(process.env.REDIS_PORT || '6379', 10);
const redisPassword = process.env.REDIS_PASSWORD || undefined;

export const redisClient = redisUrl
  ? new Redis(redisUrl)
  : new Redis({
      host: redisHost,
      port: redisPort,
      password: redisPassword,
    });

redisClient.on('error', (error) => {
  console.error('Redis session store error:', error);
});

export const sessionStore = new RedisStore({
  client: redisClient,
  prefix: 'sess:',
});

export const sessionMiddleware = session({
  store: sessionStore,
  secret: process.env.SESSION_SECRET || 'default-session-secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 8 * 60 * 60 * 1000, // 8 hours
  },
});

export function parseSessionId(cookieHeader?: string): string | null {
  if (!cookieHeader) {
    return null;
  }

  const cookies = cookieHeader.split(';').reduce<Record<string, string>>((acc, cookiePart) => {
    const [rawName, ...rawValue] = cookiePart.trim().split('=');
    if (!rawName || rawValue.length === 0) {
      return acc;
    }

    acc[rawName] = decodeURIComponent(rawValue.join('='));
    return acc;
  }, {});

  let sessionCookie = cookies['connect.sid'] || cookies['session_id'];
  if (!sessionCookie) {
    return null;
  }

  if (sessionCookie.startsWith('s:')) {
    sessionCookie = sessionCookie.slice(2);
    const dotIndex = sessionCookie.lastIndexOf('.');
    if (dotIndex > 0) {
      sessionCookie = sessionCookie.slice(0, dotIndex);
    }
  }

  return sessionCookie;
}
