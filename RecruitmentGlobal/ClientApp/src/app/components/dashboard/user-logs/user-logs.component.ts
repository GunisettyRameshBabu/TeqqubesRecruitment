import { Component, OnInit, ViewChild } from '@angular/core';
import { ClickEventArgs } from '@syncfusion/ej2-angular-navigations';
import { ExcelExportProperties, GridComponent } from '@syncfusion/ej2-angular-grids';
import { ServiceResponse } from 'src/app/models/service-response';
import { ToastrService } from 'ngx-toastr';
import { MasterdataService } from 'src/app/services/masterdata.service';

@Component({
  selector: 'app-user-logs',
  templateUrl: './user-logs.component.html',
  styleUrls: ['./user-logs.component.css']
})
export class UserLogsComponent implements OnInit {

  @ViewChild('grid', { static: false }) public grid: GridComponent;
  editSettings: { allowEditing: boolean; allowAdding: boolean; mode: string };
  toolbar: string[];
  masterdata = [];
  pageSettings: { pageSizes: boolean; pageSize: number };
  constructor(
    private alertService: ToastrService,
    private masterDataService: MasterdataService
  ) {}

  ngOnInit(): void {
    this.pageSettings = { pageSizes: true, pageSize: 10 };
   
    this.getData();
    this.editSettings = {
      allowEditing: false,
      allowAdding: false,
      mode: 'Dialog',
    };
    this.toolbar = [ 'Excel Export','Refresh'];
  }

  getData() {
    this.masterDataService.getUserLogs().subscribe((res: ServiceResponse) => {
      if (res.success) {
        this.masterdata = res.data;
      } else {
        this.alertService.error(res.message);
      }
    });
  }



  toolbarClick(args: ClickEventArgs): void {
    if (args.item.id.indexOf('excelexport') > 0) {
      // 'Grid_excelexport' -> Grid component id + _ + toolbar item name
      const excelExportProperties: ExcelExportProperties = {
        fileName: 'User Logs.xlsx',
      };
      this.grid.excelExport(excelExportProperties);
    } else if (args.item.id.indexOf('Refresh') > 0) {
      this.getData();
    }
  }

}
