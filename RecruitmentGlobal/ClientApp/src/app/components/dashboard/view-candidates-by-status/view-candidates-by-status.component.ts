import { Component, OnInit, Inject, AfterViewInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommonService } from 'src/app/services/common.service';
import { GridComponent, ExcelExportProperties } from '@syncfusion/ej2-angular-grids';
import { ClickEventArgs } from '@syncfusion/ej2-angular-navigations';
import { JobService } from '../../../services/job.service';
import { ServiceResponse } from '../../../models/service-response';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-view-candidates-by-status',
  templateUrl: './view-candidates-by-status.component.html',
  styleUrls: ['./view-candidates-by-status.component.css']
})
export class ViewCandidatesByStatusComponent implements OnInit, AfterViewInit {

  @ViewChild('grid', { static: false }) public grid: GridComponent;
  candidates: any;
  toolbar: string[];
  pageSizes: any = [15, 25, 50, 100];
  status;
  pageSettings: any = { pageSizes: true, pageSize: 15, currentPage: 1, pageCount: 5, sort: 'jobName', sortOrder: 'Ascending' };
  constructor(
    public dialogRef: MatDialogRef<ViewCandidatesByStatusComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private jobService: JobService,
    private cdr: ChangeDetectorRef,
    private alertService: ToastrService
  ) {
    this.status = data;
    this.toolbar = ['ExcelExport'];
    this.getData();
  }

  getData() {
    this.jobService.getJobCandidatesByStatus(this.status, { size: this.pageSettings.pageSize, page: this.pageSettings.currentPage, sort: this.pageSettings.sort, sortOrder: this.pageSettings.sortOrder }).subscribe((res: ServiceResponse) => {
      if (res.success) {
        this.pageSettings.totalRecordsCount = res.data.totalItems;
        this.candidates = res.data.list;
      } else {
        this.alertService.info(res.message);
      }
    });
  }

  ngAfterViewInit() {
    this.cdr.detectChanges();
  }

  ngOnInit(): void {}

  close() {
    this.dialogRef.close(false);
  }

  
  toolbarClick(args: ClickEventArgs): void {
    console.log(args);
    if (args.item.id.indexOf('excelexport') > 0) {
      // 'Grid_excelexport' -> Grid component id + _ + toolbar item name
      const excelExportProperties: ExcelExportProperties = {
        fileName: 'jobcandidates.xlsx',
      };
      this.grid.excelExport(excelExportProperties);
    } 
  }

  onDataBound(args: any): void {
    if (args.requestType == "sorting") {
      this.pageSettings.sort = args.columnName;
      this.pageSettings.sortOrder = args.direction;
     this.getData();
    }
  }

  onPageChange(args: any): void {
    if (args.currentPage) {
      this.pageSettings.currentPage = args.currentPage;
      if (args.newProp && args.newProp.pageSize) {
        this.pageSettings.pageSize = args.newProp.pageSize
      }
     this.getData();
    }
  }

  onPageSizeChange(args: any): void {
    //if (this.pageSettings.pageSize != args.pageSize) {
    //  this.pageSettings.pageSize = args.pageSize;
    // this.getData();
    //}
  }
}
