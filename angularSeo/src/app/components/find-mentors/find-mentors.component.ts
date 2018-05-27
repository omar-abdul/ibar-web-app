"use strict";

import {
  Component,
  OnInit,
  ViewChild,
  NgZone,
  ElementRef,
  AfterViewChecked
} from "@angular/core";

import {map} from 'rxjs/operators';



import { DataService } from "../../services/data.service";
import { MentorService } from "../../services/mentor-service.service";
import { Router, ActivatedRoute } from "@angular/router";
import { LocationService } from "../../services/location.service";
import { AuthService } from "../../services/auth.service";
import { DomSanitizer, SafeUrl } from "@angular/platform-browser";
import { FormBuilder, FormGroup,FormArray } from "@angular/forms";
import {} from "googlemaps";
import { MapsAPILoader } from "@agm/core";
import {LoadingService} from '../../services/loading.service';
import {StarFormComponent} from '../star-form/star-form.component' ;
import {CommentService} from "../../services/comment.service";
import * as sitewide from "../../constants";



@Component({
  selector: "app-find-mentors",
  templateUrl: "./find-mentors.component.html",
  styleUrls: ["./find-mentors.component.css"]
})
export class FindMentorsComponent implements OnInit, AfterViewChecked {
  latitude: number;
  longtitude: number;
  name: string;
  email: string;
  mentors: Array<any>;
  url: any;
  imageurl: SafeUrl;
  searchForm: FormGroup;
  code: any;
  country: any;
  returnUrl: string;
  isImage:boolean;
  initial: any[] = [];
  isLoading = false;
  private showFooter = false;
   public model:any;
   public items:any[];
   public percentRate = 0;
   subjectArray:any[]=[];
   subModel:string
  

  

  @ViewChild("search") public searchRef: ElementRef;

  constructor(
    private data: DataService,
    private router: Router,
    private route: ActivatedRoute,
    private locationservice: LocationService,
    private sanitizer: DomSanitizer,
    public authService: AuthService,
    private ngZone: NgZone,
    private mapsApiLoader: MapsAPILoader,
    private fb: FormBuilder,
    private mentorService: MentorService,
    private ls:LoadingService,
    private commentService:CommentService
  ) {
  
    ls.onLoadingChanged.subscribe(isLoading=>this.isLoading=isLoading);

    route.params.subscribe(params=>{
      if(params['lng'] && params['lat']){
        this.model={
          name:params['subject']
        }
      
       const lat = params['lat']||this.latitude
       const lng = params['lng']||this.longtitude
       const sub = params['subject']||''
        this.getCloseMentors(lng,lat,sub).subscribe(_=>{

        })
      }
    })

  }




   

  ngAfterViewChecked() {

  }

  ngOnInit() {
    this.items = [];
    if(this.country ===''){
      this.latitude = 0;
      this.longtitude = 0;
      return ;
    }



    this.returnUrl = this.route.snapshot.queryParams["returnUrl"] || "/";
    if (this.authService.isMentor()) {
      this.router.navigate([this.returnUrl]);
    }

    this.data.currentCountry.subscribe(country => {
      
      this.country = country;
    });

    this.data.currentLat.subscribe(lat => (this.latitude = lat));
    this.data.currentLng.subscribe(lng => (this.longtitude = lng));
    // this.data.currentSub.subscribe(sub=>{
     
    //     this.model ={
    //       name:sub
    //     } 
    //     console.log(this.model+'Observake')
   
    // });
    // if (this.longtitude != undefined && this.latitude != undefined) {
    //   this.getCloseMentors().subscribe(async _ => {

    //   });
    // }

  }

  getCity($event){
    this.latitude = $event.lat;
    this.longtitude = $event.lng;
    this.country = $event.city || ''
  }

  getSubject($event){
    
    this.model ={
      name: $event.name ||''
    }
  
  }
  getExcerpt(sentence:string){
    
    if(sentence && sentence.length>22){
     return  sentence = sentence.substr(0,22)+'...';
     
    }
    else{return sentence}
  }
  async getImage(url){

    let imageurl = await this.sanitizer.bypassSecurityTrustUrl(url) 
    return imageurl
  }
  placeHolderImage(user) {

    ////console.log(mentor)
    var temp = user.name.toString();
    var s = temp.split(" ");
    var index = 0;
    user.initial=""

    
      user.initial = s[index].substr(0,1);
      user.initial = user.initial.toUpperCase();

  }
  joinText(subs:any){
    let string
    if(Array.isArray(subs)){
      string = subs.join(",")
    }else string = subs


    
    return this.getExcerpt(string);

  }

  getCloseMentors(lng,lat,subject){
    // if(this.longtitude ===null ||  this.longtitude ==undefined ||this.latitude===null ||this.longtitude==undefined){
    //   return;
    // }

    this.mentors = [];
    return this.locationservice
    .getNearbyMentors(lng, lat,subject)
    .pipe(map(data => {

      if (data['success']) {
        data["res"].forEach(async (i, index, array) => {

          this.mentors.push(i);
          for(let mentor of this.mentors) {
           
            
           
            mentor.about = this.getExcerpt(mentor.about);
            mentor.subjects = this.joinText(mentor.subjects);
   
             var img= await mentor.imageurl;
             
             if (img==null ||img==undefined) {
     
               this.isImage = false;
   
               this.placeHolderImage(mentor);
                    
             } else{
   
               this.isImage = true;
               var url =  img;
              
               mentor.imageurl=await this.getImage(url);
   
             }
            
           };

        });
        
      }
      // else{console.log(data['res'])}
    }));

  }


  findMentors() {
    this.router.navigate(['find-mentors',{lng:this.longtitude,lat:this.latitude,subject:this.model.name||''}]);
  }



  viewMentor(mentorId: any) {
    if (mentorId) {
      this.router.navigate(["/mentor", mentorId]);
    }
  }


}
