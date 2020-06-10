import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { User } from 'src/app/models/user';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UsersessionService } from 'src/app/services/usersession.service';
import { MasterdataService } from 'src/app/services/masterdata.service';
import { ToastrService } from 'ngx-toastr';
import { ServiceResponse } from 'src/app/models/service-response';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-add-or-edit-state',
  templateUrl: './add-or-edit-state.component.html',
  styleUrls: ['./add-or-edit-state.component.css']
})
export class AddOrEditStateComponent implements OnInit {

  masterData;
  masterGroup: FormGroup;
  countries = [];
  constructor(
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<AddOrEditStateComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private userSession: UsersessionService,
    private masterDataService: MasterdataService,
    private alertService: ToastrService,
    private commonService: CommonService
  ) {
    this.masterData = data;
  }

  ngOnInit(): void {
    this.masterGroup = this.formBuilder.group({
      id: new FormControl(0),
      name: new FormControl('', Validators.required),
      code: new FormControl('', Validators.required),
      countryName: new FormControl(''),
      country: new FormControl('', Validators.required),
      createdBy: new FormControl(null),
      createdDate: new FormControl(null),
      modifiedBy: new FormControl(null),
      modifiedDate: new FormControl(null),
    });
    this.masterGroup.reset(this.masterData);

    this.commonService.getCountries().subscribe((res: ServiceResponse) => {
      if (res.success) {
        this.countries = res.data;
      } else {
        this.alertService.error(res.message);
      }
    });
  }

  closed() {
   
  }

  cancel() {
    this.dialogRef.close(false);
  }

  onSubmit() {
    if (this.masterGroup.valid) {
      this.masterDataService.addOrUpdateState(this.masterGroup.value).subscribe((res: ServiceResponse) => {
        if (res.success) {
          this.alertService.success(res.message);
          this.dialogRef.close(true);
        } else {
          this.alertService.success(res.message);
        }
      });
    }
  }

  public hasError(controlName: string, errorName: string) {
    return this.masterGroup.controls[controlName].hasError(errorName);
  }
}
