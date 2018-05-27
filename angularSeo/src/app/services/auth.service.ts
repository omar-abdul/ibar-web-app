import { Injectable, PLATFORM_ID, Inject } from "@angular/core";
import { Observable , EMPTY} from "rxjs";
import { isPlatformBrowser } from "@angular/common";
import * as siteWide from "../constants";

// import {RequestOptions,Response,} from '@angular/http';
import { HttpClient, HttpHeaders, HttpResponse } from "@angular/common/http";
// import { tokenNotExpired } from "angular2-jwt";
import { map, filter } from "rxjs/operators";
import * as jwt_decode from "jwt-decode";

@Injectable()
export class AuthService {
	authToken: any;
	user: any;
	refreshToken:any;

	constructor(
		@Inject(PLATFORM_ID) private platformId: Object,
		private http: HttpClient
	) {}
	public url = siteWide.constants.SERVER_URL;
	getDecodedAccessToken(token: string) {
		try {
			return jwt_decode(token);
		} catch (Error) {
			return null;
		}
	}

	registerUser(user) {
		let header = new HttpHeaders().set("Content-Type", "application/json");

		return this.http
			.post(this.url + "/api/register", user, { headers: header })
			.pipe(map(res => {
				return res;
			}));
	}

	authenticate(user) {
		let header = new HttpHeaders().set("Content-Type", "application/json");
		return this.http
			.post(this.url + "/api/authenticate", user, { headers: header})
			.pipe(map(res => {
				return res;
			}));
	}
	authenticateStudent(user) {
		let header = new HttpHeaders().set("Content-type", "application/json");
		return this.http
			.post(this.url + "/api/authenticate-student", user, { headers: header })
			.pipe(map(res => {
				return res;
			}));
	}
	addComment(comment){
		
		this.loadToken();
		let header = new HttpHeaders({
			Authorization: this.authToken,
			"Content-Type": "application/json"
		});
		return this.http.post(this.url+"/api/add-comment",comment,{headers:header})
		.pipe(map(res => {
			return res;
		}));
	}
	getProfile() {
		this.loadToken();

		let header = new HttpHeaders({
			Authorization: this.authToken,
			"Content-Type": "application/json"
		});

		return this.http
			.get(this.url + "/api/profile", { headers: header ,withCredentials:true})
			.pipe(map(res => {
				return res;
			}));
	}
	storeUserData(token, user,refresh_token) {
		if (isPlatformBrowser(this.platformId)) {
			localStorage.setItem("id_token", token);
			localStorage.setItem("user", JSON.stringify(user));
			localStorage.setItem("refresh_token",refresh_token);
		}

		this.authToken = token;
		this.user = user;
	}

	public loading = false;

	uploadImage(formData: any) {
		this.loadToken();
		let headers = new HttpHeaders()
			// .delete("Content-Type")
			.set("Authorization", this.authToken);

		return this.http
			.put(this.url + "/api/update/image", formData, { headers: headers })
			.pipe(map(res => {
				return res;
			}));
	}
	updateUser(user: any) {
		this.loadToken();
		let headers = new HttpHeaders()
			.set("Content-Type", "application/json")
			.set("Authorization", this.authToken);

		return this.http
			.put(this.url + "/api/update", user, { headers: headers })
			.pipe(map(res => {
				return res;
			}));
	}
	getProfilePic(id): Observable<Blob> {
		// let header= new HttpHeaders().set('responseType','blob');

		return this.http.get(`/api/${id}`, { responseType: "blob" })
		.pipe(map(res => {
			return res;
		}));
	}

	isMentor(): boolean {
		if (this.loggedIn()) {
			const token = localStorage.getItem("id_token");
			let decoded = this.getDecodedAccessToken(token);

			if (decoded.data.role == "mentors") {
				return true;
			}
		}

		return false;
	}


	getMentorDetail(id) {
		return this.http.get(this.url + `/api/mentor/${id}`)
		.pipe(map(res => {
			return res;
		}));
	}

	getJobHistory() {
		this.loadToken();

		let header = new HttpHeaders({
			Authorization: this.authToken,
			"Content-Type": "application/json"
		});
		return this.http
			.get(this.url + "/api/history", { headers: header })
			.pipe(map(res => {
				return res;
			}));
	}

