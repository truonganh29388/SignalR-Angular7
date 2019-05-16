
import { throwError as observableThrowError, Observable } from 'rxjs';
import { catchError, share } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import {
  Http,
  RequestOptions,
  Response,
  Headers,
  XHRBackend,
  QueryEncoder,
  RequestOptionsArgs,
  ResponseOptions,
} from '@angular/http';
import { ToastyService } from 'ng2-toasty';
import { NgxSpinnerService } from 'ngx-spinner';

@Injectable()
export class HttpService extends Http {
  constructor(backend: XHRBackend,
    defaultOptions: RequestOptions,
    private spinner: NgxSpinnerService,
    private _toastyService: ToastyService) {
    super(backend, defaultOptions);
  }
  
private signout:Function = () => {
  localStorage.clear();
}

  public get(url: string, options?: RequestOptionsArgs,  showLoader: boolean = true, ignoreArlet: boolean = false): Observable<any> {
    return this.intercept(super.get(url, this.requestOptions(options)),
      { showLoader: showLoader, ignoreArlet: ignoreArlet});
  }

  public post(url: string, body: any, options?: RequestOptionsArgs, showLoader: boolean = true, ignoreArlet: boolean = false): Observable<any> {
    return this.intercept(super.post(url, body, this.requestOptions(options)),
      { showLoader: showLoader, ignoreArlet: ignoreArlet });
  }

  public put(url: string, body: any, options?: RequestOptionsArgs, showLoader: boolean = true, ignoreArlet: boolean = false): Observable<any> {
    return this.intercept(super.put(url, body, this.requestOptions(options)),
      { showLoader: showLoader, ignoreArlet: ignoreArlet });
  }

  public delete(url: string, options?: RequestOptionsArgs, showLoader: boolean = true, ignoreArlet: boolean = false): Observable<any> {
    return this.intercept(super.delete(url, this.requestOptions(options)),
      { showLoader: showLoader, ignoreArlet: ignoreArlet });
  }

  // public signout(): void {
  //   localStorage.clear();
  //   //setTimeout(() => this.router.navigate(['sign-in']), 50);
  // }

  private requestOptions(options?: any): any {
    if (options == null) {
      options = new RequestOptions();
    }

    if (options.headers == null) {
      options.headers = new Headers();
    }

    if (!options.headers.has('Accept')) {
      options.headers.append('Accept', 'application/json');
    }
    if (!options.headers.has('Content-Type')) {
      options.headers.append('Content-Type', 'application/json');
    }
    let token = localStorage.getItem('accessToken');

    if (token) {
      options.headers.append('Authorization', `Bearer ${token}`);
    }
    return options;
  }

  private showLoader(): void {
    this.spinner.show();
  }

  private hideLoader(): void {
    this.spinner.hide();
  }

  public intercept(observable: Observable<Response>, options: any): Observable<Response> {
    let shareRequest = observable.pipe(share());
    options = options || {};
    if (window.navigator && !window.navigator.onLine) {
      if (!options.ignoreAlert) {
        this._toastyService.error('Network Error');
      }
      return new Observable<Response>((subscriber) => {
        subscriber.error(new Response(new ResponseOptions({ body: { message: 'Network error', status: 0 } })));
      });
    }
    if (options.showLoader) {
      this.showLoader();
    }
    shareRequest.subscribe(
      (resp) => {

        // subscribe
        if (options.showLoader) {
          this.hideLoader();
        }
        try {
          let body = resp.json();
          if (body.message && !options.ignoreAlert) {
            this._toastyService.success(body.message);
          }
        } catch (error) { }
      },
      (err) => {
        // error
        if (options.showLoader) {
          this.hideLoader();
        }
        if (!err.status) {
          if (!options.ignoreAlert) {
            this._toastyService.error('An error has occurred');
          }
        } else {
          if (err.status === 403) {
            this.hideLoader();
          }
          else if (err.status === 401) {
            this._toastyService.error('Session timeout. Please login again.');
            this.signout();
          }
          else {
            let errObj = JSON.parse(err._body);
            if (!options.ignoreAlert) {
              this._toastyService.error(errObj.message || `${err.status} ${(err as any).statusText}`);
            }
          }
        }
      },
      () => {
        // complete
      }
    );

    return shareRequest.pipe(
      catchError((err, source) => {
        return observableThrowError(err);
      }));
  }
}

export class MyQueryEncoder extends QueryEncoder {
  public encodeKey(k: string): string {
    return encodeURIComponent(k);
  }

  public encodeValue(v: string): string {
    return encodeURIComponent(v);
  }
}
