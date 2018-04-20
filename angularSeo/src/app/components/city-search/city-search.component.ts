import { Component, OnInit,NgZone ,ViewChild, ElementRef, Input,Output,
  EventEmitter,OnChanges,SimpleChanges} from '@angular/core';
import { PLATFORM_ID, Inject } from "@angular/core";
import { isPlatformBrowser } from "@angular/common";
import {} from "googlemaps";
import { MapsAPILoader } from "@agm/core";
import {FormControl ,Validators} from "@angular/forms";
import {DataService} from "../../services/data.service";

@Component({
  selector: 'city-search',
  templateUrl: './city-search.component.html',
  styleUrls: ['./city-search.component.css']
})
export class CitySearchComponent implements OnInit,OnChanges {
  latitude:number;
  longtitude:number;
  cityName:string;
  city_name=new FormControl('',Validators.required)
 @Input() city:string;
 @ViewChild('search') searchElementRef:ElementRef
   
 @Output('cityEvent')notifyCity = new EventEmitter<any>();
  

  constructor(
    @Inject(PLATFORM_ID) private platformID: Object,
    private ngZone: NgZone,
    private mapsApiLoader: MapsAPILoader,
    private dataService:DataService
    
  ) { }



ngOnChanges(change:SimpleChanges){
  if(change['city']){
    this.city_name.setValue(this.city);

  }
}


  ngOnInit() {
    
    this.city_name.setValue(this.city);

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

            //share the data
             this.sendCity(this.latitude,this.longtitude,this.cityName);
          });
        });
      });
    }
  }

  sendCity(lat,lng,city){
    
    this.notifyCity.emit({lat,lng,city});

  }

}
