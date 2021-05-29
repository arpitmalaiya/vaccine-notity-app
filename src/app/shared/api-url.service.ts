import { EventEmitter, Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import { BehaviorSubject, Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiUrlService {

  isNotify:boolean =false;
  filters:any;

  constructor(private https:HttpClient) { }

  invokeFilterFunction = new BehaviorSubject<any>(''); 
  public getfiltersData = this.invokeFilterFunction.asObservable();
  //invokeNotification = new Subject(); 

  invokeFilterMethodClick(filterData:any){
    this.filters = filterData;
    this.invokeFilterFunction.next(filterData);
  }
  getHeroes(): Observable<any> {
    return this.filters;
  }
  invokeNotificationClick(para:boolean){
    this.isNotify = para;
  }
  getNotifyStatus(){
    return this.isNotify;
  }

  sendOtp(data:any) {
    return this.https.post<any>(
      'https://cdn-api.co-vin.in/api/v2/auth/generateMobileOTP',data
    )
  }
  verifyOtp(data:any) {
    return this.https.post<any>(
      'https://cdn-api.co-vin.in/api/v2/auth/validateMobileOtp',data
    )
  }
  getStatesData() {
    return this.https.get<any>(
      'https://cdn-api.co-vin.in/api/v2/admin/location/states'
    )
  }
  getDistrictData(data:any) {
    return this.https.get<any>(
      'https://cdn-api.co-vin.in/api/v2/admin/location/districts/'+data
    )
  }
  getDetailsByPin(pin:string,date:string){
    return this.https.get<any>(
      'https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/calendarByPin?pincode='+pin+ '&date=' + date
    )
  }
  getDetailsByDist(distId:string,date:string){
    return this.https.get<any>(
      'https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/calendarByDistrict?district_id='+distId+ '&date=' + date
    )
  }

  //test api call
  getDetailsByPinTest(pin:string,date:string){
    return this.https.get<any>(
      'https://vaccine-test-api-default-rtdb.firebaseio.com/centers.json'
    )
  }
}