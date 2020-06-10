import { Component, OnInit, Inject, ViewEncapsulation } from '@angular/core';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialog,
} from '@angular/material/dialog';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';
import { LoginService } from './login.service';
import { Login } from './login';
import { ToastrService } from 'ngx-toastr';
import { UsersessionService } from 'src/app/services/usersession.service';
import { Router } from '@angular/router';
import { LoginTypes } from 'src/app/models/user';
import { ServiceResponse } from 'src/app/models/service-response';
import { ResetPasswordComponent } from '../reset-password/reset-password.component';
import { Title } from '@angular/platform-browser';

export interface DialogData {
  type: any;
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class LoginComponent implements OnInit {
  formGroup: FormGroup;
  submitted = false;
  type: DialogData;
  constructor(
    private formBuilder: FormBuilder,
    private loginService: LoginService,
    private alertService: ToastrService,
    private sessionService: UsersessionService,
    private router: Router,
    private modal: MatDialog,
    private titleService: Title
  ) {
    // this.type = this.data;
  }

  onNoClick(): void {
    
    this.modal.closeAll();
    // this.dialogRef.close();
  }
  ngOnInit(): void {
    this.titleService.setTitle('Qube Connect - Login');
    this.router.routeReuseStrategy.shouldReuseRoute = function(){
      return false;
  };
    if (this.sessionService.checkUserLoggedIn()) {
      this.router.navigate(['home']);
    } else {
      this.formGroup = this.formBuilder.group({
        username: new FormControl('', [Validators.required, Validators.email]),
        password: new FormControl('', Validators.required),
      });
    }
  }
  onLogin() {
    this.submitted = true;
    if (this.formGroup.valid) {
      this.loginService
        .validateuser(
          new Login(
            this.formGroup.controls.username.value,
            this.formGroup.controls.password.value
          )
        )
        .subscribe(
          (res: ServiceResponse) => {
            if (res.success) {
              if (res.data.passwordChangeRequired) {
                this.formGroup.reset();
                this.showResetPasswordPage(res.data.id);
              } else {
                this.alertService.success(res.message);
                this.sessionService.addUserSession(res.data);
                this.router.navigate(['home']);
              }
            } else {
              this.alertService.error(res.message);
            }
          },
          (err) => {
            console.log(err);
            this.alertService.error(err.message);
          }
        );
    }
  }

  resetPassword() {
    if (this.formGroup.controls.username.errors == null) {
      this.loginService
        .resetPassword(this.formGroup.controls.username.value)
        .subscribe((res: ServiceResponse) => {
          if (res.success) {
            this.alertService.success(res.message);
          } else {
            this.alertService.error(res.message);
          }
        });
    } else {
      this.alertService.error('Please enter user name');
    }
  }

  showResetPasswordPage(id) {
    const dialogRef = this.modal.open(ResetPasswordComponent, {
      data: { id },
      hasBackdrop: true,
      disableClose: true,
    });
  }

  public hasError(controlName: string, errorName: string) {
    return this.formGroup.controls[controlName].hasError(errorName);
  }
}
