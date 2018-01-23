import { Component, OnInit } from '@angular/core';
import {AuthService} from '../../services/auth.service';
import { ValidateService } from "../../services/validate.service";
import { DataService } from "../../services/data.service";
import { Router ,ActivatedRoute} from '@angular/router';
import {LoadingService} from '../../services/loading.service'

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {
  public validated:boolean=true;
  public authenticated = false;
  public verified = true;
  public message:string;
  email:any
  token:any;
  isLoading= false;

  constructor(public authService:AuthService,
    ls:LoadingService,
    private validateService:ValidateService,
    private router:Router,private route:ActivatedRoute,
    private dataService:DataService) { 
      ls.onLoadingChanged.subscribe(isLoading=>this.isLoading = isLoading)
    }
    

  ngOnInit() {

 
  }

  sendEmail(){
    
    if(!this.validateService.validateEmail(this.email)){
      this.validated=false;
      this.message="please enter a valid email"

    }

    this.authService.resetPassword(this.email).subscribe(data=>{
      if(data['success']){
        var verified = true;
        this.dataService.changeToken(verified);
        
        this.router.navigate(['/verify-token']);
       
      }
      else{
        this.verified=false;
        this.message =data['msg'];
      }
    })
  }





}