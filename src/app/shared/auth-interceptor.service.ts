import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthInterceptorService implements HttpInterceptor {
  tkn: string = '';

  constructor() { 
    this.tkn = localStorage.getItem('jwtToken')
    console.log(this.tkn);
    
  }
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    if(this.tkn){
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${this.tkn}`
        }
      });
      return next.handle(request);
    }
    else{
      return next.handle(request);
    }
  }
}
