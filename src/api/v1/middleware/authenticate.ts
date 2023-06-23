// Express
import { NextFunction, Request, Response } from 'express';
// Constants, Helpers & Types
import { ResponseCode } from '../types/enum';

// authentication checker middleware
export const authenticateUser =
  (hidden = true) =>
  (req: Request, res: Response, next: NextFunction) => {
    const user = req.session?.user;
    if (hidden) {
      // hide password and balance from authentication check
      delete user?.password;
      delete user?.balance;
    }
    if (user) {
      req.user = user;
      next();
    } else {
      res.status(401).json({
        code: ResponseCode.UNAUTHENTICATED,
        message: 'User not authenticated.',
      });
    }
  };
