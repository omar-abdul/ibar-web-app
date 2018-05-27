import { Component, OnInit,Output } from "@angular/core";
import { AuthService } from "../../services/auth.service";
import { Router, ActivatedRoute } from "@angular/router";
import { ValidateService } from "../../services/validate.service";
import { LoadingService } from "../../services/loading.service";


@Component({
  selector: "app-login-form",
  templateUrl: "./login-form.component.html",
  styleUrls: ["./login-form.component.css"]
})
export class LoginFormComponent implements OnInit {
  email: any;
  password: String;
  returnUrl: string;
  validated: boolean;
  authenticated: boolean;
  message: any;
  isLoading = false;
  currentUrl: any;
  

  constructor(
    private validateService: ValidateService,
    private route: ActivatedRoute,
    public authService: AuthService,
    private router: Router,
    ls: LoadingService
  ) {
    ls.onLoadingChanged.subscribe(isLoading => (this.isLoading = isLoading));
  }

  ngOnInit() {
    this.currentUrl = this.router.url;

    this.returnUrl = this.route.snapshot.queryParamMap.get('returnUrl')||'/profile';
    if (this.authService.loggedIn()) {
      
      this.router.navigate([this.returnUrl]);
    }
    this.validated = true;
    this.authenticated = true;
   
  }
  onLoginSubmit() {
    const user = {
      email: this.email,
      password: this.password
    };

    if (!this.validateService.validateLogin(user)) {
      this.validated = false;
      this.message = "Please fill in all fields";
      return;
    } else if (!this.validateService.validateEmail(user.email)) {
      this.validated = false;
      this.message = "Please enter a valid email";
      return;
    } else {
      this.authService.authenticate(user).subscribe(data => {
        if (data["success"]) {
          this.authService.storeUserData(data["token"], data["user"],data['refresh_token']);

          
            this.router.navigate([this.returnUrl]);
          
        } else {
          this.authenticated = false;
          this.message="";
          if(data["msg"] instanceof Array){
            data["msg"].forEach(e => (this.message +=   e.msg+" \n"));
          }else{this.message+=data["msg"]}
        }
      });
    }
  }
}
