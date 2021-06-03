import { EventEmitter, Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ApiUrlService {

  isNotify:boolean =false;
  indiNotify = null;
  filters:any;

  constructor(private https:HttpClient) { }

  triggerNotification = new EventEmitter(); 
  isDataAvailable = new BehaviorSubject<any>(''); 

  invokeFilterFunction = new BehaviorSubject<any>(''); 
  public getfiltersData = this.invokeFilterFunction.asObservable();

  invokeIndiNoti = new BehaviorSubject<any>(''); 
  public getIndiNotiData = this.invokeIndiNoti.asObservable();
  //invokeNotification = new Subject(); 

  invokeFilterMethodClick(filterData:any){
    this.filters = filterData;
    this.invokeFilterFunction.next(filterData);
  }
  invokeNotificationClick(para:boolean){
    this.isNotify = para;
  }
  setIndiNotify(value){
    this.indiNotify = value;
    if(value){
      this.invokeIndiNoti.next(this.indiNotify);
    }
    else{
      this.invokeIndiNoti.next('nullString');
    }
    
  }
  getSimpleIndiNotifyData(){
    return this.indiNotify;
  }
  getNotifyStatus(){
    return this.isNotify;
  }
  clickTriggerNotification(){
    this.triggerNotification.next()
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
    ).pipe(
      tap((resData) => {
        this.isDataAvailable.next(true)
      },
      err=>{
        this.isDataAvailable.next(false)
      })
    );
  }
  getDetailsByDist(distId:string,date:string){
    return this.https.get<any>(
      'https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/calendarByDistrict?district_id='+distId+ '&date=' + date
    ).pipe(
      tap((resData) => {
        this.isDataAvailable.next(true)
      },
      err=>{
        this.isDataAvailable.next(false)
      })
    );
  }

  //test api call
  getDetailsByPinTest(pin:string,date:string){
    return this.https.get<any>(
      'https://vaccine-test-api-default-rtdb.firebaseio.com/centers.json'
    ).pipe(
      tap((resData) => {
        this.isDataAvailable.next(true)
      },
      err=>{
        this.isDataAvailable.next(false)
      })
    );
  }
}