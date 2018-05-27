import { Component, OnInit } from '@angular/core';
import {AuthService} from './services/auth.service';
import { DataService } from './services/data.service';
import { LoadingService } from './services/loading.service';




@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  isLoading:boolean =false;

  constructor(private ldService:LoadingService){
  }
  ngOnInit(){
    
    this.ldService.onLoadingChanged.subscribe(isLoading=>this.isLoading = isLoading);
  

  }

  
}
