import { Component, OnInit,OnDestroy } from "@angular/core";
import {
  Router,
  NavigationStart,
  Event as NavigationEvent
} from "@angular/router";
import "rxjs/add/operator/filter";
import { AuthService,LoggedUser } from "../../services/auth.service";

import { Observable } from "rxjs";
import { TimerObservable } from "rxjs/observable/TimerObservable";
import 'rxjs/add/operator/takeWhile';

@Component({
  selector: "app-navbar",
  templateUrl: "./navbar.component.html",
  styleUrls: ["./navbar.component.css"]
})
export class NavbarComponent implements OnInit,OnDestroy {
  isHomePage = false;
  name: string;
  nameTemp: string;
  mentor: any;
  private alive=true;
  private user: LoggedUser;
  private interval = 600000;
  navbarCollapsed: boolean = true;
  constructor(public authService: AuthService, private router: Router) {
    router.events.forEach((event: NavigationEvent) => {
      if (event instanceof NavigationStart) {
        if (event.url !== "/") {
          this.isHomePage = false;
        } else {
          this.isHomePage = true;
        }
      }
    });
  }


  ngOnInit() {
 

    
      TimerObservable.create(0,this.interval)
      .takeWhile(()=>this.alive)
      .subscribe(()=>{
        this.authService.loadToken()
        if(!this.authService.loggedIn() && (this.authService.refreshToken!==undefined ||
        this.authService.refreshToken!==null)){
          this.authService.getrefreshToken()
          .subscribe(data=>{
            
            this.user = data;
            
            
            if(this.user.success){
              this.authService.storeUserData(this.user.token,this.user.user,this.user.refresh_token);
            }
            else {
              this.onLogOutClick()
            }
    
    
    
          })
        }

      })
    

  }
  
  ngOnDestroy(){
    this.alive = false;
  }
  
  onLogOutClick() {
    this.authService.logOut().subscribe(data=>{
      if(data['success']){
        this.authService.clearStorage()
        
      }
      this.router.navigateByUrl('');

    });
 
  
  }
}
