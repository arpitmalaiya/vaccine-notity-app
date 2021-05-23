import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-verify-otp',
  templateUrl: './verify-otp.component.html',
  styleUrls: ['./verify-otp.component.scss']
})
export class VerifyOtpComponent implements OnInit {

  otpForm:FormGroup
  constructor(private router:Router,private fb:FormBuilder) { }


  ngOnInit(): void {
   this.otpForm = this.fb.group({
    otp: ['', [Validators. required]]
   })
    
  }
  

  onSubmitForm(){
    console.log(this.otpForm);
    this.router.navigate(["/verify-otp"])
  }
}
