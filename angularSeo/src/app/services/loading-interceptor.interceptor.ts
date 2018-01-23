import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch'
import 'rxjs/add/operator/finally';


import {  
    HttpInterceptor, 
    HttpHandler, 
    HttpRequest,
    HttpEvent
  } from '@angular/common/http';
import { LoadingService } from './loading.service';

@Injectable()
export class LoadingInterceptor implements HttpInterceptor{
    constructor(private loadingService:LoadingService){}

    intercept(req:HttpRequest<any>,next:HttpHandler):Observable<HttpEvent<any>>{
        this.loadingService.onStarted(req);

        return next.handle(req).finally(()=> this.loadingService.onFinished(req))

    }

}