import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiUrlService } from 'src/app/shared/api-url.service';
import { PushNotificationsService } from 'src/app/shared/push-notifications.service'

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  todayDate;
  searchForm:FormGroup
  states:any[] ;
  districts:any[];
  allDataByPin: any[] = [];
  filterPara: any;
  isEmpty: boolean = false;

  constructor(private router:Router,private fb:FormBuilder,private apiService:ApiUrlService,private _notificationService: PushNotificationsService) { 
    this._notificationService.requestPermission();
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

    let date = new Date();
   this.todayDate = date.getDate() + '-' + (date.getMonth()+1) + '-' + date.getFullYear(); 
    
  }
  onSelectState(){
    console.log(this.searchForm.value.state);
    this.apiService.getDistrictData(this.searchForm.value.state).subscribe(
      res=>{
        this.districts = res.districts
      }
    )
  }
  notify() {
    let data: Array < any >= [];
    data.push({
        'title': 'Approval',
        'alertContent': 'This is First Alert -- By Debasis Saha'
    });
    data.push({
        'title': 'Request',
        'alertContent': 'This is Second Alert -- By Debasis Saha'
    });
    data.push({
        'title': 'Leave Application',
        'alertContent': 'This is Third Alert -- By Debasis Saha'
    });
    data.push({
        'title': 'Approval',
        'alertContent': 'This is Fourth Alert -- By Debasis Saha'
    });
    data.push({
        'title': 'To Do Task',
        'alertContent': 'This is Fifth Alert -- By Debasis Saha'
    });

    this._notificationService.generateNotification(data);
}

  

  onSubmitForm(){
    console.log(this.searchForm);
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
    
    
    
    if(this.searchForm.value.selectTypeRadio == "byPin"){
      this.apiService.getDetailsByPin(this.searchForm.value.pinCode,this.todayDate).subscribe(
        res=>{
          console.log(res);
          this.allDataByPin = res.centers;
        }
      )
    }
    else if(this.searchForm.value.selectTypeRadio == "byDistrict"){
      this.apiService.getDetailsByDist(this.searchForm.value.district,this.todayDate).subscribe(
        res=>{
          console.log(res);
          this.allDataByPin = res.centers;
          
        }
      )
    }
  }
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
  isEmptyCheck(e:any){
    console.log(e);
    
    this.isEmpty = e;
  }
}
