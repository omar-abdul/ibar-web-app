import { Injectable } from '@angular/core';

import {Subject} from 'rxjs/Subject';


@Injectable()
export class MentorService {

	private showSource = new Subject<boolean>();
	private numberSource = new Subject<string>();

	show$  = this.showSource.asObservable();
	phoneNumber = this.numberSource.asObservable();


  constructor() { }

  	sendBoolean(show:boolean){
  		this.showSource.next(show);

  }
  sendNumber(num:string){
	  this.numberSource.next(num)
  }

}
