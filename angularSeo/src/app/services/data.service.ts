import { Injectable } from '@angular/core';
// import {BehaviorSubject} from 'rxjs/BehaviorSubject';
// import {Observable} from 'rxjs/Observable';
import {Observable, BehaviorSubject, of} from 'rxjs'
import { HttpClient, HttpHeaders, HttpResponse } from "@angular/common/http";

import {map} from 'rxjs/operators'
import * as siteWide from "../constants";

@Injectable()
export class DataService {
	
	private latSource=new BehaviorSubject<number>(0);
	private lngSource=new BehaviorSubject<number>(0);
	private countryNameSource = new BehaviorSubject<any>("");
	private subSource = new BehaviorSubject<any>("");
	private tokenSource = new BehaviorSubject<boolean>(false);
	private emailSrc = new BehaviorSubject<string>("");
	private registeredSrc = new BehaviorSubject<boolean>(false);


	private subjectArray = new BehaviorSubject<string[]>([]);



	currentLat=this.latSource.asObservable();
	currentLng=this.lngSource.asObservable();
	currentCountry= this.countryNameSource.asObservable();
	currentSub = this.subSource.asObservable();
	currentToken = this.tokenSource.asObservable();
	currentSubArray = this.subjectArray.asObservable();
	currentEmail = this.emailSrc.asObservable();
	isRegistered = this.registeredSrc.asObservable();

	arr:any[];
  constructor(private http:HttpClient) { }
  private url = siteWide.constants.SERVER_URL;

  inputSubjectValues(subjects:any[]){
	  this.subjectArray.next(subjects);
  }
  changeEmail(email:string){
	  this.emailSrc.next(email);
  }
  getAllSubjects(){
	  return this.http.get(this.url+"/api/subjects")
	  .pipe(map(res=>{
		return res;
	}))


  }
  changeReg(isReg:boolean){
	  this.registeredSrc.next(isReg)
  }
 

  changeToken(token:boolean){
	  this.tokenSource.next(token)
  }

  changeLocation(lat:number,lng:number,name:any,sub:any){
  	this.latSource.next(lat);
  	this.lngSource.next(lng);
		this.countryNameSource.next(name);
		this.subSource.next(sub);
  }
  localArrayValues(){
  	var arr:Array<{name:string,code:string}>;
  	arr=[{name:"English", code:"en"},{name:"Phyiscs",code:"phy"}]
  	this.arr=[];
  	
  	this.arr.push(...arr);
  	return this.arr;

  }
  
  searchArrayForValue(term:string):Observable<any>{
  	
  	if(this.arr!==null && term!==null && term!==undefined){
  		console.log("serv"+term);
  		var searchField=this.arr.map(val=>val.name);
  		let results:any[];
  		results=this.arr.filter((val)=>val.name.toLocaleLowerCase()
  			.indexOf(term.toLocaleLowerCase())>-1);

  		return Observable.create(observer=>{
  			observer.next(results);
  			observer.complete();
  		})
			
  			

  		}
			

  		}

		 
  	}
  




