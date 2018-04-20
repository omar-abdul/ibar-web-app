import { Component, OnInit, Input } from '@angular/core';
import {AuthService} from '../../services/auth.service';
import { MentorService } from '../../services/mentor-service.service';


@Component({
  selector: 'profile-card',
  templateUrl: './profile-card.component.html',
  styleUrls: ['./profile-card.component.css']
})
export class ProfileCardComponent implements OnInit {
  @Input('user') user:any;
  @Input('isProfile') isProfile:boolean;
  @Input('isMentor') isMentor:boolean;
  showNumber :boolean;
  message:string
  

  constructor(private authService:AuthService,private mentorService:MentorService) { }

  ngOnInit() {
  }
  requestMentor(mentor: any) {

    return this.authService.registerJob(mentor).subscribe(data => {
      if (data["success"]) {
        this.showNumber = true;
        this.mentorService.sendBoolean(this.showNumber);
        this.mentorService.sendNumber(mentor.phone_number);
        this.message = mentor.phone_number;
      } else {
        this.showNumber = true;
        this.message = data["msg"];
      }
    });
  }


}
