import {
  Component,
  OnInit,
  Input,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { Candidates } from 'src/app/models/candidate';
import { MatDialog } from '@angular/material/dialog';
import { AddcandidateComponent } from './addcandidate/addcandidate.component';
import { JobService } from 'src/app/services/job.service';
import { ServiceResponse } from 'src/app/models/service-response';
import {
  ToolbarItems,
  ExcelExportProperties,
  GridComponent,
  EditSettingsModel,
} from '@syncfusion/ej2-angular-grids';
import { ClickEventArgs } from '@syncfusion/ej2-angular-navigations';
import { saveAs } from 'file-saver';
import { CommonService } from 'src/app/services/common.service';
import { ViewcandidateComponent } from './viewcandidate/viewcandidate.component';

@Component({
  selector: 'app-jobcandidates',
  templateUrl: './jobcandidates.component.html',
  styleUrls: ['./jobcandidates.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class JobcandidatesComponent implements OnInit {
  @ViewChild('grid', { static: false }) public grid: GridComponent;
  @Input() candidates: any[] = [];
  @Input() jobid: any;
  @Input() canEditOrAdd: boolean = false;
  editSettings: EditSettingsModel;
  public toolbar;
  candidate: Candidates;
  dropEle: HTMLElement;
  editparams: any;
  countryCode;
  constructor(
    public dialog: MatDialog,
    private jobService: JobService,
    private commonService: CommonService
  ) {}

  ngOnInit(): void {
    this.dialog.closeAll();
    this.editparams = { params: { popupHeight: '300px' } };
    this.dropEle = document.getElementById('droparea');
    this.editSettings = {
      allowEditing: false,
      allowAdding: false,
    };
    this.toolbar =
      this.canEditOrAdd == true
        ? ['Candidates', 'Add Candidate', 'ExcelExport']
        : ['Candidates', 'ExcelExport'];
    if (this.canEditOrAdd) {
      this.commonService
        .getCountryCodeByJobId(this.jobid)
        .subscribe((res: ServiceResponse) => {
          if (res.success) {
            this.countryCode = res.data;
          }
        });
    }
  }

  addCandidate() {
    let data = { jobid: this.jobid, id: 0, countryCode: this.countryCode };
    const dialogRef = this.dialog.open(AddcandidateComponent, {
      data: data,
      hasBackdrop: true,
      disableClose: false,
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.reloadData(result);
    });
  }

  getResume(data) {
    return this.commonService.downloadResume(data.id).subscribe((res: any) => {
      saveAs(res, data.fileName);
    });
  }

  viewCandidate(rec) {
    this.dialog.open(ViewcandidateComponent, {
      data: rec,
      hasBackdrop: true,
      disableClose: true,
     
    });
  }

  toolbarClick(args: ClickEventArgs): void {
    console.log(args);
    if (args.item.id.indexOf('excelexport') > 0) {
      // 'Grid_excelexport' -> Grid component id + _ + toolbar item name
      const excelExportProperties: ExcelExportProperties = {
        fileName: 'jobcandidates.xlsx',
      };
      this.grid.excelExport(excelExportProperties);
    } else if (args.item.id.indexOf('Add Candidate') > 0) {
      this.addCandidate();
    }
  }

  private reloadData(result: any) {
    if (result) {
      this.jobService
        .getJobCandidates(this.jobid)
        .subscribe((res: ServiceResponse) => {
          this.candidates = res.data;
        });
    }
  }

  Edit(data) {
    const dialogRef = this.dialog.open(AddcandidateComponent, {
      data: data,
      hasBackdrop: true,
      disableClose: false,
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.reloadData(result);
    });
  }

  rowClick(event) {
    this.viewCandidate(event.rowData);
  }
}
