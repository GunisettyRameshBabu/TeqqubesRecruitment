import { Component, OnInit, ViewChild } from '@angular/core';
import { ClickEventArgs } from '@syncfusion/ej2-angular-navigations';
import { ExcelExportProperties, GridComponent } from '@syncfusion/ej2-angular-grids';
import { ServiceResponse } from 'src/app/models/service-response';
import { ToastrService } from 'ngx-toastr';
import { MasterdataService } from 'src/app/services/masterdata.service';
import { PagerComponent, Pager, PagerDropDown } from '@syncfusion/ej2-angular-grids';
Pager.Inject(PagerDropDown);
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
  pageSizes: any = [15, 25, 50, 100];
  pageSettings: any = { pageSizes: true, pageSize: 15, pageCount: 5, currentPage: 1, sort: 'inTime', sortOrder: 'Ascending' };
  constructor(
    private alertService: ToastrService,
    private masterDataService: MasterdataService
  ) {}

  ngOnInit(): void {
   
    this.getData();
    this.editSettings = {
      allowEditing: false,
      allowAdding: false,
      mode: 'Dialog',
    };
    this.toolbar = [ 'Excel Export','Refresh'];
  }

  getData() {
    this.masterDataService.getUserLogs({ size: this.pageSettings.pageSize, page: this.pageSettings.currentPage, sort: this.pageSettings.sort, sortOrder: this.pageSettings.sortOrder }).subscribe((res: ServiceResponse) => {
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
