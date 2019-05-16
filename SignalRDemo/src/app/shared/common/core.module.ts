import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { XHRBackend, RequestOptions } from '@angular/http';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { HttpService } from '../http-service/http.service';
import { httpServiceFactory } from './factories/http-service.factory';
import { ToastyService } from 'ng2-toasty';
import { NgxSpinnerService } from 'ngx-spinner';

@NgModule({
    imports: [
        CommonModule,
        BrowserModule,
        BrowserAnimationsModule,
    ],
    exports: [
        BrowserModule
    ],
    declarations: [
    ],
    providers: [
        {
            provide: HttpService,
            useFactory: httpServiceFactory,
            deps: [XHRBackend, RequestOptions, NgxSpinnerService, ToastyService, Router]
        },
    ]
})

export class CoreModule { }