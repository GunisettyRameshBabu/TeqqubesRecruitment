import { Component, OnInit, ViewChild } from '@angular/core';
import { UsersessionService } from 'src/app/services/usersession.service';
import { CommonService } from 'src/app/services/common.service';
import { ServiceResponse } from 'src/app/models/service-response';
import { ToastrService } from 'ngx-toastr';
import { ClickEventArgs } from '@syncfusion/ej2-angular-navigations';
import {
  ExcelExportProperties,
  GridComponent,
} from '@syncfusion/ej2-angular-grids';
import { MatDialog } from '@angular/material/dialog';
import { EditOrAddMasterDataComponent } from './edit-or-add-master-data/edit-or-add-master-data.component';
import { MasterdataService } from 'src/app/services/masterdata.service';
import { Title } from '@angular/platform-browser';
import { UtilitiesService } from '../../../services/utilities.service';

@Component({
  selector: 'app-master-data',
  templateUrl: './master-data.component.html',
  styleUrls: ['./master-data.component.css'],
})
export class MasterDataComponent implements OnInit {
  @ViewChild('grid', { static: false }) public grid: GridComponent;
  editSettings: { allowEditing: boolean; allowAdding: boolean; mode: string };
  toolbar: string[];
  masterdata = [];
  pageSizes: any = [15, 25, 50, 100];
  pageSettings: any = { pageSizes: true, pageSize: 15, currentPage: 1, pageCount: 5, sort: 'firstName', sortOrder: 'Ascending' };
  masterTypes = [];
  masterItem: any;
  constructor(
    private alertService: ToastrService,
    private modal: MatDialog,
    private masterDataService: MasterdataService,
    private titleService: Title,
    private utilities: UtilitiesService
  ) {}

  ngOnInit(): void {
    this.titleService.setTitle('Qube Connect - Master Data');
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
    this.toolbar = ['Master Data','Add Master Record', 'ExcelExport'];
  }

  getData() {
    this.masterDataService.getMasterData({ size: this.pageSettings.pageSize, page: this.pageSettings.currentPage, sort: this.pageSettings.sort, sortOrder: this.pageSettings.sortOrder }).subscribe((res: ServiceResponse) => {
      if (res.success) {
        this.pageSettings.totalRecordsCount = res.data.totalItems;
        this.masterdata = res.data.list;
      } else {
        this.alertService.error(res.message);
      }
    });
  }



  edit(data) {
    this.masterItem = data;
    this.open();
  }

  toolbarClick(args: ClickEventArgs): void {
    if (args.item.id.indexOf('excelexport') > 0) {
      // 'Grid_excelexport' -> Grid component id + _ + toolbar item name
      const excelExportProperties: ExcelExportProperties = {
        fileName: 'Master Data.xlsx',
      };
      this.grid.excelExport(excelExportProperties);
    } else if (args.item.id.indexOf('Add Master Record') > 0) {
      this.masterItem = {id: 0};
      this.open();
    }
  }

  open() {
    const dialogRef = this.modal.open(EditOrAddMasterDataComponent, {
      data: {item : this.masterItem , types: this.masterTypes } ,
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

}
