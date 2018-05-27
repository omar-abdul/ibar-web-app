import { Injectable, PLATFORM_ID, Inject } from "@angular/core";
import { Observable } from "rxjs";


import * as siteWide from "../constants";


import { HttpClient, HttpHeaders, HttpResponse } from "@angular/common/http";
import { map, filter } from "rxjs/operators";

@Injectable()
export class CommentService {
  public url = siteWide.constants.SERVER_URL;

  constructor(private http:HttpClient) { }
  getAllComments(id){
    return this.http.get(this.url + `/api/comments/${id}`).pipe(map(res => {
      return res;
    }));
  }
  getRate(id){
    return this.http.get(this.url+`/api/star-rate/${id}`).pipe(map(res => {
      return res;
    }));
  }

}
