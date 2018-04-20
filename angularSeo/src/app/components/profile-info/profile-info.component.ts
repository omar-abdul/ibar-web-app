import { Component, OnInit, Input, } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'profile-info',
  templateUrl: './profile-info.component.html',
  styleUrls: ['./profile-info.component.css']
})
export class ProfileInfoComponent implements OnInit {
  @Input('user') user:object

  constructor(public authService:AuthService) { }

  ngOnInit() {
  }

}
