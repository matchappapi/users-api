import { Router, Request, Response } from 'express';
import validationMiddleware from '../helpers/middlewares/validation-middleware';
import userDTO from './user.dto';
import IUser from './user.interface';
import usersMock from '../helpers/mocks/users.mock';
 
class UsersController {

  public path = '/users';
  public router = Router();
  
  constructor() {
    this.intializeRoutes();
  }
 
  private intializeRoutes() {
    this.router.get(this.path, this.getAllUsers);
    this.router.post(this.path, validationMiddleware(userDTO), this.createUser);
    this.router.patch(this.path, validationMiddleware(userDTO, true), this.createUser);
  }
 
  private getAllUsers = (request: Request, response: Response) => {
    response.send(usersMock);
  }
 
  private createUser = (request: Request, response: Response) => {
    const user: IUser = request.body;
    usersMock.concat(user);
    response.send(user);
  }

}
 
export default UsersController;