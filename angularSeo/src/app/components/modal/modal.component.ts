import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  Output,
  EventEmitter,
  Input
} from "@angular/core";
import { AuthService } from "../../services/auth.service";
import { ValidateService } from "../../services/validate.service";
import { MentorService } from "../../services/mentor-service.service";
import { parse } from "libphonenumber-js";
import { LoadingService } from "../../services/loading.service";
@Component({
  selector: "app-modal",
  templateUrl: "./modal.component.html",
  styleUrls: ["./modal.component.css"]
})
export class ModalComponent implements OnInit {
  user: any;
  visible: boolean = true;
  mentor: any;
  isRegForm: boolean = true;

  name: string;
  phoneNumber: string;
  email: any;
  password: string;
  authenticated: boolean = true;
  returnUrl: string;
  validated: boolean = true;
  registered: boolean = true;
  message: string;
  statusOk: boolean = false;
  show: boolean = false;
  public number;
  confirmPass: string;
  isLoading: false;

  @Output() public selected = new EventEmitter();
  role="students";
  public isRate:boolean;

  constructor(
    public authService: AuthService,
    private validateService: ValidateService,
    private mentorService: MentorService,
    ls: LoadingService
  ) {
    ls.onLoadingChanged.subscribe(isLoading => (this.isLoading = isLoading));
  }
  public csrfToken;
  ngOnInit() {
    this.mentorService.show$.subscribe(show => (this.show = show));
    this.mentorService.phoneNumber.subscribe(n => (this.number = n));
    if (this.show) {
      this.message = this.number;
    }

    if (this.authService.loggedIn()) {
      this.authService.getProfile().subscribe(data => {
        this.user = data["user"];
        ////console.log(this.user + "loggedin");
      });
    } else {
      ////console.log("not");
    }
  }
  toggleVisible() {
    this.visible = !this.visible;
  }
  onClick(mentor: any) {
    // ////console.log(mentorId)
    this.selected.emit(mentor);
  }
 
}
