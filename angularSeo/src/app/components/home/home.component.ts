import { PLATFORM_ID, Inject } from "@angular/core";
import { isPlatformBrowser } from "@angular/common";
import {
	Component,
	OnInit,
	ElementRef,
	NgZone,
	ViewChild
} from "@angular/core";
import {Observable} from 'rxjs/Observable';
import {map} from 'rxjs/operators';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';

import { FormControl ,FormBuilder} from "@angular/forms";
import {} from "googlemaps";
import { MapsAPILoader } from "@agm/core";
import { DataService } from "../../services/data.service";
import { Router, ActivatedRoute } from "@angular/router";
import { HostListener } from "@angular/core";
import { DOCUMENT } from "@angular/platform-browser";
import { FormGroup } from "@angular/forms";
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
	countryname: any;
	public slideLeft = false;
	public model:any;
	public searchForm:FormGroup;
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
	) {this.createForm();}
	createForm() {
		this.searchForm = this.fb.group({
		  city: "",
		  subject:""
		});
	  }
	
	searchSub= (text$:Observable<string>)=>
      text$
      .debounceTime(200)
      .map(term => term === '' ? []
		: subjects.filter(v => v.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10));
		
	

	ngOnInit() {
		this.searchControl = new FormControl();
		this.data.currentLat.subscribe(lat => (this.latitude = lat));
		this.data.currentLng.subscribe(lng => (this.longtitude = lng));
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

						if (
							place.geometry === null ||
							place.geometry === undefined
						) {
							return;
						}
						this.latitude = place.geometry.location.lat();
						this.longtitude = place.geometry.location.lng();
						this.countryname = place.formatted_address;
					});
				});
			});
		}
	}

	onLocationSubmit() {
		this.data.changeLocation(
			this.latitude,
			this.longtitude,
			this.countryname,
			this.model
		);
		if (this.latitude === 0 || this.longtitude === 0) {
			return;
		} else {
			this.router.navigate(["/find-mentors"]);
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
			if(number > 550){
				this.slideLeft = true;
			}
		}
	}



}
