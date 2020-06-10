import { Component, OnInit, Inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
  ValidatorFn,
  ValidationErrors,
} from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { LoginService } from '../login/login.service';
import { ServiceResponse } from 'src/app/models/service-response';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css'],
})
export class ResetPasswordComponent implements OnInit {
  passwordGroup: FormGroup;
  constructor(
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<ResetPasswordComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private loginService: LoginService,
    private alertService: ToastrService,
    private router: Router
  ) {}

  ngOnInit(): void {
    (this.passwordGroup = this.formBuilder.group({
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
      ]),
      confirm: new FormControl('', [Validators.required]),
      id: new FormControl('', Validators.required),
    })),
      { validator: passwordMatchValidator };
    this.passwordGroup.reset(this.data);
  }

  onSubmit() {
    if (this.passwordGroup.valid) {
      this.loginService
        .changePassword(this.passwordGroup.value)
        .subscribe((res: ServiceResponse) => {
          if (res.success) {
            this.alertService.success(res.message);
            this.dialogRef.close(true);
            this.router.navigate(['login']);
          } else {
            this.alertService.error(res.message);
          }
        });
    }
  }

  onPasswordInput() {
    if (this.passwordGroup.hasError('passwordMismatch')) {
      this.passwordGroup.controls.confirm.setErrors([
        { passwordMismatch: true },
      ]);
    } else this.passwordGroup.get('confirm').setErrors(null);
  }

  public hasError(controlName: string, errorName: string) {
    return this.passwordGroup.controls[controlName].hasError(errorName);
  }

  cancel() {
    this.dialogRef.close(false);
  }
}

export const passwordMatchValidator: ValidatorFn = (
  formGroup: FormGroup
): ValidationErrors | null => {
  if (formGroup.get('password').value === formGroup.get('confirm').value)
    return null;
  else return { passwordMismatch: true };
};
