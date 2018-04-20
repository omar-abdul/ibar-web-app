import { Component, OnInit } from "@angular/core";
import { AuthService } from "../../services/auth.service";
import { ValidateService } from "../../services/validate.service";
import { Router, ActivatedRoute } from "@angular/router";
import { LoadingService } from "../../services/loading.service";
@Component({
  selector: "app-verifiy-token",
  templateUrl: "./verifiy-token.component.html",
  styleUrls: ["./verifiy-token.component.css"]
})
export class VerifiyTokenComponent implements OnInit {
  public validated: boolean = true;
  public authenticated = false;
  public verified = true;
  public message: string;
  email: any;
  token: any;
  isLoading = false;

  constructor(
    public authService: AuthService,
    private validateService: ValidateService,
    private router: Router,
    private route: ActivatedRoute,
    ls: LoadingService
  ) {
    ls.onLoadingChanged.subscribe(isLoading => (this.isLoading = isLoading));
  }

  ngOnInit() {}

  confirmToken() {
    var user = {
      token: this.token
    };
    this.authService.confirmToken(user).subscribe(data => {
      if (data["success"]) {
        this.authService.storeUserData(data["token"], data["user"],data["refresh_token"]);
        this.router.navigate(["/change-password"]);
      } else {
        this.verified = false;
        if(data["msg"] instanceof Array){
          data["msg"].forEach(e => (this.message +=   e.msg+" \n"));
        }else{this.message+=data["msg"]}
      }
    });
  }
}
