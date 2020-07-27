import {
  Component,
  OnInit,
  ViewEncapsulation,
  ChangeDetectorRef,
  AfterViewInit,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { JobService } from 'src/app/services/job.service';
import { ServiceResponse } from 'src/app/models/service-response';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ViewCandidatesByStatusComponent } from './view-candidates-by-status/view-candidates-by-status.component';
import { Title } from '@angular/platform-browser';
import { CommonService } from 'src/app/services/common.service';
import * as moment from 'moment';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class DashboardComponent implements OnInit , AfterViewInit {
  data = [];
  backGrounds = [
    'e-card e-custom-card bg-1',
    'e-card e-custom-card bg-2',
    'e-card e-custom-card bg-10',
    'e-card e-custom-card bg-11',
    'e-card e-custom-card bg-41',
  ];
  recruiters = [];
  searchModel: {recruiter: number, dateTo?: any,dateFrom?: any} = {recruiter: 0};
  
  minDate;
  ranges: any = {
    Today: [moment(), moment()],
    Yesterday: [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
    'Last 7 Days': [moment().subtract(6, 'days'), moment()],
    'Last 30 Days': [moment().subtract(29, 'days'), moment()],
    'This Month': [moment().startOf('month'), moment().endOf('month')],
    'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')],
};
  constructor(
    private modal: MatDialog,
    private jobService: JobService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private alertService: ToastrService,
    private titleService: Title,
    private commonService: CommonService
  ) {
    this.minDate = new Date();
  }

  ngOnInit(): void {
    this.titleService.setTitle('Qube Connect - Dashboard');
    this.modal.closeAll();
    this.jobService.getDashboardData().subscribe((res: ServiceResponse) => {
      if (res.success) {
        this.data = res.data;
        this.data.forEach(element => {
          element.style = this.backGrounds[Math.floor(this.random(1, 5)) - 1];
        });
      } else {
        this.router.navigate(['**']);
      }
    });
    this.commonService.GetUsersByCountry().subscribe((res: ServiceResponse) => {
      if (res.success) {
       this.recruiters = res.data;
      }else {
        this.alertService.error(res.message);
      }
    });
  }

  filter() {
    this.jobService.getDashboardFilteredData(this.searchModel).subscribe((res: ServiceResponse) => {
      if (res.success) {
        this.data = res.data;
        this.data.forEach(element => {
          element.style = this.backGrounds[Math.floor(this.random(1, 5)) - 1];
        });
      } else {
        this.router.navigate(['**']);
      }
    });
  }

  random(mn, mx) {
    return Math.random() * (mx - mn) + mn;
  }

  getColorCode() {
    return this.backGrounds[Math.floor(this.random(1, 5)) - 1];
  }

  ngAfterViewInit() {
    this.cdr.detectChanges();
  }

  showDetails(i) {
    if (i.Value.Value == 0) {
      this.alertService.info('No records found');
    } else {
      this.modal.open(ViewCandidatesByStatusComponent, {
        data: i.Value.Key,
        hasBackdrop: true,
        disableClose: false
      });
     
    }
  
  }
}
