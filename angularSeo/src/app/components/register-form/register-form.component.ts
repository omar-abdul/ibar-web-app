import { Component, OnInit,  ViewChild, ElementRef } from '@angular/core';
import {FormControl, FormGroup, Validators, FormBuilder} from '@angular/forms';

import {validphoneNumber, passwordMatch} from '../validator';
import {Student} from '../Student';
import {AuthService} from '../../services/auth.service'
import {DataService} from '../../services/data.service'

@Component({
  selector: 'app-register-form',
  templateUrl: './register-form.component.html',
  styleUrls: ['./register-form.component.css']
})
export class RegisterFormComponent implements OnInit {
 

  registerForm: FormGroup;
  registered:boolean = true;
  statusOk:boolean = false;
  student:Student;

  message:any;
  emailPattern = "^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$";
  @ViewChild('city') searchElementRef: ElementRef;

  constructor(private fb: FormBuilder,private authService:AuthService,private data:DataService) {this.createForm()}

  createForm() {
    this.registerForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(4)]],
      email: ['', [Validators.required, Validators.pattern(this.emailPattern)]],
      phoneNumber:['', [Validators.required,validphoneNumber]],
      password:this.fb.group({
        pass:['',[Validators.required, Validators.minLength(8)]],
        confirmPass:['' , Validators.required]
      },{validator: passwordMatch}),
      role:'students'



    })

  }

  get name(){return this.registerForm.get('name')};
  get email() {return this.registerForm.get('email')}
  get password() { return this.registerForm.get('password'); }
  get phoneNumber () {return this.registerForm.get('phoneNumber') ;}


  ngOnInit() {
  
  }

  onRegisterSubmit() {
    this.student = this.registerForm.value;
   
    this.authService.registerUser(this.student)
    .subscribe(data=>{
      if(data['success']){
        this.registered = true;
        this.statusOk = true;
        this.data.changeEmail(this.student['email']);
      }
      else{
        this.registered = false;
        this.statusOk= false;
        this.message = '';
        if(data['msg'] instanceof Array){
          for(let i in data['msg']){
            this.message+=i['msg']+' \n';
          }
        }
        else {this.message = data['msg']}
      }
    })


  }

}
