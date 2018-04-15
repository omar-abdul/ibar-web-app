import { Component, OnInit, NgZone, ViewChild, ElementRef } from '@angular/core';
import {FormControl, FormGroup, Validators, FormBuilder} from '@angular/forms';
import {} from 'googlemaps';
import { MapsAPILoader } from '@agm/core';
import {validphoneNumber, passwordMatch} from '../validator';
import {Mentor} from '../Mentor';
import {AuthService} from '../../services/auth.service'
import {DataService} from '../../services/data.service'

@Component({
  selector: 'app-mentor-register-form',
  templateUrl: './mentor-register-form.component.html',
  styleUrls: ['./mentor-register-form.component.css']
})
export class MentorRegisterFormComponent implements OnInit {
 
  countryName: string;
  public longtitude: number;
  public latitude: number;
  registerForm: FormGroup;
  mentor:Mentor;
  registered:boolean = true;
  statusOk:boolean = false;
  subArr:any[]=[]
  message:any;
  emailPattern = "^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$";
  @ViewChild('city') searchElementRef: ElementRef;

  constructor(private fb: FormBuilder,private authService:AuthService,
    private data:DataService,
    private mapsApiLoader: MapsAPILoader,
  private ngZone: NgZone) {this.createForm()}

  createForm() {
    this.registerForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(4)]],
      email: ['', [Validators.required, Validators.pattern(this.emailPattern)]],
      phoneNumber:['', [Validators.required,validphoneNumber]],
      password:this.fb.group({
        pass:['',[Validators.required, Validators.minLength(8)]],
        confirmPass:['' , Validators.required]
      },{validator: passwordMatch}),
      city_name: ['', Validators.required],
      subject: ['', Validators.required],
      role:'mentors'



    })

  }

  get name(){return this.registerForm.get('name')};
  get email() {return this.registerForm.get('email')}
  get password() { return this.registerForm.get('password'); }
  get city_name() {return this.registerForm.get('city_name'); }
  get phoneNumber () {return this.registerForm.get('phoneNumber') ;}
  get subject() {return this.registerForm.get('subject'); }

  ngOnInit() {
    this.data.getAllSubjects().subscribe(data=>{
      this.subArr = data['subjects'].slice(0,data['subjects'].length);
    });


    this.mapsApiLoader.load().then(() => {
      let cp: google.maps.places.ComponentRestrictions;
      cp = {
        country: [ 'so' ]
      };

    const autocomplete = new google.maps.places.Autocomplete(
          this.searchElementRef.nativeElement,
          {
            types: ['(regions)'],
            strictBounds: true,
            componentRestrictions: cp
          }
        );

        autocomplete.addListener('place_changed', () => {
          this.ngZone.run(() => {
            const place: google.maps.places.PlaceResult = autocomplete.getPlace();
            if (place.geometry === null || place.geometry === undefined) {
              return;
            }
            this.latitude = place.geometry.location.lat();
            this.longtitude = place.geometry.location.lng();
            this.countryName = place.formatted_address;
            this.city_name.patchValue(this.countryName);

          });
        });
    });
  }

  onRegisterSubmit() {
    this.mentor = this.registerForm.value;
    const user = {
      name: this.mentor.name,
      city_name:this.mentor.city_name,
      location:{
        latitude:this.latitude,
        longtitude:this.longtitude
      },
      phoneNumber:this.mentor.phoneNumber,
      password:this.mentor.password,
      subject_id:this.mentor.subject,
      role:this.mentor.role,
      email:this.mentor.email
    }
    if(this.latitude ===0 || this.longtitude===0 ||this.latitude===undefined ||
      this.longtitude === undefined || this.countryName===''||this.countryName===undefined ||
      this.countryName!==this.city_name.value){
        
      this.message="Please enter a valid city";
      this.statusOk = false;
      this.registered = false;
      return ;
    }
 
   


  
    this.authService.registerUser(user)
    .subscribe(data=>{
      if(data['success']){
        this.registered = true;
        this.statusOk = true;
        this.data.changeEmail(this.mentor['email']);
      }
      else{
        this.registered = false;
        this.statusOk= false;
        this.message = '';
        if(data['msg'] instanceof Array){
          data["msg"].forEach(e => {
            this.message +=e.msg+'\n'; 
          });
        }
        else {this.message = data['msg']}
      }
    })


  }

}
