import { NextFunction, Response } from 'express';
import jwt from 'jsonwebtoken';
import AuthenticationTokenMissingException from '../exceptions/AuthenticationTokenMissingException';
import WrongAuthenticationTokenException from '../exceptions/WrongAuthenticationTokenException';
import RequestWithUser from '../interfaces/requestWithUser.inteface';
import { DataStoredInToken } from '../../token/token.interface';
import usersMock from '../mocks/users.mock'
async function authMiddleware(req: RequestWithUser, res: Response, next: NextFunction) {
  const cookies = req.cookies;
  if (cookies && cookies.Authorization) {
    const secret:string = process.env.JWT_SECRET || 'Lucas';
    try {
      const verificationResponse:DataStoredInToken = jwt.verify(cookies.Authorization, secret) as DataStoredInToken;
      const id = verificationResponse.id;
      const user = usersMock.find(user => user.id === id);
      if (user) {
        req.user = user;
        next();
      } else {
        next(new WrongAuthenticationTokenException());
      }
    } catch (error) {
      next(new WrongAuthenticationTokenException());
    }
  } else {
    next(new AuthenticationTokenMissingException());
  }
}
 
export default authMiddleware;