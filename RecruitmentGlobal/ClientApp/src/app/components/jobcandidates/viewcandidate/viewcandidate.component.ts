import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommonService } from 'src/app/services/common.service';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-viewcandidate',
  templateUrl: './viewcandidate.component.html',
  styleUrls: ['./viewcandidate.component.css'],
})
export class ViewcandidateComponent implements OnInit {
  candidate: any;
  constructor(
    public dialogRef: MatDialogRef<ViewcandidateComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private commonService: CommonService
  ) {
    this.candidate = data;
  }

  ngOnInit(): void {}

  getResume(data) {
    return this.commonService.downloadResume(data.id).subscribe((res: any) => {
      saveAs(res, data.fileName);
    });
  }

  close() {
    this.dialogRef.close(false);
  }
}
