import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiUrlService } from 'src/app/shared/api-url.service'

@Component({
  selector: 'app-verify-number',
  templateUrl: './verify-number.component.html',
  styleUrls: ['./verify-number.component.scss']
})
export class VerifyNumberComponent implements OnInit {

  numberForm:FormGroup
  constructor(private router:Router,private fb:FormBuilder,private apiService:ApiUrlService) { }

  ngOnInit(): void {
   this.numberForm = this.fb.group({
    number: ['', [Validators. required, Validators. pattern("^((\\+91-?) |0)?[0-9]{10}$")]]
   })
    
  }
  

  onSubmitForm(){
    console.log(this.numberForm);
    localStorage.setItem('currentNum',this.numberForm.value.number);
    let data = {
      "mobile": this.numberForm.value.number,
      "secret": "U2FsdGVkX199mL8o4K9DDUZAIkJ7asQOSvOZJtlcrTPI4begf3g0nLH+hAp1krrJAhsmeSagIENbStPao8KYig=="
    }
    this.apiService.sendOtp(data).subscribe(
      res=>{
        console.log(res);
        this.router.navigate(["/verify-otp",{'txnId':res.txnId}])
      }
    )
    
  }
}
