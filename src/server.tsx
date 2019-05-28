import App from './App';
import UsersController from './users/users.controller';
import AuthenticationController from './authentication/authentication.controller';
 
const app = new App(
  [
    new UsersController(),
    new AuthenticationController(),
  ],
  4001,
);
 
app.listen();