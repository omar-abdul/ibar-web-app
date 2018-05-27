import { Component, OnInit,Input ,ViewChild,EventEmitter,Output} from '@angular/core';
import {AuthService} from "../../services/auth.service";

import {CommentService} from "../../services/comment.service";
import { LoadingService } from '../../services/loading.service';


@Component({
  selector: 'app-rate',
  templateUrl: './rate.component.html',
  styleUrls: ['./rate.component.css']
})
export class RateComponent implements OnInit{
  public stars:number=0;
  public commentText:any;
  message:string='';
  submitted:boolean=true;
  @Input()mentor:any;
  @Output() newComment = new EventEmitter<any>()
  isLoading:boolean = false;
 


  constructor(private authService:AuthService,private commentService:CommentService, private ls:LoadingService) {
    this.ls.onLoadingChanged.subscribe(isLoading=> this.isLoading =isLoading);
   }
  comments:any[]=[];

  ngOnInit() {
    
  }

  ratingComponentClick($event){
    this.stars = $event.rating;
    console.log($event.rating);
    
  }
  submitComment(){

    const comment={
      mentor:this.mentor.id,
      stars:this.stars,
      text:this.commentText
    }
    if(this.stars===0){
      this.submitted =false;
      this.message = "Click on a star to rate";
      return ;
    }else{
      this.authService.addComment(comment)
      .subscribe(data=>{
        
        if(data['success']){
          this.submitted = true;
          this.message="Comment submitted"
          this.newComment.emit(comment);

  
        }
        else{
          this.submitted = false;
          this.message = "There was an error submitting the comment"
        }
      })
    }
    


  }

}
