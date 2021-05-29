import { BrowserModule } from '@angular/platform-browser';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { HeaderComponent } from './core/header/header.component';
import { FooterComponent } from './core/footer/footer.component';
import { DashboardComponent } from './core/components/dashboard/dashboard.component';
import { VerifyNumberComponent } from './core/components/verify-number/verify-number.component';
import { VerifyOtpComponent } from './core/components/verify-otp/verify-otp.component';
import { SlotOverviewComponent } from './core/components/slot-overview/slot-overview.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {HttpClientModule, HTTP_INTERCEPTORS} from '@angular/common/http';
import { AuthInterceptorService } from 'src/app/shared/auth-interceptor.service';
import { DetailCardComponent } from './core/components/detail-card/detail-card.component'

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    HeaderComponent,
    FooterComponent,
    DashboardComponent,
    VerifyNumberComponent,
    VerifyOtpComponent,
    SlotOverviewComponent,
    DetailCardComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  schemas:[CUSTOM_ELEMENTS_SCHEMA],
  // providers: [
  //   {
  //     provide: HTTP_INTERCEPTORS,
  //     useClass: AuthInterceptorService,
  //     multi: true
  //   }
  // ],
  bootstrap: [AppComponent]
})
export class AppModule { }
