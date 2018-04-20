import { Component, OnInit,Input } from '@angular/core';
import {MentorService} from "../../services/mentor-service.service";
import {AuthService} from "../../services/auth.service"

@Component({
  selector: 'mentor-card',
  templateUrl: './mentor-card.component.html',
  styleUrls: ['./mentor-card.component.css']
})
export class MentorCardComponent implements OnInit {

@Input() mentor:any
  constructor(private mentorService:MentorService,private authService:AuthService) { }

  ngOnInit() {
  }
  public message:any;
  public showNumber:boolean=false;
  requestMentor(mentor: any) {

    return this.authService.registerJob(mentor).subscribe(data=>{
      if(data['success']){
        this.showNumber = true;
        this.mentorService.sendBoolean(this.showNumber)
        this.mentorService.sendNumber(mentor.phone_number);
        this.message = mentor.phone_number;
      }
      else{
        this.showNumber = true;
        this.message = data['msg']
      }
    })
}
}
