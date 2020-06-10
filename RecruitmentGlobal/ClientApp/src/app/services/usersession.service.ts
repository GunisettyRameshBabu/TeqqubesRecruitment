import { Injectable } from '@angular/core';
import { User } from '../models/user';
import { environment } from 'src/environments/environment';
import { LoginService } from '../components/login/login.service';
import { ServiceResponse } from '../models/service-response';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class UsersessionService {
  constructor(
    private loginService: LoginService,
    private alertService: ToastrService,
    private router: Router
  ) {}

  checkUserLoggedIn() {
    return (
      sessionStorage.getItem(environment.env + '-usersession') != undefined
    );
  }

  addUserSession(user: User) {
    sessionStorage.setItem(
      environment.env + '-usersession',
      JSON.stringify(user)
    );
  }

  signOutSession() {
    const user = this.getLoggedInUser() as User;
    this.loginService
      .logout(user.sessionId)
      .subscribe((res: ServiceResponse) => {
        if (res.success) {
          sessionStorage.removeItem(environment.env + '-usersession');
          this.router.navigate(['login']);
        } else {
          this.alertService.error(res.message);
        }
      });
  }

  getLoggedInUser() {
    let user = sessionStorage.getItem(environment.env + '-usersession');
    if (user != undefined) {
      return JSON.parse(user);
    }

    return null;
  }

  getLoginType() {
    let user = sessionStorage.getItem(environment.env + '-usersession');
    if (user != undefined) {
      return (JSON.parse(user) as User).roleName;
    }

    return null;
  }
}
