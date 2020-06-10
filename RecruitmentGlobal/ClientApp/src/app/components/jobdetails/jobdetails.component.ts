import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { JobService } from '../../services/job.service';
import { MatDialog } from '@angular/material/dialog';
import { ServiceResponse } from 'src/app/models/service-response';
import { ToastrService } from 'ngx-toastr';
import { UsersessionService } from 'src/app/services/usersession.service';
import { User } from 'src/app/models/user';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-jobdetails',
  templateUrl: './jobdetails.component.html',
  styleUrls: ['./jobdetails.component.css'],
})
export class JobdetailsComponent implements OnInit {
  constructor(
    private router: ActivatedRoute,
    private service: JobService,
    public dialog: MatDialog,
    private alertService: ToastrService,
    private sessionService: UsersessionService,
    private titleService: Title
  ) {}
  job;
  jobid;
  ngOnInit(): void {
    this.titleService.setTitle('Qube Connect - Job Details');
    this.dialog.closeAll();
    let user = this.sessionService.getLoggedInUser() as User;
    this.router.params.subscribe((res: any) => {
      this.jobid = res.jobid;
      this.service
        .getJobDetails(this.jobid, user.id)
        .subscribe((data: ServiceResponse) => {
          if (data.success) {
            this.job = data.data;
          } else {
            this.alertService.error(data.message);
          }
        });
    });
  }

  addCandidate() {}
}
