import { Component, OnInit, ViewChild } from '@angular/core';
import { AddOrEditStateComponent } from './add-or-edit-state/add-or-edit-state.component';
import { ExcelExportProperties, GridComponent } from '@syncfusion/ej2-angular-grids';
import { ClickEventArgs } from '@syncfusion/ej2-angular-navigations';
import { ServiceResponse } from 'src/app/models/service-response';
import { UsersessionService } from 'src/app/services/usersession.service';
import { CommonService } from 'src/app/services/common.service';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';
import { MasterdataService } from 'src/app/services/masterdata.service';
import { Title } from '@angular/platform-browser';

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
    this.titleService.setTitle('Qube Connect - State Master');
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
    this.toolbar = ['State Data','Add State', 'Excel Export','Refresh'];
  }

  getData() {
    this.masterDataService.getStates().subscribe((res: ServiceResponse) => {
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
