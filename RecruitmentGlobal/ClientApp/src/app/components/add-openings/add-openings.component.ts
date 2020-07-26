import { Component, OnInit } from '@angular/core';
import { CommonService } from 'src/app/services/common.service';
import { ApiEndPoints, MasterDataTypes } from 'src/app/constants/api-end-points';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Opening } from './opening';
import { JobService } from 'src/app/services/job.service';
import { ServiceResponse } from 'src/app/models/service-response';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute } from '@angular/router';
import { User } from 'src/app/models/user';
import { UsersessionService } from 'src/app/services/usersession.service';
import { MasterdataService } from 'src/app/services/masterdata.service';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-add-openings',
  templateUrl: './add-openings.component.html',
  styleUrls: ['./add-openings.component.css'],
})
export class AddOpeningsComponent implements OnInit {
  industries = [];
  countries = [];
  cities: any = [];
  states: any = [];
  clients = [];
  jobtypes = [];
  experiences = [];
  statuses = [];
  jobGroup: FormGroup;
  id: number;
  candidates = [];
  users = [];
  usersList = [];
  job;
  minDate;

  constructor(
    private commonService: CommonService,
    private jobService: JobService,
    private alertService: ToastrService,
    private router: Router,
    private activated: ActivatedRoute,
    private userSession: UsersessionService,
    private masterDataService: MasterdataService,
    private titleService: Title
  ) {}

  ngOnInit(): void {
   
    this.activated.params.subscribe((res: any) => {
      this.id = +res.id;
      this.titleService.setTitle(`Qube Connect - ${this.id > 0 ? 'Edit Candidate' : 'Add Candidate'} `);
    });
    if (this.id != undefined && this.id > 0) {
      this.jobService
        .getJobForEdit(this.id)
        .subscribe((res: ServiceResponse) => {
          if (res.success) {
            this.minDate = res.data.targetdate;
            this.job = res.data;
            this.jobGroup.reset(res.data);
            this.jobService
              .getJobCandidates(res.data.id)
              .subscribe((res1: ServiceResponse) => {
                this.candidates = res1.data;
              });
            this.countryChanged(false);
            this.stateChanged();
          } else {
            this.alertService.error(res.message);
          }
        });

     
    } else {
      this.minDate = new Date();
    }
    this.jobGroup = new FormGroup({
      id: new FormControl(0),
      jobtitle: new FormControl('', Validators.required),
      jobid: new FormControl('', Validators.required),
      status: new FormControl('', Validators.required),
      industry: new FormControl('', Validators.required),
      country: new FormControl('', Validators.required),
      state: new FormControl('', Validators.required),
      city: new FormControl('', Validators.required),
      zip: new FormControl(''),
      description: new FormControl('', Validators.required),
      jobtype: new FormControl('', Validators.required),
      client: new FormControl('', Validators.required),
      isclientConfidencial: new FormControl(false),
      experience: new FormControl('', Validators.required),
      targetdate: new FormControl(new Date(), Validators.required),
      createdBy: new FormControl(null),
      createdDate: new FormControl(null),
      modifiedBy: new FormControl(null),
      modifiedDate: new FormControl(null),
      accountManager: new FormControl(null),
      contactName: new FormControl(null),
      assaignedTo: new FormControl(null),
    });
    this.masterDataService
      .getMasterDataByType(MasterDataTypes.Industry)
      .subscribe((res: ServiceResponse) => {
        if (res.success) {
          this.industries = res.data;
        } else {
          this.alertService.error(res.message);
        }
      });

    this.commonService
      .getCountriesByUserId()
      .subscribe((res: ServiceResponse) => {
        if (res.success) {
          this.countries = res.data;
        } else {
          this.alertService.error(res.message);
        }
      });

    this.masterDataService
      .getMasterDataByType(MasterDataTypes.JobTypes)
      .subscribe((res: ServiceResponse) => {
        if (res.success) {
          this.jobtypes = res.data;
        } else {
          this.alertService.error(res.message);
        }
      });

    this.commonService
      .getClientCodes()
      .subscribe((res: ServiceResponse) => {
        if (res.success) {
          this.clients = res.data;
        } else {
          this.alertService.error(res.message);
        }
      });

    this.masterDataService
      .getMasterDataByType(MasterDataTypes.Experience)
      .subscribe((res: ServiceResponse) => {
        if (res.success) {
          this.experiences = res.data;
        } else {
          this.alertService.error(res.message);
        }
      });

    this.masterDataService
      .getMasterDataByType(MasterDataTypes.JobStatus)
      .subscribe((res: ServiceResponse) => {
        if (res.success) {
          this.statuses = res.data;
        } else {
          this.alertService.error(res.message);
        }
      });

    this.commonService.GetUsersByCountry().subscribe((res: ServiceResponse) => {
      if (res.success) {
        this.usersList = res.data;
        this.users =
          this.id != undefined
            ? this.usersList.filter(
                (x) => x.country == this.jobGroup.controls.country.value
              )
            : this.usersList;
      }else {
        this.alertService.error(res.message);
      }
    });
  }

  cancel() {
    this.router.navigate(['jobopenings']);
  }

  onSubmit() {
    if (this.jobGroup.valid) {
      this.jobService
        .addOrUpdateOpening(this.jobGroup.value)
        .subscribe((res: ServiceResponse) => {
          if (res.success) {
            this.alertService.success(res.message);
            this.router.navigate(['jobopenings']);
          } else {
            this.alertService.error(res.message);
          }
        });
    }
  }

  countryChanged(isEdit: boolean = true) {
    this.states = [];
    this.cities = [];
    if (isEdit) {
      this.getNewJobId();
    }
    this.commonService
      .getStatesByCountry(this.jobGroup.controls.country.value)
      .subscribe((res: ServiceResponse) => {
        if (res.success) {
          this.states = res.data;
        } else {
          this.alertService.error(res.message);
        }
      });
  }

  stateChanged() {
    this.cities = [];
    this.commonService
      .getCitiesByState(this.jobGroup.controls.state.value)
      .subscribe((res: ServiceResponse) => {
        if (res.success) {
          this.cities = res.data;
        } else {
          this.alertService.error(res.message);
        }
      });
  }

  public hasError(controlName: string, errorName: string) {
    return this.jobGroup.controls[controlName].hasError(errorName);
  }

  public getNewJobId() {
    this.jobService
      .getNewJobid(this.jobGroup.controls.country.value)
      .subscribe((res: ServiceResponse) => {
        if (res.success) {
          this.jobGroup.controls.jobid.setValue(res.data);
        } else {
          this.alertService.error(res.message);
        }
      });
  }
}
