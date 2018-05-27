import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot ,Router} from '@angular/router';
import { Observable } from 'rxjs';
import {DataService} from "../services/data.service";

@Injectable()
export class CofirmGuard implements CanActivate {
  isReg:boolean
  constructor(private dataService:DataService,private router:Router){}
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
      

      this.dataService.isRegistered.subscribe(registered=>{
        this.isReg = registered;
      })
      if(this.isReg){
        return true;
      }else{
        this.router.navigate(['']);
      }
    
  }
}
