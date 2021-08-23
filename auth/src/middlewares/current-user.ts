import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface UserPayload {
  id: string;
  email: string;
}

// telling TS that inside Express there is a Request interface
// that we want to add a new property to it
declare global {
  namespace Express {
    interface Request {
      currentUser?: UserPayload;
    }
  }
}

export const currentUser = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.session?.jwt) {
    return next();
  }
  //get the information stored in jwt by calling verify with
  // jwt and the JWT_KEY
  try {
    const payload = jwt.verify(
      req.session.jwt,
      process.env.JWT_KEY!
    ) as UserPayload;
    // if we have a payload attach it to the request
    req.currentUser = payload;
  } catch (err) {}

  next();
};
