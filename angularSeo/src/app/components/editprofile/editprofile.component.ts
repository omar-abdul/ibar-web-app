import {
  Component,
  OnInit,
  ViewChild,
  Input,
  NgZone,
  ElementRef,
  ChangeDetectorRef,
  AfterContentChecked
} from "@angular/core";
import { MentorService } from "../../services/mentor-service.service";
import { AuthService } from "../../services/auth.service";
import { ActivatedRoute, Router } from "@angular/router";
import { FormBuilder, FormGroup, FormArray } from "@angular/forms";
import { DomSanitizer, SafeUrl } from "@angular/platform-browser";
import {} from "googlemaps";
import { MapsAPILoader } from "@agm/core";
import { HttpClient } from "@angular/common/http";
import { PLATFORM_ID, Inject } from "@angular/core";
import { isPlatformBrowser } from "@angular/common";
import {LoadingService} from '../../services/loading.service'

import { Observable } from "rxjs/Observable";
import { map } from "rxjs/operators";
import "rxjs/add/operator/debounceTime";
import "rxjs/add/operator/distinctUntilChanged";
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

// import {CreateNewAutocompleteGroup, SelectedAutocompleteItem, NgAutocompleteComponent} from "ng-auto-complete";

@Component({
  selector: "app-editprofile",
  templateUrl: "./editprofile.component.html",
  styleUrls: ["./editprofile.component.css"]
})
export class EditprofileComponent implements OnInit, AfterContentChecked {
  id: string;
  user: any;
  isImage: boolean;
  showField: boolean;
  subjects: any[] = [];
  editForm: FormGroup;
  longtitude: number;
  latitude: number;
  cityName: any;
  updated: boolean = false;
  success: boolean;
  message: any;
  isLoading: boolean = false;
  imageurl: SafeUrl;


  constructor(
    private mentorService: MentorService,
    @Inject(PLATFORM_ID) private platformID: Object,
    private ngZone: NgZone,
    private mapsApiLoader: MapsAPILoader,
    public authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private cdRef: ChangeDetectorRef,
    private sanitizer: DomSanitizer,
    private http: HttpClient,
    private loadingService:LoadingService
  ) {
    this.createForm();
    loadingService.onLoadingChanged.subscribe(isLoading=>this.isLoading = isLoading);
  }
  createForm() {
    this.editForm = this.fb.group({
      phoneNumber: "",
      city: "",
      subject: ""
    });
    
  }

  @ViewChild("city") searchElementRef: ElementRef;
 

  // public group = [
  //       CreateNewAutocompleteGroup(
  //           'Enter Subject e.g English',
  //           'completer',
  //           [
  //               {title: 'English', id: "en"},
  //               {title: 'Physics', id: "phy"},
  //               {title: 'Biology', id: "bio"},

  //           ],
  //           {titleKey: 'title', childrenKey: null}
  //       ),
  //   ];
  public model: any;
  searchSub = (text$: Observable<string>) =>
    text$
      .debounceTime(200)
      .map(
        term =>
          term === ""
            ? []
            : subjects
                .filter(
                  v => v.toLowerCase().indexOf(term.toLowerCase()) > -1
                )
                .slice(0, 10)
      );

  // formatter = (x: { name: string }) => x.name;

