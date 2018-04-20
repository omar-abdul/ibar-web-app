import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'subject-card',
  templateUrl: './subject-card.component.html',
  styleUrls: ['./subject-card.component.css']
})
export class SubjectCardComponent implements OnInit {
  @Input() subject:string

  constructor() { }

  ngOnInit() {
  }

}
