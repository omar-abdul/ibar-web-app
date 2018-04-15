import { Component, OnInit,Input } from '@angular/core';
import {AuthService} from "../../services/auth.service"
import {DataService} from "../../services/data.service"

@Component({
  selector: 'app-resend-token',
  templateUrl: './resend-token.component.html',
  styleUrls: ['./resend-token.component.css']
})
export class ResendTokenComponent implements OnInit {
  message:string;
  statusOk:boolean = true;
  email:string;
  


  constructor(private authService:AuthService,private dataService:DataService) { }

  ngOnInit() {
    this.dataService.currentEmail.subscribe(email=>this.email = email);
    
  }
  resendToken() {
    
    if(this.email!==null){
      const user = {
        email: this.email
      };
      this.authService.resendToken(user).subscribe(data => {
        
        if (!data["success"]) {
          this.statusOk = false;
          this.message = "";
          if(data["msg"] instanceof Array){
            data["msg"].forEach(e => (this.message += e.msg + " \n"));
          }
          else {
            this.message += data["msg"];
          }
          return;
        }
        else {
          
          this.statusOk = true;
          this.message = data["msg"];
  
        }
      });

    }
    return;
  }

}
