import { Component, OnInit, Inject, ViewEncapsulation } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { JobService } from 'src/app/services/job.service';
import { UsersessionService } from 'src/app/services/usersession.service';
import { User, Roles } from 'src/app/models/user';
import { ServiceResponse } from 'src/app/models/service-response';
import { CommonService } from 'src/app/services/common.service';
import { MasterDataTypes } from 'src/app/constants/api-end-points';
import { MasterdataService } from 'src/app/services/masterdata.service';
import { UtilitiesService } from 'src/app/services/utilities.service';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-recruit-care-edit',
  templateUrl: './recruit-care-edit.component.html',
  styleUrls: ['./recruit-care-edit.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class RecruitCareEditComponent implements OnInit {
  recruitGroup: FormGroup;
  recruit: any = {};
  jobs = [];
  statusList = [];
  resume: any;
  noticeList = [];
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
  countryCode;
  qualificationList = [];
  qualificationListMain = [];

  constructor(
    public dialogRef: MatDialogRef<RecruitCareEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder,
    private alertService: ToastrService,
    private jobService: JobService,
    private userSession: UsersessionService,
    private commonService: CommonService,
    private masterDataService: MasterdataService,
    private utilities: UtilitiesService
  ) {
    this.recruit = data;
  }

  ngOnInit(): void {
    this.recruitGroup = this.formBuilder.group({
      id: new FormControl(0),
      firstName: new FormControl('', Validators.required),
      middleName: new FormControl(''),
      lastName: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, Validators.email]),
      jobid: new FormControl('', Validators.required),
      comments: new FormControl(null, Validators.required),
      phone: new FormControl('', [
        Validators.required,
        Validators.pattern(new RegExp("[0-9 ]{10}")),
      ]),
      status: new FormControl(null, Validators.required),
      createdBy: new FormControl(null),
      modifiedBy: new FormControl(null),
      createdDate: new FormControl(null),
      modifiedDate: new FormControl(null),
      fileName: new FormControl(null),
      noticePeriod: new FormControl(null, Validators.required),
      city: new FormControl(null, Validators.required),
      state: new FormControl(null, Validators.required),
      relavantExp: new FormControl(null, Validators.required),
      totalExp: new FormControl(null, Validators.required),
      skypeid: new FormControl(null),
      visaType: new FormControl(null),
      expectedRatePerHour: new FormControl(null),
      anyOfferExist: new FormControl(null),
      educationDetails: new FormControl(null),
      bestTimeToReach: new FormControl(null),
      bestWayToReach: new FormControl(null),
      rtr: new FormControl(null),
      highestQualification: new FormControl(null, Validators.required),
      currentCTC: new FormControl(''),
      expectedCTC: new FormControl('')
    });
    this.recruitGroup.reset(this.recruit);
    if(this.recruit.id > 0) {
      this.countryCode = this.recruit.countryCode;
    }
    this.jobService
      .getJobs()
      .subscribe((res: ServiceResponse) => {
        if (res.success) {
          this.jobs = res.data;
          if (this.recruit.id > 0 ) {
            this.countryCode = this.jobs.filter(x => x.id == this.recruit.jobid)[0].key; 
            this.getStates(this.recruit.jobid);
            this.getCities();
          }
        } else {
          this.alertService.error(res.message);
        }
      });

    this.masterDataService
      .getMasterDataByType(MasterDataTypes.JobCandidateStatus,true)
      .subscribe((res: ServiceResponse) => {
        if (res.success) {
          this.statusList = res.data;
        } else {
          this.alertService.error(res.message);
        }
      });

    this.masterDataService
      .getMasterDataByType(MasterDataTypes.NoticePeriod,true)
      .subscribe((res: ServiceResponse) => {
        if (res.success) {
          this.noticeList = res.data;
        } else {
          this.alertService.error(res.message);
        }
      });
     
      this.masterDataService
      .getMasterDataByType(MasterDataTypes.Experience,true)
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
      .getMasterDataByType(MasterDataTypes.VisaType,true)
      .subscribe((res: ServiceResponse) => {
        if (res.success) {
          this.visaList = res.data;
          this.visaListMain = res.data;
        } else {
          this.alertService.error(res.message);
        }
      });

      this.masterDataService
      .getMasterDataByType(MasterDataTypes.WaysToReach,true)
      .subscribe((res: ServiceResponse) => {
        if (res.success) {
          this.bestWayToReachList = res.data;
          this.bestWayToReachListMain = res.data;
        } else {
          this.alertService.error(res.message);
        }
      });

      
    this.masterDataService
    .getMasterDataByType(MasterDataTypes.Qualifications,true)
    .subscribe((res: ServiceResponse) => {
      if (res.success) {
        this.qualificationList = res.data;
        this.qualificationListMain = res.data;
      } else {
        this.alertService.error(res.message);
      }
    });
     
  }

  getResume(data) {
    return this.commonService.downloadResume(data.id,'r').subscribe((res: any) => {
      saveAs(res, data.fileName);
    });
  }

  onSubmit() {
    if (this.recruitGroup.valid) {
      this.jobService
        .addOrUpdateRecruitCare(this.recruitGroup.value)
        .subscribe((res: ServiceResponse) => {
          if (res.success) {
            if (this.resume != undefined && this.resume.length > 0) {
              this.jobService
                .addRecruitCareResume(res.data, this.resume)
                .subscribe((res1: ServiceResponse) => {
                  if (res1.success) {
                    this.alertService.success(res1.message);
                    this.dialogRef.close(true);
                  } else {
                    this.alertService.error(res1.message);
                  }
                });
            } else {
              this.alertService.success(res.message);
              this.dialogRef.close(true);
            }
          } else {
            this.alertService.error(res.message);
          }
        });
    }
  }

  cancel() {
    this.dialogRef.close(false);
  }

  public hasError(controlName: string, errorName: string) {
    return this.recruitGroup.controls[controlName].hasError(errorName);
  }

  public hasGlobalError(controlName: string, errorName: string) {
    return this.countryCode != undefined && this.countryCode.toUpperCase() != "IN" ? this.utilities.IsNullOrEmpty(this.recruitGroup.get(controlName).value)  : false;
  }

  

  public uploadFile = (files) => {
    this.resume = files;
    this.recruitGroup.controls.fileName.setValue(files[0].name);
  };

  jobChanged(event) {
    this.countryCode = this.jobs.filter(x => x.id ==event.value)[0].key;
    this.recruitGroup.controls.state.setValue(null);
    this.recruitGroup.controls.city.setValue(null);
    this.getStates(event.value);
  }

  private getStates(value: any) {
    this.jobService.getStatesByJobId(value,true).subscribe((res: ServiceResponse) => {
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
    this.recruitGroup.controls.city.setValue(null);
    this.getCities();
  }

  private getCities() {
    this.commonService.getCitiesByState(this.recruitGroup.controls.state.value,true).subscribe((res: ServiceResponse) => {
      if (res.success) {
        this.cityList = res.data;
        this.cityListMain = res.data;
      }
      else {
        this.alertService.error(res.message);
      }
    });
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
}
