import { Injectable } from '@angular/core';
import { catchError, map } from 'rxjs/operators';
import { throwError as observableThrowError, Observable } from 'rxjs';
import { Response } from '@angular/http';
import { HttpService } from './shared/http-service';
@Injectable()
export class AppService {

  constructor(private _http: HttpService) {

  }

  private baseApiUrl = 'https://localhost:44337/api'

  public getToken(data: any): Observable<any> {
    return this._http.post(`${this.baseApiUrl}/users/login`, JSON.stringify(data)).pipe(
      map(this.extractData),
      catchError(this.handleError));
  }

  public getUserList(): Observable<any> {
    return this._http.get(`${this.baseApiUrl}/users`).pipe(
      map(this.extractData),
      catchError(this.handleError));
  }

  private extractData(resp: any): any {
    const body = resp.json();
    return body || {};
  }

  private handleError(error: Response): Observable<any> {
    return observableThrowError(error.json());
  }

}
