import { Injectable } from '@angular/core';
import {Router, CanActivate,ActivatedRouteSnapshot, RouterStateSnapshot,CanDeactivate } from '@angular/router';
import {AuthService} from '../services/auth.service';


@Injectable()
export class StudentGuard implements CanActivate{

	constructor(private authService:AuthService, 
		private router:Router){}

	canActivate(route: ActivatedRouteSnapshot, 
		state: RouterStateSnapshot){
		if(!this.authService.isMentor()){
			return true;

		}else{
			this.router.navigate(['']);
			return false;
		}
	}


  }
	
