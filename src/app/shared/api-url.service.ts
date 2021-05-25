import { EventEmitter, Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class ApiUrlService {

  constructor(private https:HttpClient) { }

  invokeFilterFunction = new EventEmitter(); 

  invokeFilterMethodClick(filterData:any){
    this.invokeFilterFunction.emit(filterData);
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
}