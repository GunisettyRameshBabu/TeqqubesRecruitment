import { Component, OnInit, Inject, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { User } from 'src/app/models/user';
import { CommonService } from 'src/app/services/common.service';
import { ApiEndPoints, MasterDataTypes } from 'src/app/constants/api-end-points';
import { UsersService } from 'src/app/services/users.service';
import { ToastrService } from 'ngx-toastr';
import { ServiceResponse } from 'src/app/models/service-response';
import { UsersessionService } from 'src/app/services/usersession.service';
import { MasterdataService } from 'src/app/services/masterdata.service';

@Component({
  selector: 'app-useredit',
  templateUrl: './useredit.component.html',
  styleUrls: ['./useredit.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class UsereditComponent implements OnInit {
  roles = [];
  countries = [];
  userGroup: FormGroup;
  user: User;
  userEditGroup: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<UsereditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: User,
    private router: Router,
    private commonService: CommonService,
    private userService: UsersService,
    private alertService: ToastrService,
    private userSession: UsersessionService,
    private masterDataService: MasterdataService
  ) {
    this.user = data;
  }

  ngOnInit(): void {
    this.masterDataService
      .getMasterDataByType(MasterDataTypes.Roles)
      .subscribe((res: ServiceResponse) => {
        if (res.success) {
          this.roles = res.data;
        } else {
          this.alertService.error(res.message);
        }
      });
    this.commonService.getCountries().subscribe((res: ServiceResponse) => {
      if (res.success) {
        this.countries = res.data;
      } else {
        this.alertService.error(res.message);
      }
    });
    if (this.user.id == undefined) {
      this.userGroup = new FormGroup({
        firstName: new FormControl('', Validators.required),
        middleName: new FormControl(''),
        lastName: new FormControl('', Validators.required),
        email: new FormControl('', [Validators.required, Validators.email]),
        userid: new FormControl(''),
        password: new FormControl('', Validators.required),
        repassword: new FormControl('', [Validators.required]),
        roleId: new FormControl('', Validators.required),
        countryId: new FormControl('', Validators.required),
        active: new FormControl(true),
        createdBy: new FormControl(null),
        modifiedBy: new FormControl(null),
        createdDate: new FormControl(null),
        modifiedDate: new FormControl(null),
      });
    } else {
      this.userEditGroup = new FormGroup({
        id: new FormControl('', Validators.required),
        firstName: new FormControl('', Validators.required),
        middleName: new FormControl(''),
        lastName: new FormControl('', Validators.required),
        email: new FormControl('', [Validators.required, Validators.email]),
        userid: new FormControl(''),
        roleId: new FormControl('', Validators.required),
        countryId: new FormControl('', Validators.required),
        active: new FormControl(false),
        createdBy: new FormControl(null),
        modifiedBy: new FormControl(null),
        createdDate: new FormControl(null),
        modifiedDate: new FormControl(null),
      });
      this.userEditGroup.reset(this.user);
    }
  }

  onSubmit() {
    if (this.user.id == undefined) {
      if (this.userGroup.valid) {
        const logginUser = this.userSession.getLoggedInUser() as User;
        this.userGroup.controls.userid.setValue(
          this.userGroup.controls.email.value
        );
        this.userService.adduser(this.userGroup.value).subscribe((res: any) => {
          this.alertService.success('User added successfully');
          this.dialogRef.close(true);
        });
      }
    } else {
      if (this.userEditGroup.valid) {
        const logginUser = this.userSession.getLoggedInUser() as User;
        this.userEditGroup.controls.userid.setValue(
          this.userEditGroup.controls.email.value
        );
        this.userEditGroup.controls.modifiedBy.setValue(logginUser.id);
        this.userService
          .updateuser(this.userEditGroup.value)
          .subscribe((res: ServiceResponse) => {
            if (res.success) {
              this.alertService.success(res.message);
              this.dialogRef.close(true);
            } else {
              this.alertService.error(res.message);
            }
          });
      }
    }
  }

  public hasError(controlName: string, errorName: string) {
    return this.user.id == undefined
      ? this.userGroup.controls[controlName].hasError(errorName)
      : this.userEditGroup.controls[controlName].hasError(errorName);
  }

  cancel() {
    this.dialogRef.close(false);
  }
}
