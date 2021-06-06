import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { timeout } from 'rxjs/operators';
import { ApiUrlService } from 'src/app/shared/api-url.service';
import { PushNotificationsService } from 'src/app/shared/push-notifications.service';
var $: any;
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit, OnDestroy {
  todayDate;
  date = new Date();
  showTime;
  searchForm: FormGroup;
  states: any[] = [];
  districts: any[];
  allDataByPin: any[] = [];
  filterPara: any;
  isEmpty: boolean = false;
  intervalNotify: any;
  dataPrevious: any[] = [];
  dataCurrent: any[] = [];
  searchClicked: boolean = false;
  isFilterEnabled = false;
  indiNotiCenter: any = null;
  triggerNotificationSubs: Subscription;
  getIndiNotiSubs: Subscription;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private apiService: ApiUrlService,
    private _notificationService: PushNotificationsService
  ) {}

  ngOnInit(): void {
    this.searchForm = this.fb.group({
      selectTypeRadio: ['byPin'],
      state: [''],
      district: [''],
      pinCode: ['', [Validators.minLength(6), Validators.required]],
      checkArrayAge: this.fb.array([]),
      checkArrayFee: this.fb.array([]),
      checkArrayDose: this.fb.array([]),
    });

    this.triggerNotificationSubs =
      this.apiService.triggerNotification.subscribe((res) => {
        var ele: any = document.getElementById('trigger-modal');
        ele.click();
      });

    this.getIndiNotiSubs = this.apiService.getIndiNotiData.subscribe((res) => {
      console.log(res);

      if (!(res == 'nullString') && res) {
        //open popup
        this.indiNotiCenter = res;
        var ele: any = document.getElementById('trigger-modal');
        ele.click();
      }
    });

    this.todayDate =
      this.date.getDate() +
      '-' +
      (this.date.getMonth() + 1) +
      '-' +
      this.date.getFullYear();

    this.loadBackground();

    //Get the button
    var mybutton = document.getElementById('myBtn');

    // When the user scrolls down 20px from the top of the document, show the button
    window.onscroll = function () {
      scrollFunction();
    };
    function scrollFunction() {
      if (
        document.documentElement.scrollHeight > 2500 &&
        document.documentElement.scrollHeight -
          document.documentElement.scrollTop <
          1600
      ) {
        mybutton.style.display = 'block';
      } else {
        mybutton.style.display = 'none';
      }
    }

    // When the user clicks on the button, scroll to the top of the document
    function topFunction() {
      document.body.scrollTop = 0;
      document.documentElement.scrollTop = 0;
    }
  }
  topFunction() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
  }
  onSelectState() {
    this.searchForm.controls.district.patchValue('');
    if (this.searchForm.value.state !== '') {
      this.apiService
        .getDistrictData(this.searchForm.value.state)
        .subscribe((res) => {
          this.districts = res.districts;
        });
    }
  }

  allNewDataPush = [];
  allNewBanner = <any>[];
  receiveNoti(e: any) {
    //this.showTime = this.date.toLocaleTimeString();
    let pushNoti = e.newPushData;
    let bannerNoti = e.newBannerData;
    this.allNewDataPush.push(...pushNoti);
    this.allNewBanner.push(...bannerNoti);
    this._notificationService.generateNotification(this.allNewDataPush);
  }

  dismissCard(index: number) {
    this.allNewBanner.splice(index, 1);
  }

  onSubmitForm() {
    this.searchClicked = true;
    this.apiService.invokeFilterMethodClick({
      ageFilter: [],
      doseFilter: [],
      feeFilter: [],
    });
    this.clearSearchValues();

    this.apiCalls();
  }
  clearSearchValues() {
    var e: any = document.getElementsByName('fChecks');
    e.forEach((ele) => {
      ele.checked = false;
    });

    const checkArrayDose: FormArray = this.searchForm.get(
      'checkArrayDose'
    ) as FormArray;
    checkArrayDose.clear();
    const checkArrayAge: FormArray = this.searchForm.get(
      'checkArrayAge'
    ) as FormArray;
    checkArrayAge.clear();
    const checkArrayFee: FormArray = this.searchForm.get(
      'checkArrayFee'
    ) as FormArray;
    checkArrayFee.clear();
  }
  apiCalls() {
    if (this.searchForm.value.selectTypeRadio == 'byPin') {
      if (this.searchForm.value.pinCode == '000000') {
        this.apiService
          .getDetailsByPinTest(this.searchForm.value.pinCode, this.todayDate)
          .subscribe(
            (res) => {
              this.isEmpty = false;
              this.dataCurrent = res;
              if (!this.dataCurrent.length) {
                this.isEmpty = true;
              } else {
                setTimeout(() => {
                  var element = document.getElementById(
                    'explore-fiter-section'
                  );
                  element.scrollIntoView(true);
                }, 500);
              }

              setTimeout(() => {
                this.dataPrevious = this.dataCurrent;
              }, 4000);
            },
            (err) => {
              this.isEmpty = true;
            }
          );
      } else {
        this.apiService
          .getDetailsByPin(this.searchForm.value.pinCode, this.todayDate)
          .subscribe(
            (res) => {
              this.isEmpty = false;
              this.dataCurrent = res.centers;
              if (!this.dataCurrent.length) {
                this.isEmpty = true;
              } else {
                setTimeout(() => {
                  var element = document.getElementById(
                    'explore-fiter-section'
                  );
                  element.scrollIntoView(true);
                }, 500);
              }

              setTimeout(() => {
                this.dataPrevious = this.dataCurrent;
              }, 4000);
            },
            (err) => {
              this.isEmpty = true;
            }
          );
      }
    } else if (this.searchForm.value.selectTypeRadio == 'byDistrict') {
      this.apiService
        .getDetailsByDist(this.searchForm.value.district, this.todayDate)
        .subscribe(
          (res) => {
            this.isEmpty = false;
            this.dataCurrent = res.centers;
            if (!this.dataCurrent.length) {
              this.isEmpty = true;
            } else {
              setTimeout(() => {
                var element = document.getElementById('explore-fiter-section');
                element.scrollIntoView(true);
              }, 500);
            }

            setTimeout(() => {
              this.dataPrevious = this.dataCurrent;
            }, 4000);
          },
          (err) => {
            this.isEmpty = true;
          }
        );
    }
  }
  toggleWay(value) {
    console.log(value);

    if (value == 'byDistrict') {
      if (!this.states.length) {
        this.apiService.getStatesData().subscribe((res) => {
          this.states = res.states;
        });
      }
      this.searchForm.controls.state.setValidators([Validators.required]);
      this.searchForm.controls.district.setValidators([Validators.required]);
      this.searchForm.controls.pinCode.clearValidators();
    } else if (value == 'byPin') {
      this.searchForm.controls.state.clearValidators();
      this.searchForm.controls.district.clearValidators();
      this.searchForm.controls.pinCode.setValidators([
        Validators.min(6),
        Validators.required,
      ]);
    }
    this.searchForm.controls.state.updateValueAndValidity();
    this.searchForm.controls.district.updateValueAndValidity();
    this.searchForm.controls.pinCode.updateValueAndValidity();
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
    const checkArrayDose: FormArray = this.searchForm.get(
      'checkArrayDose'
    ) as FormArray;

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

    this.apiService.invokeFilterMethodClick({
      ageFilter: this.searchForm.value.checkArrayAge,
      doseFilter: this.searchForm.value.checkArrayDose,
      feeFilter: this.searchForm.value.checkArrayFee,
    });
  }
  onCheckboxChangeFee(e) {
    const checkArrayFee: FormArray = this.searchForm.get(
      'checkArrayFee'
    ) as FormArray;

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
    this.apiService.invokeFilterMethodClick({
      ageFilter: this.searchForm.value.checkArrayAge,
      doseFilter: this.searchForm.value.checkArrayDose,
      feeFilter: this.searchForm.value.checkArrayFee,
    });
  }
  onCheckboxChangeAge(e) {
    const checkArrayAge: FormArray = this.searchForm.get(
      'checkArrayAge'
    ) as FormArray;

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
    this.apiService.invokeFilterMethodClick({
      ageFilter: this.searchForm.value.checkArrayAge,
      doseFilter: this.searchForm.value.checkArrayDose,
      feeFilter: this.searchForm.value.checkArrayFee,
    });
  }
  isEmptyArr = [];
  isEmptyCheck(e: any) {
    // this.isEmptyArr.push(e)
    // if(!e){
    //   this.isEmpty = false;
    // }
  }
  getNotify() {
    this._notificationService.requestPermission();
    this.dataPrevious = this.dataCurrent;
    this.intervalNotify = setInterval(() => {
      this.apiCalls();
      this.allNewDataPush = [];
    }, 7000);
    this.apiService.invokeNotificationClick(true);
  }
  stopNotify() {
    clearInterval(this.intervalNotify);
    this.apiService.invokeNotificationClick(false);
    this.allNewBanner = [];
    this.apiService.setIndiNotify(null);
  }
  loadBackground() {
    var randomNum = Math.ceil(Math.random() * 5);

    if (randomNum == 1) {
      document.getElementById('home-section').style.backgroundImage =
        "url('https://cdn.pixabay.com/photo/2020/05/20/21/36/corona-5198347_960_720.jpg')";
    } else if (randomNum == 2) {
      document.getElementById('home-section').style.backgroundImage =
        "url('https://cdn.pixabay.com/photo/2016/12/05/19/46/syringe-1884779_960_720.jpg')";
    } else if (randomNum == 3) {
      document.getElementById('home-section').style.backgroundImage =
        "url('https://cdn.pixabay.com/photo/2020/04/28/07/01/vaccine-5103088_960_720.jpg')";
    } else if (randomNum == 4) {
      document.getElementById('home-section').style.backgroundImage =
        "url('https://cdn.pixabay.com/photo/2021/01/06/19/45/vaccine-5895477_960_720.jpg')";
    } else if (randomNum == 5) {
      document.getElementById('home-section').style.backgroundImage =
        "url('https://cdn.pixabay.com/photo/2019/01/02/06/31/syringe-3908157_960_720.jpg')";
    }
  }
  ngOnDestroy() {
    clearInterval(this.intervalNotify);
    this.triggerNotificationSubs.unsubscribe();
    this.getIndiNotiSubs.unsubscribe();
  }
}
