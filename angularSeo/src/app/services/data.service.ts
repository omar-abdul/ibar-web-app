import { Injectable } from '@angular/core';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Observable} from 'rxjs/Observable';


import {map} from 'rxjs/operators'
import {of} from 'rxjs/observable/of';

@Injectable()
export class DataService {
	
	private latSource=new BehaviorSubject<number>(0);
	private lngSource=new BehaviorSubject<number>(0);
	private countryNameSource = new BehaviorSubject<any>("");
	private subSource = new BehaviorSubject<any>("");
	private tokenSource = new BehaviorSubject<boolean>(false);



	currentLat=this.latSource.asObservable();
	currentLng=this.lngSource.asObservable();
	currentCountry= this.countryNameSource.asObservable();
	currentSub = this.subSource.asObservable();
	currentToken = this.tokenSource.asObservable();
	arr:any[];
  constructor() { }
 

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
  




