import {
  Component,
  OnInit,
  ViewChild,
  Input,
  NgZone,
  ElementRef,
  ChangeDetectorRef,
  AfterViewInit
} from "@angular/core";
import { MentorService } from "../../services/mentor-service.service";
import { AuthService } from "../../services/auth.service";
import { ActivatedRoute, Router } from "@angular/router";
import { FormBuilder, FormGroup, FormArray } from "@angular/forms";
import { DomSanitizer, SafeUrl } from "@angular/platform-browser";
import {} from "googlemaps";
import { MapsAPILoader } from "@agm/core";

import { PLATFORM_ID, Inject } from "@angular/core";
import { isPlatformBrowser } from "@angular/common";
import { LoadingService } from "../../services/loading.service";
import { DataService } from "../../services/data.service";

import { Observable } from "rxjs/Observable";
import { map } from "rxjs/operators";
import "rxjs/add/observable/interval";
import "rxjs/add/operator/takeWhile";
import "rxjs/add/operator/debounceTime";
import "rxjs/add/operator/distinctUntilChanged";
import {CitySearchComponent} from "../city-search/city-search.component"
import * as sitewide from "../../constants";

// import {CreateNewAutocompleteGroup, SelectedAutocompleteItem, NgAutocompleteComponent} from "ng-auto-complete";

@Component({
  selector: "app-editprofile",
  templateUrl: "./editprofile.component.html",
  styleUrls: ["./editprofile.component.css"]
})
export class EditprofileComponent implements OnInit ,AfterViewInit{
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
  subjectArray: any[] = [];

  constructor(
    private mentorService: MentorService,

    public authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private cdRef: ChangeDetectorRef,
    private sanitizer: DomSanitizer,

    private loadingService: LoadingService,
    private data: DataService
  ) {
    this.createForm();
    loadingService.onLoadingChanged.subscribe(
      isLoading => (this.isLoading = isLoading)
    );

    data.getAllSubjects().subscribe(data => {
      this.subjectArray = data["subjects"].slice(0, data["subjects"].length);
    });
  }
  createForm() {
    this.editForm = this.fb.group({
      phoneNumber: "",
 
      
    });
  }
@ViewChild(CitySearchComponent) child;
  

  public model: any;


      ngAfterViewInit(){
        this.getUser().subscribe(_ => {
          
    
          this.cityName = this.user.city_name;
         
         
          
          this.editForm.setValue({
            phoneNumber: this.user.phone_number || "",
    
            
          });
        });

      }

  ngOnInit() {


  }

  @ViewChild("fileInput") fileInput;

  upload() {
    let fileBrowser = this.fileInput.nativeElement;
    if (fileBrowser.files && fileBrowser.files[0]) {
      if (!fileBrowser.files[0].type.match("image.*")) {
        return;
      }
      const formData = new FormData();
      formData.append("image", fileBrowser.files[0]);
      this.authService.uploadImage(formData).subscribe(async res => {
        if (res["success"]) {
          var url = res["url"];
          // console.log(res)
          this.updated = true;
          this.success = true;
          this.message = "Image uploaded";

          this.imageurl = await this.sanitizer.bypassSecurityTrustUrl(url);

          this.cdRef.detectChanges();
        } else if (!res["success"]) {
          this.updated = true;
          this.success = false;
          this.message =
            "there was a problem uploading the image. Try again in a few minutes";
          if (!this.user.img) this.placeHolderImage(this.user);
        }
      });
    }
  }

  getUser() {
    return this.authService.getProfile().map(async (data) => {
      //console.log(data);

      if (data["success"]) {
        this.user = data["user"];
        if(this.authService.isMentor() && this.user.subjects.includes(null)){
          this.user.subjects = [];
        }

        var img = data["user"].imageurl;


        if (img == null || img == undefined) {
          this.isImage = false;
          this.placeHolderImage(this.user);
        } else {
          this.isImage = true;
          var url = this.user.imageurl;
          this.imageurl = await this.sanitizer.bypassSecurityTrustUrl(url);
        }
      } else {
        this.router.navigate(['/login']);
      }
    });
  }

  getCity($event){
    this.cityName = $event.city;
    this.latitude = $event.lat;
    this.longtitude = $event.lng;
  }

  placeHolderImage(user) {
    //console.log(mentor)
    var temp = user.name.toString();
    var s = temp.split(" ");
    var index = 0;
    user.initial = "";

    user.initial = s[index].substr(0, 1);
    user.initial = user.initial.toUpperCase();
  }

  @ViewChild("avatar") avatar;
  @ViewChild("about") aboutRef: ElementRef;
  @ViewChild("phoneNumber") phoneNumberRef: ElementRef;

  updateUser() {
    // event.preventDefault();

    let updatedUser;

    if (this.authService.isMentor()) {
      var location = {
        longtitude: this.longtitude || this.user.lng,
        latitude: this.latitude || this.user.lat
      };

      updatedUser = {
        // name:this.user.name,
        imageurl: this.user.imageurl || this.imageurl,
        about: this.aboutRef.nativeElement.value || this.user.about,
        city_name: this.cityName || this.user.city_name,
        location: location,
        lng: this.longtitude || this.user.lng,
        lat: this.latitude || this.user.lat,

        phoneNumber: "+252" + this.phoneNumberRef.nativeElement.value,
        subjects: this.user.subjects
      };
    } else {
      updatedUser = {
        // name:this.user.name,
        phoneNumber: this.phoneNumberRef.nativeElement.value
      };
    }
    // console.log(updatedUser);
    this.authService.updateUser(updatedUser).subscribe(data => {
      this.updated = true;
      //console.log(data)
      if (data["success"]) {
        this.flashMessage();
        this.success = true;
        this.message = data["msg"];
      } else {
        this.flashMessage();
        this.success = false;
        this.message = "";
        if (data["msg"] instanceof Array) {
          data["msg"].forEach(e => (this.message += e.msg + " \n"));
        } else {
          this.message += data["msg"];
        }
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

  checkSubject(subject: any) {
    // var temp = {
    //   name: subject.name,
    //   code: subject.code
    // };
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
  getSubject($event){
    if(Array.isArray(this.user.subjects)&&!this.user.subjects.length){
      this.user.subjects =[];
      this.user.subjects.push($event.name);

    }else if(this.user.subjects && !this.checkSubject($event.name)){
      this.user.subjects.push($event.name);
    }
  }

  Selected(item: any) {
    if (!this.user.subjects) {
      var temp = item.item;
      var sub = {
        name: temp.name
      };
      // console.log(sub)
      this.user.subjects = [];

      this.user.subjects.push(temp.name);
    } else if (this.user.subjects && !this.checkSubject(item.item)) {
      var temp = item.item;
      var sub = {
        name: temp.name
      };
      // console.log(sub)

      this.user.subjects.push(temp.name);
      // console.log(this.user.subjects)

      // else{return}
    }
  }
  flashMessage() {
    Observable.interval(10000).subscribe(i => {
      this.updated = false;
    });
  }
}
