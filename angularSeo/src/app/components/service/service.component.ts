import { Component, OnInit } from '@angular/core';
import {AuthService} from '../../services/auth.service';


@Component({
  selector: 'app-service',
  templateUrl: './service.component.html',
  styleUrls: ['./service.component.css']
})
export class ServiceComponent implements OnInit {

 public subjects = 
[ 'English' ,
 "Art"  ,
 "Chemisty" ,
 "Physics" ,
 "Math" ,
 "ICT"  ,
 "Psychology",
 "Philosophy",
"Biology",
 "Science"  ,
 "Economics" ,
"Computer Science" ,"Sociology"  ];


  constructor(private authService:AuthService) { }
  getAllSub(){
  
  }

  ngOnInit() {

  }

}
