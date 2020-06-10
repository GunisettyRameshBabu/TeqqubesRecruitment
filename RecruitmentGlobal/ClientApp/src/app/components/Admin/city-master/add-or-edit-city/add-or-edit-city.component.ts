import { Component, OnInit, Inject } from '@angular/core';
import { ServiceResponse } from 'src/app/models/service-response';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { User } from 'src/app/models/user';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UsersessionService } from 'src/app/services/usersession.service';
import { MasterdataService } from 'src/app/services/masterdata.service';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-add-or-edit-city',
  templateUrl: './add-or-edit-city.component.html',
  styleUrls: ['./add-or-edit-city.component.css']
})
export class AddOrEditCityComponent implements OnInit {

  masterData;
  masterGroup: FormGroup;
  states = [];
  constructor(
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<AddOrEditCityComponent>,
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
      countryName: new FormControl('', Validators.required),
      country: new FormControl('', Validators.required),
      state: new FormControl('', Validators.required),
      stateName: new FormControl('', Validators.required),
      createdBy: new FormControl(null),
      createdDate: new FormControl(null),
      modifiedBy: new FormControl(null),
      modifiedDate: new FormControl(null),
    });
    this.masterGroup.reset(this.masterData);
    if (this.masterData.id > 0 ) {
      this.commonService
      .getStatesByCountry(this.masterData.country) 
      .subscribe((res: ServiceResponse) => {
        if (res.success) {
          this.states = res.data;
        } else {
          this.alertService.error(res.message);
        }
      });
    }
  }

  closed() {
   
  }

  cancel() {
    this.dialogRef.close(false);
  }

  onSubmit() {
    if (this.masterGroup.valid) {

      this.masterDataService.addOrUpdateCity(this.masterGroup.value).subscribe((res: ServiceResponse) => {
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
