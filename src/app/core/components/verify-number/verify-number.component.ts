import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-verify-number',
  templateUrl: './verify-number.component.html',
  styleUrls: ['./verify-number.component.scss']
})
export class VerifyNumberComponent implements OnInit {

  numberForm:FormGroup
  constructor(private router:Router,private fb:FormBuilder) { }

  ngOnInit(): void {
   this.numberForm = this.fb.group({
    number: ['', [Validators. required, Validators. pattern("^((\\+91-?) |0)?[0-9]{10}$")]]
   })
    
  }
  

  onSubmitForm(){
    console.log(this.numberForm);
    this.router.navigate(["/verify-otp"])
  }
}
