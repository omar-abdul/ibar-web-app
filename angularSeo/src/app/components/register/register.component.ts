import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { ValidateService } from "../../services/validate.service";

import { AuthService } from "../../services/auth.service";
import { Router, ActivatedRoute } from "@angular/router";
import { parse } from "libphonenumber-js";
import { LoadingService } from "../../services/loading.service";

@Component({
  selector: "app-register",
  templateUrl: "./register.component.html",
  styleUrls: ["./register.component.css"]
})
export class RegisterComponent implements OnInit {
  name: string;
  phoneNumber: string;
  password: string;
  email: any;
  returnUrl: string;
  validated: boolean;
  registered: boolean;
  message: string;
  statusOk: boolean = false;
  confirmPass: any;
  isLoading = false;
  role = "mentors"

  constructor(

    ls: LoadingService
  ) {
    ls.onLoadingChanged.subscribe(isLoading => (this.isLoading = isLoading));
  }

  ngOnInit() {
    
  }
  
}
