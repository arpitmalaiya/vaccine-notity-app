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
  @Output() emptyValue = new EventEmitter;
  filterPara :any;
  triggerSub:Subscription;
  centerDataFiltered:any;
  
  constructor(private apiService: ApiUrlService) { }

  ngOnInit(): void {
    this.centerDataFiltered = this.centerData
   this.triggerSub = this.apiService.invokeFilterFunction.subscribe(
      res=>{     
        console.log(res);
        this.filterPara = res;
        this.centerDataFiltered = this.filterByFee(this.filterByDose(this.filterByAge(this.centerData)));
        if(!this.centerDataFiltered.sessions.length){
          this.emptyValue.emit(true);
        }
        else{
          this.emptyValue.emit(false);
          
        }
      }
    )
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

        if(this.filterPara.doseFilter.indexOf('dose1')>=0 && this.filterPara.doseFilter.indexOf('dose2')>=0 ){
          if(ele.available_capacity_dose1>0 && ele.available_capacity_dose2>0){
            fSessionData.push(ele)
          }
        }

        if(this.filterPara.doseFilter.indexOf('dose1')>=0 && this.filterPara.doseFilter.indexOf('dose2')==-1){
          if(ele.available_capacity_dose1>0){
            fSessionData.push(ele)
          }
        }

        if(this.filterPara.doseFilter.indexOf('dose2')>=0 && this.filterPara.doseFilter.indexOf('dose1')==-1){
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
  }
}
