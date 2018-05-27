import { Component, OnInit,OnDestroy } from "@angular/core";
import {
  Router,
  NavigationStart,
  Event as NavigationEvent
} from "@angular/router";

import { AuthService,LoggedUser } from "../../services/auth.service";

import { Observable, timer } from "rxjs";

import {takeWhile} from "rxjs/operators"
;

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
 

    
      timer(0,this.interval)
      .pipe(takeWhile(()=>this.alive))

      .subscribe(()=>{
        this.authService.loadToken()
        if(this.authService.loggedIn() && (this.authService.refreshToken!==undefined ||
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

        this.authService.clearStorage()
        
      
      this.router.navigateByUrl('');

    });
 
  
  }
}
