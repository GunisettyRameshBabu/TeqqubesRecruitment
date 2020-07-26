import { Component, OnInit, ViewChild } from '@angular/core';
import { GridComponent, ExcelExportProperties } from '@syncfusion/ej2-angular-grids';
import { UsersessionService } from 'src/app/services/usersession.service';
import { CommonService } from 'src/app/services/common.service';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';
import { MasterdataService } from 'src/app/services/masterdata.service';
import { ServiceResponse } from 'src/app/models/service-response';
import { ClickEventArgs } from '@syncfusion/ej2-angular-navigations';
import { AddOrEditCityComponent } from './add-or-edit-city/add-or-edit-city.component';
import { Title } from '@angular/platform-browser';
import { UtilitiesService } from '../../../services/utilities.service';

@Component({
  selector: 'app-city-master',
  templateUrl: './city-master.component.html',
  styleUrls: ['./city-master.component.css']
})
export class CityMasterComponent implements OnInit {

  @ViewChild('grid', { static: false }) public grid: GridComponent;
  editSettings: { allowEditing: boolean; allowAdding: boolean; mode: string };
  toolbar: string[];
  masterdata = [];
  pageSizes: any = [15, 25, 50, 100];
  pageSettings: any = { pageSizes: true, pageSize: 15, pageCount: 5, currentPage: 1, sort: 'country', sortOrder: 'Ascending' };
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
    this.titleService.setTitle('Qube Connect - City Master');
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
    this.toolbar = ['Cities','Add City', 'Excel Export','Refresh'];
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
      this.getData();
    }
  }

  onPageSizeChange(args: any): void {
    if (this.pageSettings.pageSize != args.pageSize) {
      this.pageSettings.pageSize = args.pageSize;
      this.getData();
    }
  }
  getData() {
    this.masterDataService.getCities({ size: this.pageSettings.pageSize, page: this.pageSettings.currentPage, sort: this.pageSettings.sort, sortOrder: this.pageSettings.sortOrder }).subscribe((res: ServiceResponse) => {
      if (res.success) {
       // this.pageSettings.pageCount = res.data.totalPages;
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
        fileName: 'City Data.xlsx',
      };
      this.grid.excelExport(excelExportProperties);
    } else if (args.item.id.indexOf('Add City') > 0) {
      this.masterItem = {id: 0};
      this.open();
    } else if (args.item.id.indexOf('Refresh') > 0) {
      this.getData();
    }
  }

  open() {
    const dialogRef = this.modal.open(AddOrEditCityComponent, {
      data:  this.masterItem ,
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
