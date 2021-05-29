import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiUrlService } from 'src/app/shared/api-url.service';
import { PushNotificationsService } from 'src/app/shared/push-notifications.service'

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit,OnDestroy {

  todayDate;
  date = new Date();
  showTime;
  searchForm:FormGroup
  states:any[] ;
  districts:any[];
  allDataByPin: any[] = [];
  filterPara: any;
  isEmpty: boolean = false;
  intervalNotify:any
  dataPrevious: any[] = [];
  dataCurrent: any[] = [];
  searchClicked: boolean = false;
  isFilterEnabled = false;


  constructor(private router:Router,private fb:FormBuilder,private apiService:ApiUrlService,private _notificationService: PushNotificationsService) { 
    
  }

  ngOnInit(): void {
    this.searchForm = this.fb.group({
      selectTypeRadio: ['byPin'],
      state:[''],
      district:[''],
      pinCode:[''],
      checkArrayAge: this.fb.array([]),
      checkArrayFee: this.fb.array([]),
      checkArrayDose: this.fb.array([]),
     })
    
    this.apiService.getStatesData().subscribe(
      res=>{
        this.states = res.states;
      }
    )

    
   this.todayDate = this.date.getDate() + '-' + (this.date.getMonth()+1) + '-' + this.date.getFullYear(); 
    
  }
  onSelectState(){
    this.apiService.getDistrictData(this.searchForm.value.state).subscribe(
      res=>{
        this.districts = res.districts
      }
    )
  }

  allNewDataPush = [];
  allNewBanner = <any>[];
  receiveNoti(e:any){
    //this.showTime = this.date.toLocaleTimeString();
    let pushNoti = e.newPushData
    let bannerNoti = e.newBannerData
    this.allNewDataPush.push(...pushNoti);
    this.allNewBanner.push(...bannerNoti);
    this._notificationService.generateNotification(this.allNewDataPush);
  }

  dismissCard(index:number){
    console.log(index);
    
    this.allNewBanner.splice(index,1);
  }
  

  onSubmitForm(){
    this.searchClicked = true;
      var e:any = document.getElementsByName('fChecks');
      e.forEach(ele => {
        ele.checked =false;
      });

      const checkArrayDose: FormArray = this.searchForm.get('checkArrayDose') as FormArray;
      checkArrayDose.clear();
      const checkArrayAge: FormArray = this.searchForm.get('checkArrayAge') as FormArray;
      checkArrayAge.clear();
      const checkArrayFee: FormArray = this.searchForm.get('checkArrayFee') as FormArray;
      checkArrayFee.clear();
    
    
    this.apiCalls();
    
  }
  apiCalls(){
    this.apiService.invokeFilterMethodClick(
      {
        'ageFilter': [],
        'doseFilter': [],
        'feeFilter': []
      }
    );
    if(this.searchForm.value.selectTypeRadio == "byPin"){
      if(this.searchForm.value.pinCode == '000000'){
        this.apiService.getDetailsByPinTest(this.searchForm.value.pinCode,this.todayDate).subscribe(
          res=>{
            this.isEmpty = false;
            this.dataCurrent = res;
            //this.dataCurrent = this.allDataByPin;
            
            setTimeout(() => {
              this.dataPrevious = this.dataCurrent;
            }, 4000);
          },
          err=>{
            this.isEmpty = true;
          }
        )
      }
      else{
        this.apiService.getDetailsByPin(this.searchForm.value.pinCode,this.todayDate).subscribe(
          res=>{
            this.isEmpty = false
            this.dataCurrent = res.centers;
            //this.dataCurrent = this.allDataByPin;
            
            setTimeout(() => {
              this.dataPrevious = this.dataCurrent;
            }, 4000);
          },
          err=>{
            this.isEmpty = true;
          }
        )
      }
    }
    else if(this.searchForm.value.selectTypeRadio == "byDistrict"){
      this.apiService.getDetailsByDist(this.searchForm.value.district,this.todayDate).subscribe(
        res=>{
          this.isEmpty = false
          this.allDataByPin = res.centers;
          this.dataCurrent = this.allDataByPin;
        },
        err=>{
          this.isEmpty = true;
        }
      )
    }
  }
  // checkFilterEnable(){
  //   let eleCheck:any
  //   eleCheck = document.getElementsByName('fChecks');
  //   for(var i = 0; i < eleCheck.length ; i++){
  //     if(eleCheck[i].target.checked){
  //       this.isFilterEnabled = true;
  //       break;
  //     }
  //     else{
  //       this.isFilterEnabled = false;
  //     }
  //   };
  // }
  onCheckboxChangeDose(e) {
    const checkArrayDose: FormArray = this.searchForm.get('checkArrayDose') as FormArray;
  
    if (e.target.checked) {
      checkArrayDose.push(new FormControl(e.target.value));
    } else {
      let i: number = 0;
      checkArrayDose.controls.forEach((item: FormControl) => {
        if (item.value == e.target.value) {
          checkArrayDose.removeAt(i);
          return;
        }
        i++;
      });
    }

    this.apiService.invokeFilterMethodClick(
      {
        'ageFilter': this.searchForm.value.checkArrayAge,
        'doseFilter': this.searchForm.value.checkArrayDose,
        'feeFilter': this.searchForm.value.checkArrayFee
      }
    );
  }
  onCheckboxChangeFee(e) {
    const checkArrayFee: FormArray = this.searchForm.get('checkArrayFee') as FormArray;
  
    if (e.target.checked) {
      checkArrayFee.push(new FormControl(e.target.value));
    } else {
      let i: number = 0;
      checkArrayFee.controls.forEach((item: FormControl) => {
        if (item.value == e.target.value) {
          checkArrayFee.removeAt(i);
          return;
        }
        i++;
        
      });
    }
    this.apiService.invokeFilterMethodClick(
      {
        'ageFilter': this.searchForm.value.checkArrayAge,
        'doseFilter': this.searchForm.value.checkArrayDose,
        'feeFilter': this.searchForm.value.checkArrayFee
      }
    );
  }
  onCheckboxChangeAge(e) {
    const checkArrayAge: FormArray = this.searchForm.get('checkArrayAge') as FormArray;
  
    if (e.target.checked) {
      checkArrayAge.push(new FormControl(+e.target.value));
    } else {
      let i: number = 0;
      checkArrayAge.controls.forEach((item: FormControl) => {
        if (item.value == e.target.value) {
          checkArrayAge.removeAt(i);
          return;
        }
        i++;
      });
    }
    this.apiService.invokeFilterMethodClick(
      {
        'ageFilter': this.searchForm.value.checkArrayAge,
        'doseFilter': this.searchForm.value.checkArrayDose,
        'feeFilter': this.searchForm.value.checkArrayFee
      }
    );
  }
  isEmptyArr = [];
  isEmptyCheck(e:any){
    // this.isEmptyArr.push(e)

    // if(!e){
    //   this.isEmpty = false;
    // }
    
  }
  getNotify(){
    this._notificationService.requestPermission();
    this.dataPrevious = this.dataCurrent;
    this.intervalNotify =  setInterval(()=>{
      this.apiCalls();
      this.allNewDataPush = [];
    },7000)
    this.apiService.invokeNotificationClick(true);
  }
  stopNotify(){
    clearInterval(this.intervalNotify);
    this.apiService.invokeNotificationClick(false);
    this.allNewBanner=[];
  }
  ngOnDestroy(){
    clearInterval(this.intervalNotify);
  }
}
