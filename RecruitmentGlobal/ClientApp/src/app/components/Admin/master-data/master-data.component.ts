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
  pageSettings: { pageSizes: boolean; pageSize: number };
  masterTypes = [];
  masterItem: any;
  constructor(
    private userSession: UsersessionService,
    private commonService: CommonService,
    private alertService: ToastrService,
    private modal: MatDialog,
    private masterDataService: MasterdataService,
    private titleService: Title
  ) {}

  ngOnInit(): void {
    this.titleService.setTitle('Qube Connect - Master Data');
    this.modal.closeAll();
    this.pageSettings = { pageSizes: true, pageSize: 10 };
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
    this.masterDataService.getMasterData().subscribe((res: ServiceResponse) => {
      if (res.success) {
        this.masterdata = res.data;
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

}
