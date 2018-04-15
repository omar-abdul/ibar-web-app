import { Component, OnInit ,Input,AfterContentChecked} from '@angular/core';

@Component({
  selector: 'app-star',
  templateUrl: './star.component.html',
  styleUrls: ['./star.component.css']
})
export class StarComponent implements OnInit, AfterContentChecked {
  @Input()rating:number;
  @Input()itemId:number;
  @Input()inputWidth:number;
  @Input()inputHeight:number;
  @Input()inputFontSize:number;
  width:string;
  height:string;
  fontSize:string;
  inputName:string;
  percentRate:any;

  constructor() { }

  ngOnInit() {

    this.inputName = this.itemId + '_rating';
    this.width = this.inputWidth +"px"||"160px";
    this.height = this.inputHeight +"px"||"40px";
    this.fontSize = this.inputFontSize +"px"||"40px";
    



  }
  ngAfterContentChecked(){
        if(this.rating==null){
          this.rating = 0;
        }

    this.percentRate = this.rating +'%';
  }


}
