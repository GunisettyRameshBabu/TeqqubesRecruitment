import { Component, OnInit, ViewChild } from '@angular/core';
import { AddOrEditCountryComponent } from './add-or-edit-country/add-or-edit-country.component';
import { ClickEventArgs } from '@syncfusion/ej2-angular-navigations';
import { ExcelExportProperties, GridComponent } from '@syncfusion/ej2-angular-grids';
import { ServiceResponse } from 'src/app/models/service-response';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { UsersessionService } from 'src/app/services/usersession.service';
import { CommonService } from 'src/app/services/common.service';
import { MasterdataService } from 'src/app/services/masterdata.service';
import { Title } from '@angular/platform-browser';
import { UtilitiesService } from '../../../services/utilities.service';

@Component({
  selector: 'app-country-master',
  templateUrl: './country-master.component.html',
  styleUrls: ['./country-master.component.css']
})
export class CountryMasterComponent implements OnInit {

  @ViewChild('grid', { static: false }) public grid: GridComponent;
  editSettings: { allowEditing: boolean; allowAdding: boolean; mode: string };
  toolbar: string[];
  masterdata = [];
  pageSettings: { pageSizes: boolean; pageSize: number };
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
    this.titleService.setTitle('Qube Connect - Country Master');
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
    this.toolbar = ['Country Data','Add Country', 'ExcelExport','Refresh'];
  }

  getData() {
    this.masterDataService.getCountries().subscribe((res: ServiceResponse) => {
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
        fileName: 'Country Data.xlsx',
      };
      this.grid.excelExport(excelExportProperties);
    } else if (args.item.id.indexOf('Add Country') > 0) {
      this.masterItem = {id: 0};
      this.open();
    } else if (args.item.id.indexOf('Refresh') > 0) {
      this.getData();
    }
  }

  open() {
    const dialogRef = this.modal.open(AddOrEditCountryComponent, {
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
