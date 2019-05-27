import jwt from 'jsonwebtoken'
import TokenData, { DataStoredInToken } from './token.interface';
import IUser from './../users/user.interface'

class TokenController {

  public createToken(user: IUser): TokenData {
    const expiresIn = 60 * 60; // an hour
    const secret:string = process.env.JWT_SECRET || 'Lucas';
    const dataStoredInToken: DataStoredInToken = {
      _id: user.id,
    };
    return {
      expiresIn,
      token: jwt.sign(dataStoredInToken, secret, { expiresIn }),
    };
  }

}
 
export default TokenController;