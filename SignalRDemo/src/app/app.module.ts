import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AppService } from './app.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpService } from './shared/http-service';
import { HttpModule } from '@angular/http';
import { ToastyModule } from 'ng2-toasty';
import { NgxSpinnerModule } from 'ngx-spinner';
import { CoreModule } from './shared/common/core.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    ToastyModule.forRoot(),
    NgxSpinnerModule,
    HttpModule,
    CoreModule
  ],
  providers: [AppService, HttpService],
  bootstrap: [AppComponent]
})
export class AppModule { }
