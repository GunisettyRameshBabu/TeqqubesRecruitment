import { Component, OnInit, ViewChild } from '@angular/core';
import { AddOrEditStateComponent } from './add-or-edit-state/add-or-edit-state.component';
import { ExcelExportProperties, GridComponent, PageSettingsModel } from '@syncfusion/ej2-angular-grids';
import { ClickEventArgs } from '@syncfusion/ej2-angular-navigations';
import { ServiceResponse } from 'src/app/models/service-response';
import { UsersessionService } from 'src/app/services/usersession.service';
import { CommonService } from 'src/app/services/common.service';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';
import { MasterdataService } from 'src/app/services/masterdata.service';
import { Title } from '@angular/platform-browser';
import { UtilitiesService } from '../../../services/utilities.service';

@Component({
  selector: 'app-state-master',
  templateUrl: './state-master.component.html',
  styleUrls: ['./state-master.component.css']
})
export class StateMasterComponent implements OnInit {

  
  @ViewChild('grid', { static: false }) public grid: GridComponent;
  editSettings: { allowEditing: boolean; allowAdding: boolean; mode: string };
  toolbar: string[];
  masterdata = [];
  pageSizes: any = [15, 25, 50, 100];
  pageSettings: any = { pageSizes: true, pageSize: 15, pageCount: 5,  currentPage: 1, sort: 'name', sortOrder: 'Ascending' };
  masterTypes = [];
  masterItem: any;
  constructor(
    private alertService: ToastrService,
    private modal: MatDialog,
    private masterDataService: MasterdataService,
    private titleService: Title,
    public utilities: UtilitiesService
  ) {}

  ngOnInit(): void {
    this.titleService.setTitle('Qube Connect - State Master');
    this.modal.closeAll();
    this.masterDataService.getMasterDataType().subscribe((res: ServiceResponse) => {
      if (res.success) {
        this.masterTypes = res.data;
      } else {
        this.alertService.error(res.message);
      }
    });
    this.getData();
    this.editSettings = {
      allowEditing: false,
      allowAdding: false,
      mode: 'Dialog',
    };
    this.toolbar = ['State Data','Add State', 'Excel Export','Refresh'];
  }

  getData() {
    this.masterDataService.getStates({ size: this.pageSettings.pageSize, page: this.pageSettings.currentPage, sort: this.pageSettings.sort, sortOrder: this.pageSettings.sortOrder }).subscribe((res: ServiceResponse) => {
      if (res.success) {
       
        this.pageSettings.totalRecordsCount = res.data.totalItems;
        this.masterdata = res.data.list;
      } else {
        this.alertService.error(res.message);
      }
    });
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

  edit(data) {
    this.masterItem = data;
    this.open();
  }

  toolbarClick(args: ClickEventArgs): void {
    if (args.item.id.indexOf('excelexport') > 0) {
      // 'Grid_excelexport' -> Grid component id + _ + toolbar item name
      const excelExportProperties: ExcelExportProperties = {
        fileName: 'State Data.xlsx',
      };
      this.grid.excelExport(excelExportProperties);
    } else if (args.item.id.indexOf('Add State') > 0) {
      this.masterItem = {id: 0};
      this.open();
    } else if (args.item.id.indexOf('Refresh') > 0) {
      this.getData();
    }
  }

  open() {
    const dialogRef = this.modal.open(AddOrEditStateComponent, {
      data: this.masterItem  ,
      hasBackdrop : true,
      disableClose : true
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.masterItem = undefined;
        this.getData();
      }
    });
  }
}
