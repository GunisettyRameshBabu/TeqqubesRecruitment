import { Component, OnInit, ViewChild } from '@angular/core';
import {
  EditSettingsModel,
  ExcelExportProperties,
  GridComponent,
  PageSettingsModel,
  Column,
} from '@syncfusion/ej2-angular-grids';
import { UsersessionService } from 'src/app/services/usersession.service';
import { User } from 'src/app/models/user';
import { ServiceResponse } from 'src/app/models/service-response';
import { JobService } from 'src/app/services/job.service';
import { ToastrService } from 'ngx-toastr';
import { RecruitCareEditComponent } from './recruit-care-edit/recruit-care-edit.component';
import { MatDialog } from '@angular/material/dialog';
import { ClickEventArgs } from '@syncfusion/ej2-angular-navigations';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { CommonService } from 'src/app/services/common.service';
import { RecruitCareViewComponent } from './recruit-care-view/recruit-care-view.component';
import { saveAs } from 'file-saver';
import { UtilitiesService } from '../../services/utilities.service';

@Component({
  selector: 'app-recruit-care',
  templateUrl: './recruit-care.component.html',
  styleUrls: ['./recruit-care.component.css'],
})
export class RecruitCareComponent implements OnInit {
  @ViewChild('grid', { static: false }) public grid: GridComponent;
  candidates = [];
  editSettings: EditSettingsModel;
  toolbar: string[];
  public selectOptions: Object;
  user: User;
  pageSizes: any = [15, 25, 50, 100];
  pageSettings: any = { pageSizes: true, pageSize: 15, currentPage: 1, pageCount : 5, sort: '' , sortOrder: 'Ascending' };
  constructor(
    private commonService: CommonService,
    private jobService: JobService,
    private alertService: ToastrService,
    private dialog: MatDialog,
    public utilities: UtilitiesService,
    private userSession: UsersessionService
  ) { }

  hasViewPermission() {
    let user = this.userSession.getLoggedInUser() as User;
    return user == null
      ? false
      : user.roleName == "Super Admin" || user.roleName == 'Admin' ? true : false;
  }

  ngOnInit(): void {
    this.dialog.closeAll();
    this.getData();
    this.editSettings = {
      allowEditing: false,
      allowAdding: false,
      mode: 'Dialog',
    };
    this.toolbar = ['Add Record', 'ExcelExport', 'Send Email'];

    this.selectOptions = {
      persistSelection: true,
      checkboxMode: 'ResetOnRowClick',
    };
  }

  private getData() {
    this.jobService.GetRecruitCare({ size: this.pageSettings.pageSize, page: this.pageSettings.currentPage, sort: this.pageSettings.sort, sortOrder : this.pageSettings.sortOrder}).subscribe((res: ServiceResponse) => {
      if (res.success) {
        this.pageSettings.totalRecordsCount = res.data.totalItems;
        this.candidates = res.data.list;
      } else {
        this.alertService.error(res.message);
      }
    });
  }

  add() {
    this.showPopup({ id: 0, anyOfferExist: false, rtr: false });
  }

  edit(data) {
    this.showPopup(data);
  }

  delete(data) {
    this.openDeleteDialog(data);
  }

  private showPopup(data: any) {
    const dialogRef = this.dialog.open(RecruitCareEditComponent, {
      data,
      hasBackdrop: true,
      disableClose: true,
      maxHeight: '80vh'
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
      this.getData();
      }
    });
  }

  rowClick(event) {
    const dialogRef = this.dialog.open(RecruitCareViewComponent, {
      data: event.rowData,
      hasBackdrop: true,
      disableClose: true
    });
  }

  toolbarClick(args: ClickEventArgs): void {
    if (args.item.id.indexOf('excelexport') > 0) {
      // 'Grid_excelexport' -> Grid component id + _ + toolbar item name
      const excelExportProperties: ExcelExportProperties = {
        fileName: 'Recruit care details.xlsx',
      };
      (this.grid.columns[1] as Column).visible = false;
      (this.grid.columns[2] as Column).visible = false;
      (this.grid.columns[3] as Column).visible = false;
      (this.grid.columns[4] as Column).visible = false;
      this.grid.excelExport(excelExportProperties);
    } else if (args.item.id.indexOf('Add Record') > 0) {
      this.add();
    } else if (args.item.id.indexOf('Send Email') > 0) {
      this.sendEmail();
    }
  }

  excelExportComplete(): void {
    (this.grid.columns[1] as Column).visible = true;
    (this.grid.columns[2] as Column).visible = true;
    (this.grid.columns[3] as Column).visible = true;
    (this.grid.columns[4] as Column).visible = false;
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
    if (this.pageSettings.pageSize != args.pageSize) {
      this.pageSettings.pageSize = args.pageSize;
      this.getData();
    }
  }
  

  sendEmail() {
    const selectedRecords = this.grid.getSelectedRecords();
    if (selectedRecords.length > 0) {
      const items = selectedRecords.map((x: any) => {
        return { key: x.jobName, value: x.email };
      });
      this.jobService.SendEmail(items).subscribe((res: ServiceResponse) => {
        if (res.success) {
          this.alertService.success(res.message);
        } else {
          this.alertService.success(res.message);
        }
      });
    } else {
      this.alertService.error('Please select atlease one record to send email');
    }
  }

  checkboxChange(args: any) {
    //console.log(JSON.stringify(args));
    console.log(args);
  }

  openDialog(data) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        message: 'Are you sure want to move?',
        buttonText: {
          ok: 'Yes',
          cancel: 'No',
        },
      },
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.move(data);
      }
    });
  }

  openDeleteDialog(data) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        message: 'Are you sure want to delete?',
        buttonText: {
          ok: 'Yes',
          cancel: 'No',
        },
      },
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.remove(data);
      }
    });
  }

  remove(data) {
    this.jobService
      .DeleteRecruitCare(data.id)
      .subscribe((res: ServiceResponse) => {
        if (res.success) {
          this.alertService.success(res.message);
          this.getData();
        } else {
          this.alertService.error(res.message);
        }
      });
  }

  move(data) {
    this.jobService
      .MoveToJobCandidates(data.id)
      .subscribe((res: ServiceResponse) => {
        if (res.success) {
          this.alertService.success(res.message);
          this.getData();
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
}
