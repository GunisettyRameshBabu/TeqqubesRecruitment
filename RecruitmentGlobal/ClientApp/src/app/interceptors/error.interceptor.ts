import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
  HttpResponse,
} from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import {} from '@angular/common/http';
import { UsersessionService } from '../services/usersession.service';
import { User } from '../models/user';
import { LoaderService } from '../services/loader.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  accessToken = '';
  private requests: HttpRequest<any>[] = [];
  constructor(
    private notificationService: ToastrService,
    private router: Router,
    private userSession: UsersessionService,
    private loaderService: LoaderService
  ) { }

  removeRequest(req: HttpRequest<any>) {
    const i = this.requests.indexOf(req);
    if (i >= 0) {
      this.requests.splice(i, 1);
    }
    this.loaderService.isLoading.next(this.requests.length > 0);
  }

  getAccessToken() {
    let user = this.userSession.getLoggedInUser();
    if (user) {
      this.accessToken = 'Bearer ' + (user as User).token;
    }
  }
  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    

    this.loaderService.isLoading.next(true);
    this.getAccessToken();
    request = request.clone({
      setHeaders: {
        Authorization: this.accessToken,
      },
    });
    this.requests.push(request);

    console.log("No of requests--->" + this.requests.length);
    return Observable.create(observer => {
      const subscription = next.handle(request)
        .subscribe(
          event => {
            if (event instanceof HttpResponse) {
              this.removeRequest(request);
              observer.next(event);
            }
          },
          errorResponse => {
           
            this.removeRequest(request);
            if (
              errorResponse instanceof HttpErrorResponse &&
              errorResponse.status === 401
            ) {

              this.router.navigate(['unauth']);
            }
            if (
              errorResponse instanceof HttpErrorResponse &&
              errorResponse.status === 409
            ) {
              this.notificationService.error(
                errorResponse.error.message,
                errorResponse.error.error
              );
            } else if (
              errorResponse instanceof HttpErrorResponse &&
              errorResponse.status === 0
            ) {
              this.notificationService.error(
                'Unable to connect to Server , Please contact admin',
                'Server Connection Error'
              );
            } else if (
              errorResponse instanceof HttpErrorResponse &&
              errorResponse.status === 200 &&
              errorResponse.error != null &&
              errorResponse.error != undefined
            ) {
              this.notificationService.success(errorResponse.error.text, 'Success');
            } else {
              if (errorResponse.error != undefined) {
                this.notificationService.error(
                  errorResponse.message,
                  errorResponse.error.error
                );
              } else {
                this.notificationService.error(errorResponse.message, 'error');
              }
            }
            observer.error(errorResponse);
          },
          () => {
            this.removeRequest(request);
            observer.complete();
          });
      // remove request from queue when cancelled
      return () => {
        this.removeRequest(request);
        subscription.unsubscribe();
      };
    });
  }
}
