import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot,Router } from '@angular/router';
import {DataService} from '../services/data.service'

@Injectable()
export class PasswordGuard implements CanActivate {
  constructor(private data:DataService,private router:Router){}
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot) {
      var verified:boolean;
      this.data.currentToken.subscribe(tok=>{verified = tok})
      if(verified){
        return true
      }
      else{
        this.router.navigate(['/forgot-password']);
        return false;
      }
      
      
    
  }
}
