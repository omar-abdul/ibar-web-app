import { Component, OnInit,ChangeDetectorRef } from "@angular/core";
import { MentorService } from "../../services/mentor-service.service";
import {CommentService} from "../../services/comment.service";
import { AuthService } from "../../services/auth.service";
import { ActivatedRoute, Router } from "@angular/router";
import { DomSanitizer, SafeUrl } from "@angular/platform-browser";
import { LoadingService } from "../../services/loading.service";
@Component({
  selector: "app-mentordetail",
  templateUrl: "./mentordetail.component.html",
  styleUrls: ["./mentordetail.component.css"]
})
export class MentordetailComponent implements OnInit {
  id: string;
  mentor: any;
  isImage: boolean = false;
  imageurl: SafeUrl;
  isLoading = false;
  public currentRate: number=0;;
  public rate=0;
  public totalRate=1;
  public mentorID ;

  constructor(
    private mentorService: MentorService,
    public authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private sanitizer: DomSanitizer,
    private cmtService:CommentService,
    ls: LoadingService
    
  ) {
    ls.onLoadingChanged.subscribe(isLoading => (this.isLoading = isLoading));
  }

  ngOnInit() {
    this.mentorID = this.route.snapshot.paramMap.get("id");
    
    if (this.authService.isMentor()) {
      this.router.navigate(["/"]);
    }
    this.getMentor();

    
  }


  getMentor(): void {
    const id = this.route.snapshot.paramMap.get("id");
    this.authService.getMentorDetail(id).subscribe(async data => {


      if (data["success"]) {
        this.mentor = data["user"];
        
        var img = data["user"].imageurl;




        if (img != null || img != undefined) {


          this.isImage = true;
          var url = this.mentor.imageurl;
          this.imageurl = await this.sanitizer.bypassSecurityTrustUrl(url);
        } else if (img == null || img == undefined) {
          this.isImage = false;
          this.placeHolderImage(this.mentor);
        }
      } else {
        this.router.navigate(["/"]);
      }
    }),
      error => {
        this.router.navigate(["error-page"]);
      };
  }
  placeHolderImage(user) {

    var temp = user.name.toString();
    var s = temp.split(" ");
    var index = 0;
    user.initial = "";

    user.initial = s[index].substr(0, 1);
    user.initial = user.initial.toUpperCase();
  }
  createImageFromBlob(image: Blob, mentor: any) {
    this.isImage = true;
    let reader = new FileReader();
    reader.addEventListener(
      "load",
      () => {
        mentor.url = reader.result;
      },
      false
    );
    if (image) {
      reader.readAsDataURL(image);
    }
  }
  public showNumber: boolean = false;
  public message: any;
  requestMentor(mentor: any) {

    return this.authService.registerJob(mentor).subscribe(data => {
      if (data["success"]) {
        this.showNumber = true;
        this.mentorService.sendBoolean(this.showNumber);
        this.mentorService.sendNumber(mentor.phone_number);
        this.message = mentor.phone_number;
      } else {
        this.showNumber = true;
        this.message = data["msg"];
      }
    });
  }

}
