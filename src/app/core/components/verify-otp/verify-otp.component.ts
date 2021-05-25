import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { sha256, sha224 } from 'js-sha256';
import { ApiUrlService } from 'src/app/shared/api-url.service';

@Component({
  selector: 'app-verify-otp',
  templateUrl: './verify-otp.component.html',
  styleUrls: ['./verify-otp.component.scss']
})
export class VerifyOtpComponent implements OnInit {

  otpForm:FormGroup
  txnId: string;
  temp = 7878
  constructor(private router:Router,private fb:FormBuilder,private route: ActivatedRoute,private apiService:ApiUrlService) { }


  ngOnInit(): void {
   this.otpForm = this.fb.group({
    otp: ['', [Validators. required]]
   })

   this.txnId = this.route.snapshot.paramMap.get('txnId');
  }
  

  onSubmitForm(){
    console.log(this.otpForm);
    let data ={
      "otp": sha256(this.otpForm.value.otp),
      "txnId": this.txnId
  }
    this.apiService.verifyOtp(data).subscribe(
      res=>{
        console.log(res);
        if(res.isNewAccount == "N"){
          localStorage.setItem('jwtToken',res.token);
        this.router.navigate(["/dashboard"])
        }
        else{
          alert("Please first register in cowin portal")
        }
        
      }
    )
    
  }
}
