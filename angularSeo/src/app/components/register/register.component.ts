import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { ValidateService } from "../../services/validate.service";
// import {FlashMessagesService} from 'ngx-flash-messages';
import { AuthService } from "../../services/auth.service";
import { Router, ActivatedRoute } from "@angular/router";
import{parse,asYouType} from 'libphonenumber-js';
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
  email:any;
  returnUrl: string;
  validated: boolean;
  registered :boolean;
  message:string;
  statusOk :boolean = false;
  confirmPass:any
  isLoading=false

  constructor(
    private validateService: ValidateService,
    private route: ActivatedRoute,
  
    public authService: AuthService,
    private router: Router,
    ls:LoadingService
  ) { ls.onLoadingChanged.subscribe(isLoading=>this.isLoading = isLoading)}

  ngOnInit() {
     this.validated = true;
    this.registered = true;
   
    this.returnUrl = this.route.snapshot.queryParams["returnUrl"] || "/";
    if (this.authService.loggedIn()) {
      this.router.navigate([this.returnUrl]);
    }
  }
  @ViewChild("role") role: ElementRef;

  passValidation(user){
    if (!this.validateService.validateRegister(user)) {
      // this.flashMessage.show('Please fill in all fields', {
      //   classes: ['alert', 'alert-danger'],
      //   timeout: 3000, // Default is 3000
      // });
      this.validated = false;
      this.message="Please fill all the fields";
      return false;
    }
   else if(!this.validateService.validatePasswordMatch(user.confirmPass,user.password)){
      this.validated = false;
      this.message="Password fields do not match";
      return false
    }
    else if(!this.validateService.validateEmail(user.email)){
      this.validated = false;
      this.message="Please enter a valid email address";
      return false;
    }
  else  if (!this.validateService.validatePhoneNumber(user.phoneNumber)) {
      this.validated = false;
      this.message="Please enter a valid phone number in the Somali region";
      return false;
    } 
    else{
      return true;
    }
  }

  async onRegisterSubmit() {
    const user = {
      name: this.name,
      phoneNumber:'+252'+this.phoneNumber,
      email:this.email,
      password: this.password,
      role: this.role.nativeElement.value,
      confirmPass:this.confirmPass
    };
    //console.log(this.role.nativeElement.value);
    let passed = await this.passValidation(user);
    if(!passed){return;}
    else{
      this.authService.registerUser(user).subscribe(data => {
        //console.log(data);
        if (data['success']) {
          
          this.statusOk= true;
         this.message=data['msg'];
         this.registered=true;
         this.validated=true;
        }   else if(!data['success']){
          this.registered = false;

          this.statusOk = false;
          this.message=""
          data['msg'].forEach(e=>this.message+="\n"+e.msg)
          return;
        }
      });
    }
  }
}
