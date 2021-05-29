import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { ApiUrlService } from 'src/app/shared/api-url.service';

@Component({
  selector: 'app-detail-card',
  templateUrl: './detail-card.component.html',
  styleUrls: ['./detail-card.component.scss']
})
export class DetailCardComponent implements OnInit,OnDestroy {

  @Input() centerData:any;
  @Input() oldData:any;
  @Output() emptyValue = new EventEmitter;
  @Output() newNotification = new EventEmitter;
  filterPara :any;
  triggerSub:Subscription;
  triggerNotiSub:Subscription;
  centerDataFiltered:any;
  oldDataFiltered:any;
  dataPrevious;
  dataCurrent;
  isFilterEnabled = false;
  
  constructor(private apiService: ApiUrlService) { }

  ngOnInit(): void {
    // console.log(this.oldData);
    // console.log(this.centerData);
    
    this.centerDataFiltered = this.centerData
    this.oldDataFiltered = this.oldData
    this.triggerSub = this.apiService.getfiltersData.subscribe(
      res=>{     
        this.filterPara = res;
        this.isFilterEnabled = (this.filterPara.ageFilter.length + this.filterPara.doseFilter.length + this.filterPara.feeFilter.length) >0 ? true : false
        this.centerDataFiltered = this.filterByFee(this.filterByDose(this.filterByAge(this.centerData)));
        if(!this.centerDataFiltered.sessions.length){
          //this.emptyValue.emit(true);
        }
        else{
          //this.emptyValue.emit(false);
          
        }

        if(this.apiService.getNotifyStatus()){
          this.oldDataFiltered = this.filterByFee(this.filterByDose(this.filterByAge(this.oldData)));
        }
      }
    )
    
    if(this.apiService.getNotifyStatus()){
      this.checkNewValue(this.oldDataFiltered, this.centerDataFiltered)
    }
  
  }

  checkNewValue(previousD:any, nextD:any){
    let newPushData:any[] = [];
    let newBannerData:any[] = [];
    
    for(var i = 0; i < previousD.sessions.length;i++){
      if((previousD.sessions[i].available_capacity_dose1 == 0 && nextD.sessions[i].available_capacity_dose1 > 0)||(previousD.sessions[i].available_capacity_dose2 == 0 && nextD.sessions[i].available_capacity_dose2 > 0)){
        newPushData.push({
          'title': nextD.name,
          'alertContent': `D1 : ${nextD.sessions[i].available_capacity_dose1}, D2 : ${nextD.sessions[i].available_capacity_dose2}, Age:${nextD.sessions[i].min_age_limit}+ , ${nextD.fee_type}`
        })

        newBannerData.push({
          "name": nextD.name,    
          "address": nextD.address,
          "district_name": nextD.district_name,
          "block_name": nextD.block_name,
          "fee_type": nextD.fee_type,
          "date": nextD.sessions[i].date,
          "min_age_limit": nextD.sessions[i].min_age_limit,
          "available_capacity_dose1": nextD.sessions[i].available_capacity_dose1,
          "available_capacity_dose2": nextD.sessions[i].available_capacity_dose2,
          "currentTime": `${new Date().getHours()}:${new Date().getMinutes()}:${new Date().getSeconds()}`
        })

        this.newNotification.emit({newPushData , newBannerData})
      }
    }
  }

  filterByAge(data:any){
    let fSessionData=[] ;

    if(this.filterPara.ageFilter.length){
      data.sessions.forEach(ele => {
        if(this.filterPara.ageFilter.indexOf(ele.min_age_limit)>=0){
          fSessionData.push(ele)
        }
      });
      return {
        "center_id": data.center_id,
        "name": data.name,
        "address": data.address,
        "state_name": data.state_name,
        "district_name": data.district_name,
        "block_name": data.block_name,
        "pincode": data.pincode,
        "lat": data.lat,
        "long": data.long,
        "from": data.from,
        "to": data.to,
        "fee_type": data.fee_type,
        "sessions":fSessionData
      };
    }
    else{
      return data;
    }
    
  }

  filterByDose(data:any){
    let fSessionData=[] ;

    if(this.filterPara.doseFilter.length){
      data.sessions.forEach(ele => {

        if(this.filterPara.doseFilter.indexOf('available_capacity_dose1')>=0 && this.filterPara.doseFilter.indexOf('available_capacity_dose2')>=0 ){
          if(ele.available_capacity_dose1>0 && ele.available_capacity_dose2>0){
            fSessionData.push(ele)
          }
        }

        if(this.filterPara.doseFilter.indexOf('available_capacity_dose1')>=0 && this.filterPara.doseFilter.indexOf('available_capacity_dose2')==-1){
          if(ele.available_capacity_dose1>0){
            fSessionData.push(ele)
          }
        }

        if(this.filterPara.doseFilter.indexOf('available_capacity_dose2')>=0 && this.filterPara.doseFilter.indexOf('available_capacity_dose1')==-1){
          if( ele.available_capacity_dose2>0){
            fSessionData.push(ele)
          }
        }
      });
      return {
        "center_id": data.center_id,
        "name": data.name,
        "address": data.address,
        "state_name": data.state_name,
        "district_name": data.district_name,
        "block_name": data.block_name,
        "pincode": data.pincode,
        "lat": data.lat,
        "long": data.long,
        "from": data.from,
        "to": data.to,
        "fee_type": data.fee_type,
        "sessions":fSessionData
      };
    }
    else{
      return data;
    }
    
  }
  filterByFee(data:any){
    let fSessionData = [];

    if(this.filterPara.feeFilter.length){

      if(this.filterPara.feeFilter.indexOf(data.fee_type)>=0){
        return data;
      }
      else{
        return {
          "center_id": data.center_id,
          "name": data.name,
          "address": data.address,
          "state_name": data.state_name,
          "district_name": data.district_name,
          "block_name": data.block_name,
          "pincode": data.pincode,
          "lat": data.lat,
          "long": data.long,
          "from": data.from,
          "to": data.to,
          "fee_type": data.fee_type,
          "sessions":fSessionData
        };
      }
    }
    else{
      return data;
    }
    
  }

  ngOnDestroy(){
    this.triggerSub.unsubscribe();
    //this.triggerNotiSub.unsubscribe();
  }
}
