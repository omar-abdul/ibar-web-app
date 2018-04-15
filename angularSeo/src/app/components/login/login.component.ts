import { Component, OnInit } from "@angular/core";
import { AuthService } from "../../services/auth.service";
import { Router, ActivatedRoute } from "@angular/router";
// import {FlashMessagesService} from 'ngx-flash-messages';
import { ValidateService } from "../../services/validate.service";
import { LoadingService } from "../../services/loading.service";
@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"]
})
export class LoginComponent implements OnInit {
  email: any;
  password: String;
  returnUrl: String;
  validated: boolean;
  authenticated: boolean;
  message: any;
  isLoading = false;

  constructor(
    private validateService: ValidateService,
    private route: ActivatedRoute,
    public authService: AuthService,
    // private flashMessage:FlashMessagesService
    private router: Router,
    ls:LoadingService
  ) { ls.onLoadingChanged.subscribe(isLoading=>this.isLoading = isLoading)}

  ngOnInit() {
 
  }
  
}
