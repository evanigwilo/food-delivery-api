// Entities
import User from '../src/api/v1/entity/User';

declare module 'express-session' {
  interface SessionData {
    user: Partial<User>;
  }
}

declare global {
  namespace Express {
    interface Request {
      user: Partial<User>;
    }
  }
}
export {};
