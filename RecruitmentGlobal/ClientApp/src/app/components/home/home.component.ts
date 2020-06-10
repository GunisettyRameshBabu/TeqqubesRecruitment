import { Component, OnInit, ViewEncapsulation } from '@angular/core';

import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { LoginComponent } from '../login/login.component';
import { UsersessionService } from 'src/app/services/usersession.service';
import { User } from 'src/app/models/user';
import { Router } from '@angular/router';
import { EditSettingsModel } from '@syncfusion/ej2-angular-grids';
import { JobService } from 'src/app/services/job.service';
import { ServiceResponse } from 'src/app/models/service-response';
import { ToastrService } from 'ngx-toastr';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class HomeComponent implements OnInit {

  user: User;

  constructor(
    public dialog: MatDialog,
    private userSession: UsersessionService,
    private router: Router,
    private jobService: JobService,
    private alertService: ToastrService,
    private titleService: Title
  ) {}

  ngOnInit(): void {
    this.titleService.setTitle('Qube Connect - Home');
   this.dialog.closeAll();
  }
  Login(type: any) {
    const dialogRef = this.dialog.open(LoginComponent, {
      data: { type },
      hasBackdrop: true,
      disableClose: true,
    
    });
  }

  checkUserLoggedIn() {
    return this.userSession.checkUserLoggedIn();
  }

  hasViewPermission(type) {
    let user = this.userSession.getLoggedInUser() as User;
    return user == null
      ? false
      : (user.loginTypes == 'Admin' || user.loginTypes == null)
      ? true
      : user.loginTypes.split(',').indexOf(type) > 0;
  }

  view(type) {
    switch (type) {
      case 'in':
      case 'gl':
      case 'all':
        this.router.navigate(['jobopenings'], { queryParams : { type: type }});
        break;
      case 'new':
        this.router.navigate(['addjob']);
        break;
      default:
        break;
    }
  }
}
