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
import {LoadingService} from '../../services/loading.service'
// import "rxjs/add/operator/map";
// import {CreateNewAutocompleteGroup, SelectedAutocompleteItem, NgAutocompleteComponent} from "ng-auto-complete";

const subjects = 
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

  

  @ViewChild("search") public searchRef: ElementRef;
  // @ViewChild("subject") public subjectRef: ElementRef;
  // @ViewChild(NgAutocompleteComponent) public completer: NgAutocompleteComponent;

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
    private ls:LoadingService
  ) {
    this.createForm();
    ls.onLoadingChanged.subscribe(isLoading=>this.isLoading=isLoading);
  }

  createForm() {
    this.searchForm = this.fb.group({
      city: "",
      subject:""
    });
  }


   // public group = [
   //      CreateNewAutocompleteGroup(
   //          'Enter Subject e.g English',
   //          'completer',
   //          [
   //              {title: 'English', id: "en"},
   //              {title: 'Physics', id: "phy"},
   //              {title: 'Biology', id: "bio"},



   //          ],
   //          {titleKey: 'title', childrenKey: null}
   //      ),
   //  ];
  

   searchSub= (text$:Observable<string>)=>
      text$
      .debounceTime(200)
      .map(term => term === '' ? []
        : subjects.filter(v => v.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10));
   


 

  getMentors() {

    this.mentors = [];

    return this.locationservice
      .getNearbyMentors(this.longtitude, this.latitude,this.model)
      .map(data => {
 
        if (data) {
          data["results"].forEach((i, index, array) => {
            // ////console.log(array.length);

            array.forEach((j, index) => {
              // ////console.log(j);
              this.mentors.push(...j);
            });
          });
        }
      });
  }
  ngAfterViewChecked() {

    if (this.searchRef.nativeElement.value == "") {
      this.latitude = 0;
      this.longtitude = 0;
    }
  }

  ngOnInit() {

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
        for(let i of this.mentors) {
          // ////console.log(i.img.path)
          var img=i.img;
          
          if (img==null ||img==undefined) {
  
            this.isImage = false;

            this.placeHolderImage(i);
            ////console.log(i.img);

          // var id = i.img.path;

          //   this.authService.getProfilePic(id).subscribe((data) => {

              
          //     this.createImageFromBlob(data, i);
          //   });

          //  i.imageurl = this.sanitizer.bypassSecurityTrustUrl(url)  
                 
          } else{
            
            this.isImage = true;
            var url =  img;
           
           i.imageurl = await this.getImage(url);

          }
        };
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

  getCloseMentors(){

    this.mentors = [];
    return this.locationservice
    .getNearbyMentors(this.longtitude, this.latitude,this.model)
    .map(data => {

      if (data['success']) {
        data["res"].forEach((i, index, array) => {
          // ////console.log(array.length);
          this.mentors.push(i);
          //console.log(i);


        });
      }
    });

  }

  // public onItemSelected(selected: any) {
  //   // ////console.log("selected: ", selected.code);
  //   this.code = selected.code;

  // }
  findMentors() {

    if (this.latitude !== 0 && this.longtitude !== 0) {
      // this.latitude=8.475987000000002;
      // this.longtitude=47.365760300000034;
      let reader = new FileReader();
      this.getCloseMentors().subscribe(async _ => {

        for(let i of this.mentors) {
          // ////console.log(i.img.path)
          var img= await i.imageurl;
          
          if (img==null ||img==undefined) {
  
            this.isImage = false;

            this.placeHolderImage(i);
            ////console.log(i.img);

          // var id = i.img.path;

          //   this.authService.getProfilePic(id).subscribe((data) => {

              
          //     this.createImageFromBlob(data, i);
          //   });

          //  i.imageurl = this.sanitizer.bypassSecurityTrustUrl(url)  
                 
          } else{

            this.isImage = true;
            var url =  img;
           
            i.imageurl=await this.getImage(url);

          }
        };
      });
    }
  }

  createImageFromBlob(image: Blob, mentor: any) {
    

    let reader = new FileReader();
    reader.addEventListener(
      "load",
      () => {
        mentor.url = reader.result;
      },
      false
    );
    if (image) {
      reader.readAsDataURL(image);
    }
  }
  public message:any;
  public showNumber:boolean=false;
  requestMentor(mentor: any) {
    // ////console.log(mentor._id);
    // ////console.log(mentor);
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






    //   Selected(item: SelectedAutocompleteItem) {
    //     this.searchForm.controls['subject'] = this.fb.array([...this.searchForm.controls['subject']
    //       .value, item.item.original]);
        
    //     ////console.log(item.item.id);
    //     this.code = item.item.id
    // }
}
