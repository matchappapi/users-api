import TokenData from '../token/token.interface';

class CookieController {

  public createCookie(tokenData: TokenData) {
    return `Authorization=${tokenData.token}; HttpOnly; Max-Age=${tokenData.expiresIn}`;
  }

}
 
export default CookieController;