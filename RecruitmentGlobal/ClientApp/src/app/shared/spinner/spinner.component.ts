import { Component, OnInit, ChangeDetectorRef, OnChanges } from '@angular/core';
import { LoaderService } from '../../services/loader.service';

@Component({
  selector: 'app-spinner',
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.css']
})
export class SpinnerComponent implements OnInit , OnChanges {

  loading: boolean;


  constructor(private loaderService: LoaderService, private changeDetectorRef: ChangeDetectorRef) {

    this.loaderService.isLoading.subscribe((v) => {
      this.loading = v;
    });

  }
    ngOnChanges(changes: any): void {
      this.changeDetectorRef.detectChanges();
    }
  ngOnInit() {
  }

}
