import { Component, OnInit, Input } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { AuthService } from "../../services/auth.service";
import { validphoneNumber } from "../validator";
import { Mentor } from "../Mentor";
import { SafeUrl, DomSanitizer } from "@angular/platform-browser";
import { LoadingService } from "../../services/loading.service";



@Component({
  selector: "edit-form",
  templateUrl: "./editform.component.html",
  styleUrls: ["./editform.component.css"]
})
export class EditformComponent implements OnInit {
  editform: FormGroup;
  @Input('user') user: any;

  mentor: Mentor;
  latitude: number;
  longtitude: number;
  imageurl: SafeUrl;
  success: boolean;
  failed: boolean = false;
  message: string;
  cityName:string;
  isLoading:boolean

  constructor(private fb: FormBuilder, public authService: AuthService, private ls:LoadingService) {
    ls.onLoadingChanged.subscribe(load=>this.isLoading=load);

    this.createForm();
  }

  createForm() {
 
    this.editform = this.fb.group({
      name: [
        '',
        Validators.compose([Validators.required, Validators.minLength(4)])
      ],

      phone_num: [
        '',
        [Validators.required, validphoneNumber]
      ],
      about: null
    });
  }

  get name() {
    return this.editform.get("name");
  }
  get about() {
    return this.editform.get("about");
  }

  get phone_num() {
    return this.editform.get("phone_num");
  }
  toggleForm(){
    if(this.isLoading){
      this.editform.disable()
    }
    else{
      this.editform.enable();
    }
  }

  ngOnInit() {
    this.toggleForm();
   
    if(this.user){
      this.editform.setValue({
        name:this.user.name,
        phone_num:this.user.phone_number,
       
        about:this.user.about || ''
      })
    }

  }
  //retrieve subjects and add to array 
  getSubject($event){
    if(Array.isArray(this.user.subjects)&&!this.user.subjects.length){
      this.user.subjects =[];
      this.user.subjects.push($event.name);

    }else if(this.user.subjects && !this.checkSubject($event.name)){
      this.user.subjects.push($event.name);
    }
  }

  getCity($event){
    this.cityName = $event.city;
    this.latitude = $event.lat;
    this.longtitude = $event.lng;
  }


// check whether subject is already in list
  checkSubject(subject: any) {

    var isSub: boolean;

    for (var i = 0; i < this.user.subjects.length; i++) {
      if (this.user.subjects[i] != subject) {
        isSub = false;
      } else {
        isSub = true;
        break;
      }
    }

    return isSub;
  }

  updateUser(values) {
    
    this.mentor = values;
    let user;

    if (this.authService.isMentor()) {
      user = {
        name: values.name || this.user.name,
        
        phoneNumber: values.phone_num || this.user.phone_number,
        about: values.about || this.user.about,
        location: {
          latitude: this.latitude || this.user.lat,
          longtitude: this.longtitude || this.user.lng
        },
        lat: this.latitude || this.user.lat,
        lng: this.longtitude || this.user.lng,
        city_name:this.cityName || this.user.city_name,
        subjects: this.user.subjects,
        imageurl: this.user.imageurl || this.imageurl
      };
    } else {
      user = {
        name: values.name || this.user.name,
        
        phoneNumber: values.phone_num || this.user.phone_number
      };
    }
    this.isLoading = true;
    this.toggleForm()
    this.authService.updateUser(user).subscribe(data => {
      if (data["success"]) {
        this.success = true;
      } else {
        this.message = '';
        this.success = false;
        this.failed = true;
        if (data["msg"] instanceof Array) {
          data["msg"].forEach(e => (this.message += e.msg + " \n"));
        } else {
          this.message += data["msg"];
        }
      }
    });
  }

  deleteSubject(subject: any) {
    this.user.subjects = this.remove(this.user.subjects, subject);
  }

  remove(array: any[], element: any) {
    for (var i = 0; i < array.length; i++) {
      if (array[i] == element) {
        array.splice(i, 1);
      }
    }
    return array;
  }
}
