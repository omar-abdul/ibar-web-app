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

import { map } from "rxjs/operators";

import { CitySearchComponent } from "../city-search/city-search.component";
import * as sitewide from "../../constants";

@Component({
  selector: "app-editprofile",
  templateUrl: "./editprofile.component.html",
  styleUrls: ["./editprofile.component.css"]
})
export class EditprofileComponent implements OnInit, AfterViewInit {
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
   
    loadingService.onLoadingChanged.subscribe(
      isLoading => (this.isLoading = isLoading)
    );

    data.getAllSubjects().subscribe(data => {
      this.subjectArray = data["subjects"].slice(0, data["subjects"].length);
    });
  }

  @ViewChild(CitySearchComponent) child;

  public model: any;

  ngAfterViewInit() {}

  ngOnInit() {
    this.getUser().subscribe(_ => {
      this.cityName = this.user.city_name;

    });
  }

  @ViewChild("fileInput") fileInput;

  removePhoto(){
    this.authService.removeImage()
    .subscribe(async res=>{
      if(res['success']){
        this.updated = true;
        this.success = true;
        this.message = "Image deleted";
        this.imageurl = null;
        this.placeHolderImage(this.user)
        this.cdRef.detectChanges();
      }
      else{
        this.updated = true;
        this.success = false;
        this.message =
          "there was a problem uploading the image. Try again in a few minutes";
      }

    })
  }

  upload($event) {
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
    return this.authService.getProfile().pipe(map(async data => {

      if (data["success"]) {
        this.user = data["user"];
        if (this.authService.isMentor() && this.user.subjects.includes(null)) {
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
        this.router.navigate(["/login"]);
      }
    }));
  }

  placeHolderImage(user) {
    var temp = user.name.toString();
    var s = temp.split(" ");
    var index = 0;
    user.initial = "";

    user.initial = s[index].substr(0, 1);
    user.initial = user.initial.toUpperCase();
  }
}
