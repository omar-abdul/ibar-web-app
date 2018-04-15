import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { ValidateService } from "../../services/validate.service";
// import {FlashMessagesService} from 'ngx-flash-messages';
import { AuthService } from "../../services/auth.service";
import { Router, ActivatedRoute } from "@angular/router";
import {parse} from 'libphonenumber-js';
import {Meta, Title} from '@angular/platform-browser'
import { LoadingService } from "../../services/loading.service";

@Component({
  selector: 'app-register-student',
  templateUrl: './register-student.component.html',
  styleUrls: ['./register-student.component.css']
})
export class RegisterStudentComponent implements OnInit {
  name: string;
  phoneNumber: string;
  password: string;
  email:any;
  returnUrl: string;
  validated: boolean;
  registered :boolean;
  message:string;
  statusOk:boolean=false;
  confirmPass:any;
  isLoading = false;
  role = "students";

  constructor(
    meta:Meta,title:Title,
    private validateService: ValidateService,
    private route: ActivatedRoute,
  
    public authService: AuthService,
    private router: Router,
    private ls:LoadingService
  ) {
    ls.onLoadingChanged.subscribe(isLoading=>this.isLoading=isLoading);
    
  }

  ngOnInit() {

  }
 
}
