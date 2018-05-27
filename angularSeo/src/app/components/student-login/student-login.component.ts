import { Component, OnInit ,ViewChild,ElementRef} from '@angular/core';
import { AuthService } from "../../services/auth.service";
import { Router, ActivatedRoute } from "@angular/router";
import { ValidateService } from "../../services/validate.service";
import { LoadingService } from "../../services/loading.service";

@Component({
  selector: 'app-student-login',
  templateUrl: './student-login.component.html',
  styleUrls: ['./student-login.component.css']
})
export class StudentLoginComponent implements OnInit {
  email: any;
  password: String;
  returnUrl: String;
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

    this.returnUrl = this.route.snapshot.queryParamMap["returnUrl"] || "/";
    if (this.authService.loggedIn()) {
      this.router.navigate([this.returnUrl]);
    }
    this.validated = true;
    this.authenticated = true;
  }
  @ViewChild("role") role:ElementRef;
  onLoginSubmit() {
    const user = {
      email: this.email,
      password: this.password,
      role:this.role.nativeElement.value
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
      this.authService.authenticateStudent(user).subscribe(data => {
        if (data["success"]) {
          this.authService.storeUserData(data["token"], data["user"],data["refresh_token"]);
          if (this.currentUrl === "/login") {
            this.router.navigate([this.returnUrl]);
          } else {
          }
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
