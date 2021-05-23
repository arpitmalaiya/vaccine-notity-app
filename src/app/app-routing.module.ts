import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './core/components/dashboard/dashboard.component';
import { VerifyNumberComponent } from './core/components/verify-number/verify-number.component';
import { VerifyOtpComponent } from './core/components/verify-otp/verify-otp.component';

const routes: Routes = [
  {
    path:"",
    component:VerifyNumberComponent,
    pathMatch:'full'
  },
  {
    path:"verify-otp",
    component:VerifyOtpComponent
  },
  {
    path:"dashboard",
    component:DashboardComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
