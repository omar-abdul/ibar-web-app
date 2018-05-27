import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {map, tap , finalize, catchError} from 'rxjs/operators';



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

        return next.handle(req).pipe(
            finalize(()=> this.loadingService.onFinished(req)))

    }

}