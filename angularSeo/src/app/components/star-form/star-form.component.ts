import { Component, OnInit, Input ,Output ,EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup,FormControl } from "@angular/forms";

@Component({
  selector: 'app-star-form',
  templateUrl: './star-form.component.html',
  styleUrls: ['./star-form.component.css']
})
export class StarFormComponent implements OnInit {
  @Input()rating:number;
  @Input()itemId:number;
  @Input()readOnly:boolean;
  @Output()ratingClick:EventEmitter<any>=new EventEmitter<any>();
  disabled:boolean=true;
  inputName:string;
  


  constructor() {
    
   }


  ngOnInit() {
    this.inputName = this.itemId+"_rating";
    
   
    
}
onClick(rating:number):void{
    this.rating = rating;
    this.ratingClick.emit({
        itemId: this.itemId,
        rating: rating
    });
}
isDisabled():boolean{
  return this.disabled;
}

}
