import { Component, OnInit,Input,ChangeDetectorRef,AfterViewInit,ViewChild } from '@angular/core';
import {CommentService} from '../../services/comment.service';
import {RateComponent} from "../rate/rate.component";
@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.css']
})
export class CommentsComponent implements OnInit{
  @Input()mentorID:number;
  comments:any[]=[];
  message:string;
  percentRate:number=0;
  isComment:boolean=false;
  @ViewChild(RateComponent)viewChild:RateComponent;

  constructor(private commentService:CommentService,private cdRef:ChangeDetectorRef) { }
  getComments(){
    this.comments=[];
    
     this.commentService.getAllComments(this.mentorID)
    .subscribe(data=>{
     
      if(data['success'] && data['comments'].length>0){
        
        this.isComment = true;
        
        this.comments= data['comments'].slice(0);

          for(let comment of this.comments){
            comment.created_at = new Date(comment.created_at).toDateString();
            comment.percentRate = Math.floor((comment.rate_number/5)*100);
           this.placeHolderImage(comment);

         }
         

      }else{
        
        this.message="";
        this.isComment = false;
        this.message = data['msg'];

      }
    })
  }
  placeHolderImage(comment) {

   
    if(comment.name){
      var temp = comment.name.toString();
      var s = temp.split(" ");
      var index = 0;
      comment.user_initial=""
  
      
        comment.user_initial = s[index].substr(0,1);
        comment.user_initial = comment.user_initial.toUpperCase();
  
    }

  }

  ngOnInit() {
   this.getComments();
  }

}
