import {
  Component,
  OnInit,
  ViewChild,
  ChangeDetectorRef,
  ElementRef
} from "@angular/core";
import { AuthService } from "../../services/auth.service";
import { DomSanitizer, SafeUrl } from "@angular/platform-browser";
import { Router, ActivatedRoute } from "@angular/router";
import "rxjs/add/operator/map";
import { LoadingService } from "../../services/loading.service";
@Component({
  selector: "app-profile",
  templateUrl: "./profile.component.html",
  styleUrls: ["./profile.component.css"]
})
export class ProfileComponent implements OnInit {
  user: any;
  url: any;
  isImage = false;
  user_data: any[];
  showFile: boolean;
  showProfile: boolean = true;
  initial: any[] = [];
  nameParam: any;
  job: any;
  history: any[] = [];
  isHistory: boolean = true;
  isLoading = false;

  public imageurl: SafeUrl;
  constructor(
    public authService: AuthService,
    private sanitizer: DomSanitizer,
    private cdRef: ChangeDetectorRef,
    private router: Router,
    private route: ActivatedRoute,
    ls: LoadingService
  ) {
    ls.onLoadingChanged.subscribe(isLoading => (this.isLoading = isLoading));
  }

  getUserProfile() {
    return this.authService.getProfile().map(async data => {
      if(data['user']){

        this.user = data["user"];
        this.nameParam = data["user"].name;
  
        if (this.user.imageurl != null || this.user.imageurl != undefined) {
          this.isImage = true;
          let id = this.user.id;
          //console.log(id)
          var url = this.user.imageurl;
  
          this.imageurl = await this.sanitizer.bypassSecurityTrustUrl(url);
        } else {
          this.placeHolderImage(this.user);
        }
      } else {
        this.router.navigate(['/login']);
      }

    });
  }



  placeHolderImage(user) {
    ////log(mentor)
    var temp = user.name.toString();
    var s = temp.split(" ");
    var index = 0;
    user.initial = "";

    user.initial = s[index].substr(0, 1);
    user.initial = user.initial.toUpperCase();
  }
  public jobs: any[] = [];
  getJobHistory() {
    this.showProfile = false;
    return this.authService.getJobHistory().subscribe(data => {
      if (data["success"]) {
        //consolelog(data['job']);

        this.jobs.push(...data["job"]);
        //consolelog(this.jobs)
      } else {
        this.isHistory = false;
      }
    });
  }

  ngOnInit() {
    this.showFile = false;

    this.user_data = [];
    this.getUserProfile().subscribe(_ => {
      this.user_data.push(this.user);
      this.cdRef.detectChanges();
    });
  }
  @ViewChild("avatar") avatar;
  @ViewChild("phoneNumber") phoneNumberRef: ElementRef;


 
}
