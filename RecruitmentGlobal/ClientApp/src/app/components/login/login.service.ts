import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Login } from './login';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private http: HttpClient) { }

  validateuser(login: Login) {
    return this.http.post(environment.apiUrl + 'Users/Login', login);
  }

  logout(session: string) {
    return this.http.get(environment.apiUrl + 'Users/Logout/'+ session);
  }

  resetPassword(userid) {
    return this.http.get(environment.apiUrl + 'Users/ResetPassword/'+ userid);
  }

  changePassword(user) {
    return this.http.post(environment.apiUrl + 'Users/ChangePassword', user);
  }
}
