"use strict";

import {
  Component,
  OnInit,
  ViewChild,
  NgZone,
  ElementRef,
  AfterViewChecked
} from "@angular/core";
import {Observable} from 'rxjs/Observable';
import {map} from 'rxjs/operators';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';


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
    this.createForm();
    ls.onLoadingChanged.subscribe(isLoading=>this.isLoading=isLoading);

        data.getAllSubjects().subscribe(data=>{
          this.subjectArray = data['subjects'].slice(0,data['subjects'].length);
    
        })

  }

  createForm() {
    this.searchForm = this.fb.group({
      city: "",
      subject:""
    });
  }

formatter=(result:any)=>result.name;

   searchSub= (text$:Observable<string>)=>
      text$
      .debounceTime(200)
      .map(term => term === '' ? []
        : this.subjectArray
        .filter(v => v.name.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10));
   

  ngAfterViewChecked() {

    if (this.searchRef.nativeElement.value == "") {
      this.latitude = 0;
      this.longtitude = 0;
    }
  }

  ngOnInit() {
    this.items = [];

    this.returnUrl = this.route.snapshot.queryParams["returnUrl"] || "/";
    if (this.authService.isMentor()) {
      this.router.navigate([this.returnUrl]);
    }

    this.data.currentCountry.subscribe(country => {
      this.searchForm.controls['city'].setValue(country)
      this.country = country;
    });

    this.data.currentLat.subscribe(lat => (this.latitude = lat));
    this.data.currentLng.subscribe(lng => (this.longtitude = lng));
    this.data.currentSub.subscribe(sub=>(this.model = sub));
    if (this.longtitude != undefined && this.latitude != undefined) {
      this.getCloseMentors().subscribe(async _ => {

      });
    }
    this.mapsApiLoader.load().then(() => {
      let cp: google.maps.places.ComponentRestrictions;
      cp = {
        country: ["so"]
      };

      let autocomplete = new google.maps.places.Autocomplete(
        this.searchRef.nativeElement,
        {
          types: ["(regions)"],
          strictBounds: true,
          componentRestrictions: cp
        }
      );

      autocomplete.addListener("place_changed", () => {
        this.ngZone.run(() => {
          let place: google.maps.places.PlaceResult = autocomplete.getPlace();

          if (place.geometry === null || place.geometry === undefined) {
            return;
          }
          this.latitude = place.geometry.location.lat();
          this.longtitude = place.geometry.location.lng();
        });
      });
    });
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
  joinText(arr:string[]){
    let string = arr.join(",")
    return this.getExcerpt(string);

  }

  getCloseMentors(){

    this.mentors = [];
    return this.locationservice
    .getNearbyMentors(this.longtitude, this.latitude,this.model)
    .map(data => {

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
             mentor.stars =4;
           };

        });
        
      }
      else{console.log(data['res'])}
    });

  }


  findMentors() {

    if (this.latitude !== 0 && this.longtitude !== 0) {


      this.getCloseMentors().subscribe(async _ => {
        
      });
    }
  }


  public message:any;
  public showNumber:boolean=false;
  requestMentor(mentor: any) {

    return this.authService.registerJob(mentor).subscribe(data=>{
      if(data['success']){
        this.showNumber = true;
        this.mentorService.sendBoolean(this.showNumber)
        this.mentorService.sendNumber(mentor.phone_number);
        this.message = mentor.phone_number;
      }
      else{
        this.showNumber = true;
        this.message = data['msg']
      }
    })
}
  viewMentor(mentorId: any) {
    if (mentorId) {
      this.router.navigate(["/mentor", mentorId]);
    }
  }
  ratingComponetClick(clickObj: any): void {

  }
  insertRate(mentor){
    this.commentService.getRate(mentor.id)
    .subscribe(data=>{
      if(data['success']){
        mentor.currentRate = data['rate']
      }
      else{
        mentor.currentRate = 0;
      }
      
    })
  }

}
