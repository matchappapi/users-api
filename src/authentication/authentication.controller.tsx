import { Router, Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import validationMiddleware from "../helpers/middlewares/validation-middleware";
import UserWithThatEmailAlreadyExistsException from '../helpers/exceptions/UserWithThatEmailAlreadyExistsException';
import WrongCredentialsException from '../helpers/exceptions/WrongCredentialsException';
import CreateUserDTO from "../users/user.dto";
import CreateLoginDTO from "./authentication.dto";
import TokenController from '../token/token.controller';
import CookieController from '../cookie/cookie.controller';
import IUser from '../users/user.interface'
import usersMock from '../helpers/mocks/users.mock';
 
class AuthenticationController {

  public path = '/auth';
  public router = Router();
  
  constructor() {
    this.intializeRoutes();
  }
 
  private intializeRoutes() {
    this.router.post(`${this.path}/register`, validationMiddleware(CreateUserDTO), this.register);
    this.router.post(`${this.path}/signin`, validationMiddleware(CreateLoginDTO), this.login);
    this.router.post(`${this.path}/logout`, this.logout);
  }
 
  private register = async (req: Request, res: Response, next: NextFunction) => {
    const userData: CreateUserDTO = req.body;
    const user = usersMock.find(user => user.email === userData.email);
    if(user)
      next(new UserWithThatEmailAlreadyExistsException(userData.email))
    else {
      const hashedPassword:string = await bcrypt.hash(userData.password, 10);
      const userList:IUser[] = usersMock.concat({
        ...userData,
        password: hashedPassword
      });
      const user = userList[userList.length - 1];
      const tokenData = new TokenController().createToken(user)
      res.setHeader('Set-Cookie', [new CookieController().createCookie(tokenData)]);
      res.send(user);
    }
  }
 
  private login = async (req: Request, res: Response, next: NextFunction) => {
    const logInData: CreateLoginDTO = req.body;
    const user = usersMock.find(user => user.email === logInData.email)
    if(user) {
      const isPasswordMatching = await bcrypt.compare(logInData.password, user.password);
      if (isPasswordMatching) {
        const tokenData = new TokenController().createToken(user);
        res.setHeader('Set-Cookie', [new CookieController().createCookie(tokenData)]);
        res.send(user);
      } else
        next(new WrongCredentialsException());
    } else 
      next(new WrongCredentialsException());
  }

  private logout = (req: Request, res: Response) => {
    res.setHeader('Set-Cookie', ['Authorization=;Max-age=0']);
    res.sendStatus(200);
  }

}
 
export default AuthenticationController;