import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  Output,
  EventEmitter
} from "@angular/core";
import { AuthService } from "../../services/auth.service";
import { ValidateService } from "../../services/validate.service";
import { MentorService} from "../../services/mentor-service.service";
import {parse, asYouType} from 'libphonenumber-js'
import { LoadingService } from "../../services/loading.service";
@Component({
  selector: "app-modal",
  templateUrl: "./modal.component.html",
  styleUrls: ["./modal.component.css"]
})
export class ModalComponent implements OnInit {
  user: any;
  visible: boolean = true;
  mentor:any;
  isRegForm: boolean = true;
 

  name: string;
  phoneNumber: string;
  email:any;
  password: string;
  authenticated: boolean = true;
  returnUrl: string;
  validated: boolean = true;
  registered: boolean = true;
  message: string;
  statusOk:boolean=false;
  show:boolean = false
  public number;
  confirmPass:string
  isLoading:false;

  @Output() public selected = new EventEmitter();
  @ViewChild("role") role: ElementRef;

  constructor(
    public authService: AuthService,
    private validateService: ValidateService,
  private mentorService:MentorService,ls:LoadingService  ) {
    ls.onLoadingChanged.subscribe(isLoading=>this.isLoading = isLoading)
  }
  public csrfToken;
  ngOnInit() {
    this.mentorService.show$.subscribe(show=>this.show= show);
    this.mentorService.phoneNumber.subscribe(n=>this.number=n);
    if(this.show){
      this.message=this.number
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
  onRegisterSubmit() {
    let formated_num =new asYouType().input(this.phoneNumber);
    const user = {
      name: this.name,
      phoneNumber:'+252'+this.phoneNumber,
      email:this.email,
      password: this.password,
      role: this.role.nativeElement.value,
      confirmPass:this.confirmPass
    };
    //console.log(this.role.nativeElement.value);
    if (!this.validateService.validateRegister(user)) {
      // this.flashMessage.show('Please fill in all fields', {
      //   classes: ['alert', 'alert-danger'],
      //   timeout: 3000, // Default is 3000
      // });
      this.validated = false;
      this.message="Please fill all the fields";
      return;
    }
    if(!this.validateService.validatePasswordMatch(user.confirmPass,user.password)){
      this.validated = false;
      this.message="Password fields do not match";
      return;
    }
    if(!this.validateService.validateEmail(user.email)){
      this.validated = false;
      this.message="Please enter a valid email address";
      return;
    }
    if (!this.validateService.validatePhoneNumber(user.phoneNumber)) {
      this.validated = false;
      this.message = "Please enter a valid phone number in the Somali region";
      return;
    } else {
      this.authService.registerUser(user).subscribe(data => {
        ////console.log(data);
        if (data["success"]) {
          // this.router.navigate(["login"]);

          this.statusOk= true;
         this.message=data['msg'];
         this.registered=true;
         this.validated=true;
        }  else if(!data['success']) {
          this.registered = false;
          this.statusOk = false;
          this.message=""
          data['msg'].forEach(e=>this.message+="\n"+e.msg)
         
          return;
        }
      });
    }
  }

  onLoginSubmit() {
    const user = {
      email: this.email,
      password: this.password
    };
    ////console.log(user);
    if (!this.validateService.validateLogin(user)) {
      // //   this.flashMessage.show('Fields cannot be empty', {
      // //   classes: ['alert', 'alert-danger'],
      // //   timeout: 3000, // Default is 3000
      this.validated = false;
      this.message = "Please fill in all fields";
      return;
    } else if (!this.validateService.validateEmail(user.email)) {
      this.validated = false;
      this.message = "please enter a valid email";
      return;
    } else {
      // }

      this.authService.authenticateStudent(user).subscribe(data => {
        ////console.log(data);
        if (data["success"]) {
          this.authService.storeUserData(data["token"], data["user"]);
          //   this.flashMessage.show("Login finally happened",{classes:["alert alert-success"],
          //     timeout:3000
          // });
        } else {
          this.authenticated = false;
          this.message = data["msg"];
          //   this.flashMessage.show(data.msg ,{classes:["alert alert-danger"],
          //     timeout:3000
          // });
        }
      });
    }
  }
}
