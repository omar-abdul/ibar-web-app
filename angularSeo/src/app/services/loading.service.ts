import { Injectable, EventEmitter } from '@angular/core';
import {  
  HttpInterceptor, 
  HttpHandler, 
  HttpRequest,
  HttpEvent
} from '@angular/common/http';
@Injectable()
export class LoadingService {
  onLoadingChanged :EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor() { 
    
  }

  private requests:HttpRequest<any>[]=[];

  onStarted(req:HttpRequest<any>):void{
    
  
      this.requests.push(req);
      this.notify();
    


  }
  onFinished(req:HttpRequest<any>):void{
    const index = this.requests.indexOf(req);
    if(index !==-1){
      this.requests.splice(index,1)
    }
    this.notify();
  }
  private notify(): void {
    let load = false;


    this.onLoadingChanged.emit(this.requests.length > 0);
  }

}
