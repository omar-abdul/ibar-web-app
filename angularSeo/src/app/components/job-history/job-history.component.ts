import { Component, OnInit, Input } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'job-history',
  templateUrl: './job-history.component.html',
  styleUrls: ['./job-history.component.css']
})
export class JobHistoryComponent implements OnInit {
  @Input() isMentor:boolean;
   isHistory :boolean=true;
   jobs:any[]=[];




  constructor(private authService:AuthService) { }



  ngOnInit() {

    this.authService.getJobHistory().subscribe(data => {
      
      if (data["success"]) {
        this.jobs = data['job'].slice();         
      }
     

      if(!Array.isArray(this.jobs) || !this.jobs.length){
        this.isHistory = false;
      }
    });

    
  }
 

}
