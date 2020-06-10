import {
  Component,
  OnInit,
  Inject,
  ViewEncapsulation,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { UsersessionService } from 'src/app/services/usersession.service';
import { JobService } from 'src/app/services/job.service';
import { ServiceResponse } from 'src/app/models/service-response';
import { HttpEventType } from '@angular/common/http';
import { CommonService } from 'src/app/services/common.service';
import { MasterDataTypes } from 'src/app/constants/api-end-points';
import { MasterdataService } from 'src/app/services/masterdata.service';
import { UtilitiesService } from 'src/app/services/utilities.service';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-addcandidate',
  templateUrl: './addcandidate.component.html',
  styleUrls: ['./addcandidate.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class AddcandidateComponent implements OnInit {
  job: any;
  jobGroup: FormGroup;
  statuses: any[] = [];
  @ViewChild('fileInput', { static: false }) file: ElementRef;
  resume: any;
  percentage = 0;
  public dropEle: HTMLElement ;
  countryCode;
  stateList = [];
  stateListMain = [];
  cityList = [];
  cityListMain = [];
  totalExpList = [];
  totalExpListMain = [];
  relavantExpList = [];
  visaList = [];
  visaListMain = [];
  bestWayToReachList = [];
  bestWayToReachListMain = [];
  qualificationList = [];
  qualificationListMain = [];
  constructor(
    public dialogRef: MatDialogRef<AddcandidateComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder,
    private alertService: ToastrService,
    private jobService: JobService,
    private userSession: UsersessionService,
    private commonService: CommonService,
    private masterDataService: MasterdataService,
    private utiliteis: UtilitiesService
  ) {
    this.job = data;
  }

  ngOnInit(): void {
    this.dropEle = document.getElementById('droparea');
    this.masterDataService
      .getMasterDataByType(MasterDataTypes.JobCandidateStatus)
      .subscribe((res: ServiceResponse) => {
        if (res.success) {
          this.statuses = res.data;
        } else {
          this.alertService.error(res.message);
        }
      });
    this.jobGroup = this.formBuilder.group({
      id: new FormControl(0),
      jobid: new FormControl('', Validators.required),
      firstName: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, Validators.email]),
      middleName: new FormControl(''),
      lastName: new FormControl('', Validators.required),
      status: new FormControl('', Validators.required),
      phone: new FormControl('', Validators.required),
      createdBy: new FormControl(null),
      modifiedBy: new FormControl(''),
      fileName: new FormControl(''),
      createdDate: new FormControl(new Date()),
      city: new FormControl('', Validators.required),
      state: new FormControl('', Validators.required),
      relavantExp: new FormControl('', Validators.required),
      totalExp: new FormControl('', Validators.required),
      skypeid: new FormControl(null),
      visaType: new FormControl(null),
      expectedRatePerHour: new FormControl(null),
      anyOfferExist: new FormControl(null),
      educationDetails: new FormControl(null),
      bestTimeToReach: new FormControl(null),
      bestWayToReach: new FormControl(null),
      rtr: new FormControl(null),
      highestQualification: new FormControl(null, Validators.required)
    });

    this.jobGroup.reset(this.job);
    
    this.countryCode = this.job.countryCode;
    // if (this.jobGroup.controls.id.value != "0") {
    //   this.getStates(this.job.jobid);
    //   console.log(this.job);
    // }

    this.getStates(this.job.jobid);

    this.masterDataService
    .getMasterDataByType(MasterDataTypes.Experience)
    .subscribe((res: ServiceResponse) => {
      if (res.success) {
        this.totalExpList = res.data;
        this.totalExpListMain = res.data;
        this.relavantExpList = res.data;
      } else {
        this.alertService.error(res.message);
      }
    });

    this.masterDataService
    .getMasterDataByType(MasterDataTypes.VisaType)
    .subscribe((res: ServiceResponse) => {
      if (res.success) {
        this.visaList = res.data;
        this.visaListMain = res.data;
      } else {
        this.alertService.error(res.message);
      }
    });

    this.masterDataService
    .getMasterDataByType(MasterDataTypes.WaysToReach)
    .subscribe((res: ServiceResponse) => {
      if (res.success) {
        this.bestWayToReachList = res.data;
        this.bestWayToReachListMain = res.data;
      } else {
        this.alertService.error(res.message);
      }
    });

    this.masterDataService
    .getMasterDataByType(MasterDataTypes.Qualifications)
    .subscribe((res: ServiceResponse) => {
      if (res.success) {
        this.qualificationList = res.data;
        this.qualificationListMain = res.data;
      } else {
        this.alertService.error(res.message);
      }
    });
  }

  public hasError(controlName: string, errorName: string) {
    return this.jobGroup.controls[controlName].hasError(errorName);
  }

  public hasGlobalError(controlName: string, errorName: string) {
    return this.countryCode != undefined && this.countryCode.toUpperCase() != "IN" ? this.utiliteis.IsNullOrEmpty(this.jobGroup.get(controlName).value)  : false;
  }

  cancel() {
    this.dialogRef.close(false);
  }

  onSubmit() {
    if (this.jobGroup.valid) {
      this.jobService
        .addOrUpdateCandidate(this.jobGroup.value)
        .subscribe((res: ServiceResponse) => {
          if (res.success && this.resume) {
            this.jobService
              .addCandidateResume(res.data, this.resume)
              .subscribe((result: any) => {
                if (result['type'] === HttpEventType.UploadProgress) {
                  this.percentage = Math.round(
                    (100 * result.loaded) / result.total
                  );
                } else {
                  if (result.success) {
                    this.alertService.success(result.message);
                    this.dialogRef.close(result.success);
                  } else {
                    this.alertService.error(result.message);
                  }
                }
              });
          } else {
            this.alertService.success(res.message);
            this.dialogRef.close(res.success);
          }
        });
    }
  }

  public uploadFile = (files) => {
    console.log(files);
    this.resume = files;
    this.jobGroup.controls.fileName.setValue(files[0].name);
  }

  search(query: string, list: any[], listName){
    let result = this.select(query,list)
    this[listName] = result;
  }

  select(query: string, list: any[]):any[]{
    let result: string[] = [];
    for(let a of list){
      if(a.name.toLowerCase().indexOf(query) > -1){
        result.push(a)
      }
    }
    return result
  }

  private getStates(value: any) {
    this.jobService.getStatesByJobId(value).subscribe((res: ServiceResponse) => {
      if (res.success) {
        this.stateList = res.data;
        this.stateListMain = res.data;
      }
      else {
        this.alertService.error(res.message);
      }
    });
  }

  stateChanged() {
    this.jobGroup.controls.city.setValue('');
    this.getCities();
  }

  private getCities() {
    this.commonService.getCitiesByState(this.jobGroup.controls.state.value).subscribe((res: ServiceResponse) => {
      if (res.success) {
        this.cityList = res.data;
        this.cityListMain = res.data;
      }
      else {
        this.alertService.error(res.message);
      }
    });
  }

  getResume(data) {
    return this.commonService.downloadResume(data.id).subscribe((res: any) => {
      saveAs(res, data.fileName);
    });
  }

}
