import { Component, OnInit, Inject, AfterViewInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommonService } from 'src/app/services/common.service';
import { GridComponent, ExcelExportProperties } from '@syncfusion/ej2-angular-grids';
import { ClickEventArgs } from '@syncfusion/ej2-angular-navigations';

@Component({
  selector: 'app-view-candidates-by-status',
  templateUrl: './view-candidates-by-status.component.html',
  styleUrls: ['./view-candidates-by-status.component.css']
})
export class ViewCandidatesByStatusComponent implements OnInit, AfterViewInit {

  @ViewChild('grid', { static: false }) public grid: GridComponent;
  candidates: any;
  toolbar: string[];
  constructor(
    public dialogRef: MatDialogRef<ViewCandidatesByStatusComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private commonService: CommonService,
    private cdr: ChangeDetectorRef
  ) {
    this.candidates = data;
    this.toolbar = ['ExcelExport'];
  }

  ngAfterViewInit() {
    this.cdr.detectChanges();
  }

  ngOnInit(): void {}

  close() {
    this.dialogRef.close(false);
  }

  
  toolbarClick(args: ClickEventArgs): void {
    console.log(args);
    if (args.item.id.indexOf('excelexport') > 0) {
      // 'Grid_excelexport' -> Grid component id + _ + toolbar item name
      const excelExportProperties: ExcelExportProperties = {
        fileName: 'jobcandidates.xlsx',
      };
      this.grid.excelExport(excelExportProperties);
    } 
  }

}