  ngOnInit() {
    // if(this.authService.isMentor()){
    //   th
    // }
    //https://api.cloudinary.com/v1_1/${this.cloudinary.config().cloud_name}/upload
    this.getMentor().subscribe(_ => {
      // console.log(this.user.city_name)
      this.editForm.setValue({
        phoneNumber: this.user.phone_number || "",
        city: this.user.city_name|| "",
        subject: ""
 

      });
    });
    
    if(this.authService.isMentor() && this.authService.isVerified()){
      
      if (isPlatformBrowser(this.platformID)) {
        this.mapsApiLoader.load().then(() => {
          let cp: google.maps.places.ComponentRestrictions;
          cp = {
            country: ["so"]
          };
  
          let autocomplete = new google.maps.places.Autocomplete(
            this.searchElementRef.nativeElement,
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
              this.cityName = place.formatted_address;
            });
          });
        });
      }

    }

    
  }

  @ViewChild("fileInput") fileInput;

  upload() {
     

    let fileBrowser = this.fileInput.nativeElement;
    if (fileBrowser.files && fileBrowser.files[0] ) {
      if(!fileBrowser.files[0].type.match('image.*')){
        return;

      }
      const formData = new FormData();
      formData.append("image", fileBrowser.files[0]);
      this.authService.uploadImage(formData, this.user._id).subscribe(async res => {
           
        if (res["success"]) {
          var url = res["url"];
          // console.log(res)
          this.updated = true;
          this.success = false;
          this.message = "Image uploaded"

          this.imageurl =await this.sanitizer.bypassSecurityTrustUrl(url);

          this.cdRef.detectChanges();
        } else if(!res["success"]){
          this.updated = true;
          this.success = false;
          this.message = "there was a problem uploading the image. Try again in a few minutes"
          if(!this.user.img) this.placeHolderImage(this.user);


        }
      });
    }
  }

  getMentor() {
    // const id = this.route.snapshot.paramMap.get('id');
     
    return this.authService.getProfile().map(async data => {
      //console.log(data);

      if (data["success"]) {
        this.user = data["user"];
        var img = data["user"].imageurl;
        // this.subjects = data["user"].subjects.slice();
          

        if (img == null || img == undefined) {
          this.isImage = false;
          this.placeHolderImage(this.user);
        } else {
          this.isImage = true;
          var url = this.user.imageurl;
          this.imageurl = await this.sanitizer.bypassSecurityTrustUrl(url);
        }
      } else {
        this.router.navigate(["/error-page"]);
      }
    });
  }
  ngAfterContentChecked() {
    setTimeout(() => {
      this.updated = false;
    }, 3*10000);
  }
  placeHolderImage(user) {

    //console.log(mentor)
    var temp = user.name.toString();
    var s = temp.split(" ");
    var index = 0;
    user.initial=""

    
      user.initial = s[index].substr(0,1);
      user.initial = user.initial.toUpperCase();

  }
  requestMentor(user: any) {
    //console.log(user)
  }
  @ViewChild("avatar") avatar;
  @ViewChild("about") aboutRef: ElementRef;
  @ViewChild("phoneNumber") phoneNumberRef: ElementRef;

 

  updateUser() {
    // event.preventDefault();

    let updatedUser;

    if(this.authService.isMentor()){
      // var lng = this.user.location.coordinates[0];
      // var lat = this.user.location.coordinates[1];
      // var location = {
      //   type: "Point",
      //   coordinates: [this.longtitude||lng, this.latitude||lat]
      // };
      var location ={
        longtitude:this.longtitude ||this.user.lng,
        latitude:this.latitude ||this.user.lat
      }
      // console.log(location)
      updatedUser =  {
        name:this.user.name,
        imageurl:this.user.imageurl ||this.imageurl,
        about: this.aboutRef.nativeElement.value || this.user.about,
        city_name: this.cityName || this.user.city_name,
        location: location ,
        lng:this.longtitude ||this.user.lng,
        lat:this.latitude ||this.user.lat,

        phoneNumber:'+252'+ this.phoneNumberRef.nativeElement.value,
        subjects:  this.user.subjects
      };
    } else{
      updatedUser={
        name:this.user.name,
        phoneNumber:this.phoneNumberRef.nativeElement.value
      }

    }
    // console.log(updatedUser);
    this.authService.updateUser(updatedUser).subscribe(data => {
      //console.log(data)
      if (data["success"]) {
        this.updated = true;
        this.success = true;
        this.message = data["msg"];
          
      } else {
        this.updated = true;
        this.success = false;
        this.message = data["msg"];
        // console.log(data["msg"]);
      }

      this.cdRef.detectChanges();
    });
  }

  deleteSubject(subject: any) {
    this.user.subjects = this.remove(this.user.subjects, subject);
  }

  remove(array: any[], element: any) {
    for (var i = 0; i < array.length; i++) {
      if (array[i] == element) {
        array.splice(i, 1);
      }
    }
    return array;
  }

  onItemSelected(selected: any) {
    // this.addSubject(selected).then(()=>{
    //   this.user.subjects.push(selected);
    // });
    // this.cdRef.detectChanges();
  }

  checkSubject(subject: any) {
    var temp = {
      name: subject.name,
      code: subject.code
    };
    var isSub: boolean;
    //console.log(temp)
    //console.log(this.subjects)
    for (var i = 0; i < this.user.subjects.length; i++) {
      if (this.user.subjects[i] != subject) {
        isSub = false;
      } else {
        isSub = true;
        // console.log(temp.code + " " + this.user.subjects[i].code);
        break;
      }
    }

    return isSub;
  }

  Selected(item: any) {
    if(!this.user.subjects){
      var temp = item.item;
      var sub = {
        name: temp.name
      };
      // console.log(sub)
      this.user.subjects=[];

      this.user.subjects.push(temp);

    }

    else if (this.user.subjects &&!this.checkSubject(item.item)) {
     
      var temp = item.item;
      var sub = {
        name: temp.name
      };
      // console.log(sub)

      this.user.subjects.push(temp);
      // console.log(this.user.subjects)

      // else{return}
    }
  }
}
