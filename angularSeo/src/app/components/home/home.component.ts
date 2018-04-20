import { PLATFORM_ID, Inject } from "@angular/core";
import { isPlatformBrowser } from "@angular/common";
import {
  Component,
  OnInit,
  ElementRef,
  NgZone,
  ViewChild
} from "@angular/core";
import { Observable } from "rxjs/Observable";
import { map } from "rxjs/operators";
import "rxjs/add/operator/debounceTime";
import "rxjs/add/operator/distinctUntilChanged";

import { FormControl, FormBuilder } from "@angular/forms";
import {} from "googlemaps";
import { MapsAPILoader } from "@agm/core";
import { DataService } from "../../services/data.service";
import { Router, ActivatedRoute } from "@angular/router";
import { HostListener } from "@angular/core";
import { DOCUMENT } from "@angular/platform-browser";
import { FormGroup } from "@angular/forms";
import * as sitewide from "../../constants";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"]
})
export class HomeComponent implements OnInit {
  public searchControl: FormControl;
  public changeStyle = false;
  check: boolean;
  public latitude: number;
  public longtitude: number;
  city: string;
  public slideLeft = false;
  public model: any;
  public searchForm: FormGroup;
  subjectArray:any[]=[];
  @ViewChild("search") public searchElementRef: ElementRef;
  @ViewChild("values") public valuesElementRef: ElementRef;

  constructor(
    @Inject(DOCUMENT) private document: Document,
    @Inject(PLATFORM_ID) private platformID: Object,
    private ngZone: NgZone,
    private mapsApiLoader: MapsAPILoader,
    private data: DataService,
    private router: Router,
    private fb: FormBuilder
  ) {
  
  }



  ngOnInit() {
    
    
    this.searchControl = new FormControl();
   
  }
  getCity($event){
    this.latitude = $event.lat;
    this.longtitude = $event.lng;
    this.city = $event.city;
 

  }
  getSubject($event){
    this.model = $event.name ||'';
  }

  onLocationSubmit() {

    this.data.changeLocation(
      this.latitude,
      this.longtitude,
      this.city,
      this.model
    );
    if (this.latitude === undefined || this.longtitude === undefined || this.latitude===null ||this.longtitude===null){
      return;
    } else {
      this.router.navigate(["/find-mentors",{lng:this.longtitude,lat:this.latitude,subject:this.model||''}]);
    }
  }
  @HostListener("window:scroll", [])
  onWindowscroll() {
    if (isPlatformBrowser(this.platformID)) {
      let number =
        window.pageYOffset ||
        document.documentElement.scrollTop ||
        document.body.scrollTop ||
        0;
      if (number > 150) {
        this.changeStyle = true;
      }
      if (number > 550) {
        this.slideLeft = true;
      }
    }
  }
}
