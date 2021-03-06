import { Component } from '@angular/core';
import { Spinkit } from 'ng-http-loader';
import { SpinnerComponent } from './shared/spinner/spinner.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Qube Connect';
  public spinkit = Spinkit;
  public spinnerComponent: SpinnerComponent;
}
