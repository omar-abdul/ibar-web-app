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
  name: string;
  nameTemp: string;
  mentor: any;
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

  ngOnInit() {}
  
  onLogOutClick() {
    this.authService.logOut();
    this.router.navigate(["/"]);
    return false;
  }
}
