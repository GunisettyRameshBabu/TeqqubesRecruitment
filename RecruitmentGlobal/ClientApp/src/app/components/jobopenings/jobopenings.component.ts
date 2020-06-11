import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { JobService } from '../../services/job.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UsersessionService } from 'src/app/services/usersession.service';
import {
  GridModel,
  GridComponent,
  DetailRowService,
  DetailDataBoundEventArgs,
  ToolbarItems,
  ExcelExportProperties,
  EditSettingsModel,
} from '@syncfusion/ej2-angular-grids';

import { ClickEventArgs } from '@syncfusion/ej2-angular-navigations';
import { MatDialog } from '@angular/material/dialog';
import { AddcandidateComponent } from '../jobcandidates/addcandidate/addcandidate.component';
import { Title } from '@angular/platform-browser';
import { UtilitiesService } from '../../services/utilities.service';

@Component({
  selector: 'app-jobopenings',
  templateUrl: './jobopenings.component.html',
  styleUrls: ['./jobopenings.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class JobopeningsComponent implements OnInit {
  openings: { jobs: any[]; candidates: any[] } = { candidates: [], jobs: [] };
  type;
  public toolbarOptions: any[];
  public childGrid: GridModel = {
    queryString: 'jobid',
    dataSource: this.openings.candidates,
    columns: [
      { field: 'jobid', headerText: 'Job Id', width: 200, visible: false },
      { field: 'firstName', headerText: 'First Name', width: 200 },
      { field: 'middleName', headerText: 'Middle Name', width: 200 },
      { field: 'lastName', headerText: 'Last Name', width: 200 },
      { field: 'phone', headerText: 'Phone', width: 200 },
      { field: 'statusName', headerText: 'Status', width: 200 },
      { field: 'email', headerText: 'Email', width: 200 },
      {
        field: 'createdByName',
        headerText: 'Created By',
        width: 200,
        visible: false,
      },
      { field: 'createdDate', headerText: 'Created Date', width: 200 },
      { field: 'modifiedName', headerText: 'Modified By', width: 200 },
      { field: 'modifedDate', headerText: 'Modified Date', width: 200 },
      { field: 'stateName', headerText: 'State Name', width: 200 },
      { field: 'cityName', headerText: 'City Name', width: 200 },
      { field: 'totalExpName', headerText: 'Total Exp.', width: 200 },
      { field: 'relavantExpName', headerText: 'Relavant Exp.', width: 200 },
      {
        field: 'bestWayToReachName',
        headerText: 'Best Way to reach',
        width: 200,
      },
      { field: 'visaTypeName', headerText: 'VISA Type', width: 200 },
      {
        field: 'highestQualificationName',
        headerText: 'Highest Qualification',
        width: 200,
      },
    ],
    load() {
      //   // this.dataSource = [
      //   //   { firstName: 'test', email: 'test', phone: '99999', exp: '11' },
      //   // ];
      //   const jobid = 'jobid';
      //   (this as GridComponent).parentDetails.parentKeyFieldValue = ((this as GridComponent).parentDetails.parentRowData as
      //   { jobid?: string }
      // )[jobid];
    },
  };
  @ViewChild('grid', { static: false }) public grid: GridComponent;
  public editSettings: EditSettingsModel;
  public pageSettings: Object;
  constructor(
    public jobService: JobService,
    private router: Router,
    private alertService: ToastrService,
    public utilities: UtilitiesService,
    private modal: MatDialog,
    private activatedRoute: ActivatedRoute,
    private titleService: Title
  ) {}

  ngOnInit(): void {
    
    this.modal.closeAll();
    this.toolbarOptions = ['Openings', 'ExcelExport', 'Add New'];
    this.pageSettings = { pageSizes: true, pageSize: 10 };
    this.editSettings = { allowAdding: false };
    this.activatedRoute.queryParams.subscribe((params: any) => {
      this.type = params.type;
      this.titleService.setTitle(`Qube Connect - ${ this.type == 'in' ? 'India ' : this.type == 'gl' ? 'Global ' : 'All ' } Job Openings`);
    });
    this.getData();
  }

  private getData() {
    this.jobService.getJobOpenings(this.type).subscribe((res: any) => {
      if (res.success) {
        this.openings = res.data;
        this.childGrid.dataSource = res.data.candidates;
      } else {
        this.alertService.error(res.message);
      }
    });
  }

  AddCandidate(rec) {
    let data = { jobid: rec.id, id: 0, countryCode: rec.countryCode };
    const dialogRef = this.modal.open(AddcandidateComponent, {
      data: data,
      hasBackdrop: true,
      disableClose: false
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
      this.getData();
      }
    });
  }

  rowClick(event) {
    this.router.navigate(['jobdetails', event.rowData.id]);
  }

  showDetails(item) {
    this.router.navigate(['jobdetails', item.id]);
  }

  Edit(data) {
    this.router.navigate(['', 'editjob', data.id]);
  }

  toolbarClick(args: ClickEventArgs): void {
    console.log(args);
    if (args.item.id.indexOf('excelexport') > 0) {
      // 'Grid_excelexport' -> Grid component id + _ + toolbar item name
      const excelExportProperties: ExcelExportProperties = {
        fileName: 'jobopenings.xlsx',
      };
      this.grid.excelExport(excelExportProperties);
    } else if (args.item.id.indexOf('Add New') > 0) {
      this.router.navigate(['addjob']);
    }
  }

  add() {
    this.router.navigate(['addjob']);
  }

  onLoad(event): void {
    console.log(event);
    this.grid.childGrid.dataSource = [
      { name: 'test', email: 'test', phone: '99999', exp: '11' },
    ]; // assign data source for child grid.
  }
}
