import { Component, OnInit } from "@angular/core";
import { AuthService } from "../../services/auth.service";
import { ValidateService } from "../../services/validate.service";
import { Router } from "@angular/router";
import { LoadingService } from "../../services/loading.service";

@Component({
  selector: "app-change-password",
  templateUrl: "./change-password.component.html",
  styleUrls: ["./change-password.component.css"]
})
export class ChangePasswordComponent implements OnInit {
  password: any;
  updated: boolean = true;
  message: any;
  loading = false;

  constructor(
    public aService: AuthService,
    private router: Router,
    private vd: ValidateService,
    private loadingService: LoadingService
  ) {
    loadingService.onLoadingChanged.subscribe(
      isLoading => (this.loading = isLoading)
    );
  }

  ngOnInit() {}

  updatePassword() {
    var user = {
      password: this.password
    };
    if (!this.vd.validatePasswordLength(user)) {
      this.updated = false;
      this.message = "password must be at least 8 characters long";
      return;
    }
    this.aService.updatePassword(user).subscribe(data => {
      if (data["success"]) {
        this.router.navigate(["/profile"]);
      } else {
        this.updated = false;
        this.message="";
        if(data["msg"] instanceof Array){
          data["msg"].forEach(e => (this.message +=   e.msg+" \n"));
        }else{this.message+=data["msg"]}
      }
    });
  }
}
