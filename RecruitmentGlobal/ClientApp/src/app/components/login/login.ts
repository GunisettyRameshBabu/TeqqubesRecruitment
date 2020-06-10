import { LoginTypes } from 'src/app/models/user';

export class Login {
  UserId: string;
  Password: string;
  LoginType: LoginTypes;
  constructor(username: string, password: string) {
    this.Password = password;
    this.UserId = username;
    this.LoginType = LoginTypes.Admin;
  }
}
