import { Component, OnInit } from "@angular/core";
import {
  Router,
  NavigationStart,
  Event as NavigationEvent
} from "@angular/router";
import "rxjs/add/operator/filter";
import { AuthService } from "../../services/auth.service";

@Component({
  selector: "app-navbar",
  templateUrl: "./navbar.component.html",
  styleUrls: ["./navbar.component.css"]
})
export class NavbarComponent implements OnInit {
  isHomePage = false;
  name:string;
  nameTemp:string;
  mentor:any;
  navbarCollapsed:boolean=true;
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
 

  }
//   ngAfterContentChecked(){
//      if(this.authService.loggedIn()){
//        this.authService.loadToken();

//       console.log(this.authService.user);
//       var temp = this.authService.user.name.toString();
//       var string = temp.split(" ");
//       var i = 0;
//       this.name=string[0].toLocaleLowerCase();
//       for(var i = 0; i<string.length;i++){
//         console.log(string[i]);
//         if(string.length>1)
//         {
//          this.name+="-"+string[i+1].toLocaleLowerCase();
//          break;
//         }
//         else
//         {
//           this.name = string[i].toLocaleLowerCase();
//         }

//         if(temp!==this.name){
//           this.router.navigate(['error-page'])
//         }




//     }
//   }
// }
  onLogOutClick() {
    this.authService.logOut();
    this.router.navigate(["/"]);
    return false;
  }

}
