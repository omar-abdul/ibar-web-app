import { Injectable,PLATFORM_ID,Inject } from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {isPlatformBrowser} from '@angular/common';


// import {RequestOptions,Response,} from '@angular/http';
import {HttpClient,HttpHeaders,HttpResponse} from '@angular/common/http'
import {tokenNotExpired} from 'angular2-jwt';
import { map, filter } from 'rxjs/operators';
import * as jwt_decode from 'jwt-decode';

@Injectable()
export class AuthService{
	authToken:any;
	user :any;


  constructor(@Inject(PLATFORM_ID) private platformId:Object,private http:HttpClient) { }
  public url = "http://localhost:4000";
  getDecodedAccessToken(token:string){
    try{
      return jwt_decode(token);
    }
    catch(Error){return null}

  }

  registerUser(user){
       

  	let header=new HttpHeaders().set('Content-Type','application/json');
  	
  	return this.http.post(this.url+'/api/register',user,{headers:header})
  	.map((res) =>{    ; return res;});

  }
  
    authenticate(user){
         ;
   let header=new HttpHeaders().set('Content-Type','application/json');
       return this.http.post(this.url+'/api/authenticate',user,{headers:header})
    .map(res =>{     ;return  res;});

  }
  authenticateStudent(user){
       
    let header = new HttpHeaders().set('Content-type','application/json');
    return this.http.post(this.url+'/api/authenticate-student',user,{headers:header})
    .map(res=>{    ;return res;});
  }
  getProfile(){
          ;
       this.loadToken();

       
       let header =new HttpHeaders({
         'Authorization':this.authToken,
         'Content-Type':'application/json'
       });
       // header=header.append('Authorization',this.authToken);
       // header=header.append('Content-Type','application/json');
       return this.http.get(this.url+'/api/profile',{headers:header})
    .map(res =>{     ; return  res;});
  }
  storeUserData(token,user){
    if(isPlatformBrowser(this.platformId)){
    localStorage.setItem('id_token',token);
    localStorage.setItem('user',JSON.stringify(user));      
    }


  	this.authToken=token;
  	this.user=user;
  }
  loadToken(){
    const token=localStorage.getItem('id_token');
    this.authToken=token;
    const user = localStorage.getItem('user');
    this.user=JSON.parse(user)
  }
  loggedIn(){
    if(isPlatformBrowser(this.platformId)){
     return tokenNotExpired('id_token');     
    }

  }
  logOut(){

  	this.authToken=null;
  	this.user=null;
  	return localStorage.clear();

  }
  public loading = false;

  uploadImage(formData:any,id:any){
     
     this.loadToken();
     let headers = new HttpHeaders().set('Authorization',this.authToken);
     // headers.delete('Content_Type');
     // headers.append('Authorization',this.authToken);
      // let options = new RequestOptions({ headers: headers });


     return this.http.put(this.url+'/api/update/image',formData,{headers:headers})
    .map(res =>{ return  res;});
  }
   updateUser(user:any){

        ;
     this.loadToken();
     let headers = new HttpHeaders().delete('Content-Type').set('Authorization',this.authToken);
     // headers.delete('Content_Type');
     // headers.append('Authorization',this.authToken);
      // let options = new RequestOptions({ headers: headers });


     return this.http.put(this.url+'/api/update',user,{headers:headers})
    .map(res =>{return  res;});
  } 
  getProfilePic(id):Observable<Blob>{
    // let header= new HttpHeaders().set('responseType','blob');

    return this.http.get(`/api/${id}`,{responseType:'blob'})
    .map((res) =>{return  res;});

    }

    isMentor():boolean{
      if(this.loggedIn()){
        const token=localStorage.getItem('id_token');
       let decoded =  this.getDecodedAccessToken(token);

      if(decoded.data.role=='mentors'){
        return true;

      }
      

      }
      
        return false;
      
    
      
    }
     isVerified():boolean{
      if(this.loggedIn()){
        const token=localStorage.getItem('id_token');
        let decoded =  this.getDecodedAccessToken(token);
        this.loadToken();
        if(decoded.data.is_verified){
          return true;
        }
       
      }
      return false
    }

    getMentorDetail(id){
         ;
     return  this.http.get(this.url+`/api/mentor/${id}`)
      .map((res)=>{     ; return res;});
    }

    getJobHistory(){
         ;
        this.loadToken();

       
       let header =new HttpHeaders({
         'Authorization':this.authToken,
         'Content-Type':'application/json'
       }); 
      return this.http.get(this.url+'/api/history',{headers:header})
      .map(res=>{    ;return res})
    }

    getAllHistory(){
         ;
      this.loadToken();
      let header =new HttpHeaders({
        'Authorization':this.authToken,
        'Content-Type':'application/json'
      }); 
     return this.http.get(this.url+'/api/history',{headers:header})
     .map(res=>{return res})
    }

    getSubjects(type:any){
      
      return this.http.get(this.url+`/api/subject/${type}`)
      .map(res=>{return res});
    }

    registerJob(mentor){
         
      this.loadToken();

       
      let header =new HttpHeaders({
        'Authorization':this.authToken,
        'Content-Type':'application/json'
      }); 
     return this.http.post(this.url+`/api/hire`,mentor,{headers:header})
     .map(res=>{    ;return res})
    }


    resetPassword(email){
         ;
      var e={
        email:email
      }
      let header =new HttpHeaders({
        'Content-Type':'application/json'
      }); 
      //console.log(email)
      return this.http.post(this.url+'/api/forgot-password', e,{headers:header})
      .map(res=>{    ;return res});
    }

    updatePassword(user){
         
      this.loadToken()
      
      let header =new HttpHeaders({
        'Authorization':this.authToken,
        'Content-Type':'application/json'
        
      }); 
      return this.http.post(this.url+'/api/update-password',user,{headers:header})
      .map(res=>{    ;return res});
    }
    confirmToken(token){
         ;

      let header =new HttpHeaders({
        'Content-Type':'application/json'
      });
      return this.http.post(this.url+'/api/account/password-reset',token,{headers:header})
      .map(res=>{    ;return res});
    }
    
  
}

