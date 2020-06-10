import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { MasterdataService } from 'src/app/services/masterdata.service';
import { ServiceResponse } from 'src/app/models/service-response';

@Component({
  selector: 'app-client-edit',
  templateUrl: './client-edit.component.html',
  styleUrls: ['./client-edit.component.css']
})
export class ClientEditComponent implements OnInit {

  masterData;
  clientGroup: FormGroup;
  dataTypes = [];
  constructor(
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<ClientEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private masterDataService: MasterdataService,
    private alertService: ToastrService
  ) {
    this.masterData = data;
  }

  ngOnInit(): void {
    this.clientGroup = this.formBuilder.group({
      id: new FormControl(0),
      name: new FormControl('', Validators.required),
      code: new FormControl('', Validators.required),
      url: new FormControl('', Validators.required),
      createdBy: new FormControl(null),
      createdDate: new FormControl(null),
      modifiedBy: new FormControl(null),
      modifiedDate: new FormControl(null),
    });
    this.clientGroup.reset(this.masterData);
  }

  closed() {
   
  }

  cancel() {
    this.dialogRef.close(false);
  }

  onSubmit() {
    if (this.clientGroup.valid) {
      this.masterDataService.addOrUpdateClientCodes(this.clientGroup.value).subscribe((res: ServiceResponse) => {
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
    return this.clientGroup.controls[controlName].hasError(errorName);
  }

}
