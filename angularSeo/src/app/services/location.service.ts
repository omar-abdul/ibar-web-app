import { Injectable } from '@angular/core';
import {Response,URLSearchParams} from '@angular/http';

import {HttpClient,HttpHeaders,HttpParams} from '@angular/common/http'


@Injectable()
export class LocationService {

  constructor(private http:HttpClient) { }
  public url = "http://localhost:4000"
  getNearbyMentors(lng,lat,subject?:any|null){
       let header =new HttpHeaders();


   
    let params=new HttpParams().set('lng',lng).set('lat',lat);
    if(subject){
      params=params.append('subject',subject)
    }
    // params.append('lng',lng);
    // params.append('lat',lat);
    // params.append('subject',subject)
       return this.http.get(this.url+'/api/find-mentors',{params:params})
    .map(res =>{ return  res;});
  }

}
