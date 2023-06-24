// Session
import session from 'express-session';
// Redis
import Redis from 'ioredis';
import connectRedis from 'connect-redis';
// Constants, Helpers & Types
import { SESSION_ID, SESSION_SECRET, REDIS_DB_HOST, REDIS_DB_PORT, maxAge } from '../constants';

// Configure redis client
export const client = new Redis({
  host: REDIS_DB_HOST,
  port: Number(REDIS_DB_PORT),
  lazyConnect: true,
  reconnectOnError: () => true,
});

client.on('connect', () => {
  console.log('Connected to RedisDB');
});
client.on('error', () => {
  console.log('Waiting for RedisDB');
});

const redisStore = connectRedis(session);

// configure session using redis client
export default session({
  name: SESSION_ID,
  secret: SESSION_SECRET,
  saveUninitialized: false,
  resave: false,
  store: new redisStore({
    client,
    disableTouch: true,
  }),
  cookie: {
    maxAge,
    secure: false,
    // prevent client side JS from reading the cookie
    httpOnly: true,
  },
});