	getAllHistory() {
		this.loadToken();
		let header = new HttpHeaders({
			Authorization: this.authToken,
			"Content-Type": "application/json"
		});
		return this.http
			.get(this.url + "/api/history", { headers: header })
			.pipe(map(res => {
				return res;
			}));
	}

	getSubjects(type: any) {
		return this.http.get(this.url + `/api/subject/${type}`)
		.pipe(map(res => {
			return res;
		}));
	}

	registerJob(mentor) {
		this.loadToken();

		let header = new HttpHeaders({
			Authorization: this.authToken,
			"Content-Type": "application/json"
		});
		return this.http
			.post(this.url + `/api/hire`, mentor, { headers: header })
			.pipe(map(res => {
				return res;
			}));
	}

	resetPassword(email) {
		var e = {
			email: email
		};
		let header = new HttpHeaders({
			"Content-Type": "application/json"
		});
		//console.log(email)
		return this.http
			.post(this.url + "/api/forgot-password", e, { headers: header })
			.pipe(map(res => {
				return res;
			}));
	}

	updatePassword(user) {
		this.loadToken();

		let header = new HttpHeaders({
			Authorization: this.authToken,
			"Content-Type": "application/json"
		});
		return this.http
			.post(this.url + "/api/update-password", user, { headers: header })
			.pipe(map(res => {
				return res;
			}));
	}
	confirmToken(token) {
		let header = new HttpHeaders({
			"Content-Type": "application/json"
		});
		return this.http
			.post(this.url + "/api/account/password-reset", token, {
				headers: header
			})
			.pipe(map(res => {
				return res;
			}));
	}

	resendToken(user){
	
		
		let header = new HttpHeaders({
			"Content-Type":"application/json"
		})
		return this.http
		.post(this.url +"/api/resend-token",user,{
			headers:header
		})
		.pipe(map(res => {
			return res;
		}));
	}
	removeImage(){
		this.loadToken();
		console.log(this.authToken);
		let header = new HttpHeaders({
			"Authorization" : this.authToken
		})
		return this.http.delete(this.url+"/api/delete/image",{headers:header})
		.pipe(map(res => {
			return res;
		}));
	}


	getrefreshToken():Observable<LoggedUser>{
		this.loadToken()
		if(this.authToken!==null && this.refreshToken!==null){
			let headers = new HttpHeaders({
				'Authorization':this.authToken,
				"Content-type":'application/json',
				"X-Refresh-Token":this.refreshToken
			})
			console.log("this executed")
	
	
				return this.http.get<LoggedUser>(this.url+"/api/refresh-token",{headers:headers}) 

		}
		return  EMPTY;


	}

	tokenNotExpired():boolean{
		const token =localStorage.getItem("id_token");
		
		
		if(token == undefined || token == null){
			return false;
		}
		
		const jwt = this.getDecodedAccessToken(token);
			if(jwt===null){
				return false;
			}
			const current = Date.now().valueOf()/1000;
			if(jwt.exp < current){
				return false;
			}
			return true;
		

		

	}
loadToken() {
	const token = localStorage.getItem("id_token");
	this.authToken = token;
	const user = localStorage.getItem("user");
	this.user = JSON.parse(user);
	const refreshTk = localStorage.getItem('refresh_token');
	this.refreshToken= refreshTk;
}
loggedIn() {
	if (isPlatformBrowser(this.platformId)) {
		this.loadToken();
		
			if(this.tokenNotExpired()){
				return true;
			}
			else if(!this.tokenNotExpired()){
				return this.refreshToken!==null;
			}
			else{
				return false;
			}
		
		
		
		
	
	}
}
logOut() {

	this.loadToken()
	let headers = new HttpHeaders({
		'Authorization':this.authToken,
		"Content-type":'application/json',
		"X-Refresh-Token":this.refreshToken
	})
		return this.http.get(this.url+"/api/logout",{headers:headers}) 
		.pipe(map(res => {
			return res;
		}));
}
clearStorage(){
	this.authToken = null;
	this.user=null;
	this.refreshToken=null;
	localStorage.clear()
	
}

}

export interface LoggedUser{
	user:{
		id:string,
		name:string,
		phone_number:string,
		email:string
	}
	token:string;
	success:boolean;
	refresh_token:string

}