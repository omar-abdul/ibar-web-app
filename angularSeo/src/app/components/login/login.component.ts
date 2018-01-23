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

    this.returnUrl = this.route.snapshot.queryParams["returnUrl"] || "/";
        if(this.authService.loggedIn()){
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
    //console.log(user);
    if (!this.validateService.validateLogin(user)) {
      // //   this.flashMessage.show('Fields cannot be empty', {
      // //   classes: ['alert', 'alert-danger'],
      // //   timeout: 3000, // Default is 3000
      this.validated = false;
      this.message = "Please fill in all fields";
      return;
    } else if (!this.validateService.validateEmail(user.email)) {
      this.validated = false;
      this.message = "Not Valid Number";
      return;
    } else {
      // }

      this.authService.authenticate(user).subscribe(data => {
        //console.log(data);
        if (data['success']) {
          this.authService.storeUserData(data['token'], data['user']);
          //   this.flashMessage.show("Login finally happened",{classes:["alert alert-success"],
          //     timeout:3000
          // });
          this.router.navigate([this.returnUrl]);
        } else {
          this.authenticated = false;
          this.message = data['msg'];
          //   this.flashMessage.show(data.msg ,{classes:["alert alert-danger"],
          //     timeout:3000
          // });
        }
      });
    }
  }
}
