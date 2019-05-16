import { XHRBackend } from '@angular/http';
import { HttpService } from '../../http-service/http.service';
import { AngularReduxRequestOptions } from '../angular-redux-request.options';
import { ToastyService } from 'ng2-toasty';
import { NgxSpinnerService } from 'ngx-spinner';

function httpServiceFactory(backend: XHRBackend,
    options: AngularReduxRequestOptions,
    spinner: NgxSpinnerService,
    toastyService: ToastyService) {
    return new HttpService(backend, options, spinner, toastyService);
}

export { httpServiceFactory };
