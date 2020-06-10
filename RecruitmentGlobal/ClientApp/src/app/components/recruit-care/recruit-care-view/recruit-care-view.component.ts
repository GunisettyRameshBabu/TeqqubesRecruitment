import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommonService } from 'src/app/services/common.service';
import { saveAs } from 'file-saver';
@Component({
  selector: 'app-recruit-care-view',
  templateUrl: './recruit-care-view.component.html',
  styleUrls: ['./recruit-care-view.component.css']
})
export class RecruitCareViewComponent implements OnInit {

  candidate: any;
  constructor(
    public dialogRef: MatDialogRef<RecruitCareViewComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private commonService: CommonService
  ) {
    this.candidate = data;
  }

  ngOnInit(): void {}

  close() {
    this.dialogRef.close(false);
  }

  getResume(data) {
    return this.commonService.downloadResume(data.id,'r').subscribe((res: any) => {
      saveAs(res, data.fileName);
    });
  }

}
