import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import {
  PageService,
  SortService,
  FilterService,
  GroupService,
  DetailRowService,
  ToolbarService,
  ExcelExportService,
  EditService,
} from '@syncfusion/ej2-angular-grids';
import { AppComponent } from './app.component';
import { NavMenuComponent } from './nav-menu/nav-menu.component';
import { CounterComponent } from './counter/counter.component';
import { FetchDataComponent } from './fetch-data/fetch-data.component';
import { HeaderComponent } from './components/Layout/header/header.component';
import { FooterComponent } from './components/Layout/footer/footer.component';
import { LoginComponent } from './components/login/login.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { UnAuthorizedComponent } from './components/un-authorized/un-authorized.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { MatDialogModule, MAT_DIALOG_DEFAULT_OPTIONS } from '@angular/material/dialog';
import { NgHttpLoaderModule } from 'ng-http-loader';
import { SpinnerComponent } from './shared/spinner/spinner.component';
import { EqualValidatorDirective } from './Directives/equal-validator.directive';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { UserLogsComponent } from './components/dashboard/user-logs/user-logs.component';
import { ViewCandidatesByStatusComponent } from './components/dashboard/view-candidates-by-status/view-candidates-by-status.component';
import { JobService } from './services/job.service';
import { CommonService } from './services/common.service';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSlideToggleModule, MatSlideToggle } from '@angular/material/slide-toggle';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { GridModule } from '@syncfusion/ej2-angular-grids';
import { HomeComponent } from './components/home/home.component';
import { RecruitCareComponent } from './components/recruit-care/recruit-care.component';
import { RecruitCareEditComponent } from './components/recruit-care/recruit-care-edit/recruit-care-edit.component';
import { RecruitCareViewComponent } from './components/recruit-care/recruit-care-view/recruit-care-view.component';
import { ConfirmationDialogComponent } from './components/confirmation-dialog/confirmation-dialog.component';
import { ErrorInterceptor } from './interceptors/error.interceptor';
import { CityMasterComponent } from './components/Admin/city-master/city-master.component';
import { AddOrEditCityComponent } from './components/Admin/city-master/add-or-edit-city/add-or-edit-city.component';
import { StateMasterComponent } from './components/Admin/state-master/state-master.component';
import { AddOrEditStateComponent } from './components/Admin/state-master/add-or-edit-state/add-or-edit-state.component';
import { CountryMasterComponent } from './components/Admin/country-master/country-master.component';
import { AddOrEditCountryComponent } from './components/Admin/country-master/add-or-edit-country/add-or-edit-country.component';
import { UsersComponent } from './components/Admin/users/users.component';
import { UsereditComponent } from './components/Admin/users/useredit/useredit.component';
import { ClientsComponent } from './components/Admin/clients/clients.component';
import { ClientEditComponent } from './components/Admin/clients/client-edit/client-edit.component';
import { MasterDataComponent } from './components/Admin/master-data/master-data.component';
import { EditOrAddMasterDataComponent } from './components/Admin/master-data/edit-or-add-master-data/edit-or-add-master-data.component';
import { AuthGuard } from './Guards/auth.guard';
import { JobcandidatesComponent } from './components/jobcandidates/jobcandidates.component';
import { JobdetailsComponent } from './components/jobdetails/jobdetails.component';
import { JobopeningsComponent } from './components/jobopenings/jobopenings.component';
import { AddcandidateComponent } from './components/jobcandidates/addcandidate/addcandidate.component';
import { ViewcandidateComponent } from './components/jobcandidates/viewcandidate/viewcandidate.component';
import { AddOpeningsComponent } from './components/add-openings/add-openings.component';


@NgModule({
  declarations: [
    AppComponent,
    NavMenuComponent,
    HomeComponent,
    CounterComponent,
    FetchDataComponent,
    HeaderComponent,
    FooterComponent,
    LoginComponent,
    ResetPasswordComponent,
    UnAuthorizedComponent,
    SpinnerComponent,
    EqualValidatorDirective,
    DashboardComponent,
    UserLogsComponent,
    ViewCandidatesByStatusComponent,
    RecruitCareComponent,
    RecruitCareEditComponent,
    RecruitCareViewComponent,
    ConfirmationDialogComponent,
    CityMasterComponent,
    AddOrEditCityComponent,
    StateMasterComponent,
    AddOrEditStateComponent,
    CountryMasterComponent,
    AddOrEditCountryComponent,
    UsersComponent,
    UsereditComponent,
    ClientsComponent,
    ClientEditComponent,
    MasterDataComponent,
    EditOrAddMasterDataComponent,
    JobcandidatesComponent,
    JobdetailsComponent,
    JobopeningsComponent,
    JobcandidatesComponent,
    AddcandidateComponent,
    ViewcandidateComponent,
    JobdetailsComponent,
    AddOpeningsComponent
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
    MatSelectModule,
    MatCheckboxModule,
    MatSlideToggleModule,
    MatDatepickerModule,
    MatNativeDateModule,
    HttpClientModule,
    GridModule,
    FormsModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatFormFieldModule,
    MatInputModule,
    ToastrModule.forRoot(),
    NgHttpLoaderModule.forRoot(),
    MatDialogModule,
    RouterModule.forRoot([
      {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
      },
      {
        path: 'login',
        component: LoginComponent
      },
      {
        path: 'home',
        component: HomeComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'jobopenings',
        component: JobopeningsComponent,
        canActivate: [AuthGuard]
      }
      ,
      {
        path: 'jobdetails/:jobid',
        component: JobdetailsComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'jobdetails/:jobid',
        component: JobdetailsComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'addjob',
        component: AddOpeningsComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'editjob/:id',
        component: AddOpeningsComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'users',
        component: UsersComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'dashboard',
        component: DashboardComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'master',
        component: MasterDataComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'city',
        component: CityMasterComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'country',
        component: CountryMasterComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'state',
        component: StateMasterComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'clients',
        component: ClientsComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'unauth',
        component: UnAuthorizedComponent
      },
      { path: '**', redirectTo: '', pathMatch: 'full' }
    ])
  ],
  providers: [{ provide: MAT_DIALOG_DEFAULT_OPTIONS, useValue: { hasBackdrop: false } },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true }, ToastrService, JobService, CommonService,
    PageService,
    SortService,
    FilterService,
    GroupService,
    DetailRowService,
    ToolbarService,
    ExcelExportService,
    EditService,
  ],
  bootstrap: [AppComponent],
  entryComponents: [
    EditOrAddMasterDataComponent,
    RecruitCareEditComponent,
    UsereditComponent,
    JobcandidatesComponent,
    ResetPasswordComponent,
    AddOrEditCityComponent,
    AddOrEditCountryComponent,
    AddOrEditStateComponent,
    SpinnerComponent,
    RecruitCareViewComponent,
    ViewcandidateComponent,
    ViewCandidatesByStatusComponent
  ]
})
export class AppModule { }
