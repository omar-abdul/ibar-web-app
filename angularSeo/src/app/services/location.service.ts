import { Injectable } from '@angular/core';
import {Response,URLSearchParams} from '@angular/http';

import {HttpClient,HttpHeaders,HttpParams} from '@angular/common/http'

import * as siteWide from '../constants';


@Injectable()
export class LocationService {

  constructor(private http:HttpClient) { }
  public url =siteWide.constants.SERVER_URL;
  getNearbyMentors(lng,lat,subject?:any|null){
       let header =new HttpHeaders();


   
    let params=new HttpParams().set('lng',lng).set('lat',lat);
    if(subject){
      params=params.append('subject',subject.name)
    }

       return this.http.get(this.url+'/api/find-mentors',{params:params})
    .map(res =>{ return  res;});
  }

}
