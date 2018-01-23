import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { ValidateService } from "../services/validate.service";
// import {FlashMessagesService} from 'ngx-flash-messages';
import { AuthService } from "../services/auth.service";
import { Router, ActivatedRoute } from "@angular/router";
import {parse,asYouType} from 'libphonenumber-js';
import {Meta, Title} from '@angular/platform-browser'
import { LoadingService } from "../services/loading.service";

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
     this.validated = true;
    this.registered = true;
   
    this.returnUrl = this.route.snapshot.queryParams["returnUrl"] || "/";
    if (this.authService.loggedIn()) {
      this.router.navigate([this.returnUrl]);
    }
  }
  @ViewChild("role") role: ElementRef;

  onRegisterSubmit() {
    let formated_num =new asYouType().input(this.phoneNumber)
    const user = {
      name: this.name,
      phoneNumber:'+252'+this.phoneNumber,
      email:this.email,
      password: this.password,
      role: this.role.nativeElement.value,
      confirmPass:this.confirmPass
    };
    //console.log(this.role.nativeElement.value);
    if (!this.validateService.validateRegister(user)) {
      // this.flashMessage.show('Please fill in all fields', {
      //   classes: ['alert', 'alert-danger'],
      //   timeout: 3000, // Default is 3000
      // });
      this.validated = false;
      this.message="Please fill all the fields";
      return;
    }
    if(!this.validateService.validatePasswordMatch(user.confirmPass,user.password)){
      this.validated = false;
      this.message="Password fields do not match";
      return;
    }
    if(!this.validateService.validateEmail(user.email)){
      this.validated = false;
      this.message="Please enter a valid email address";
      return;
    }
    if (!this.validateService.validatePhoneNumber(user.phoneNumber)) {
      this.validated = false;
      this.message="Please enter a valid phone number in the Somali region ";
      return;
    } else {
      this.authService.registerUser(user).subscribe(data => {
        //console.log(data);
        if (data['success']) {
          this.statusOk= true;
         this.message=data['msg'];
         this.registered=true;
         this.validated=true;
        } else if(!data['success']){
          this.registered = false;
          this.statusOk= false;
          this.message=""
          data['msg'].forEach(e=>this.message+="\n"+e.msg)
          return;
        }
      });
    }
  }
}
