import { Component, OnInit } from '@angular/core';
import { ApiUrlService } from 'src/app/shared/api-url.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  isDataAvailable: boolean;

  constructor(private apiService:ApiUrlService) { }

  ngOnInit(): void {
    this.apiService.isDataAvailable.subscribe(res=>{
      this.isDataAvailable = res;
    })
  }

  clickBell(){
    this.apiService.clickTriggerNotification();
  }
}
