import { BrowserModule } from '@angular/platform-browser';
import { BrowserTransferStateModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {RouterModule,Routes} from '@angular/router';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AgmCoreModule } from '@agm/core';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

// import { CookieService } from 'ngx-cookie-service';
// import {NgAutoCompleteModule} from "ng-auto-complete";
// import { FileUploadModule } from 'ng2-file-upload';



import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { AboutComponent } from './components/about/about.component';
import { LoginComponent } from './components/login/login.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { RegisterComponent } from './components/register/register.component';
import { ProfileComponent } from './components/profile/profile.component';

import {AuthService}  from './services/auth.service';
import {LocationService}  from './services/location.service';
import {ValidateService} from  './services/validate.service';
import {DataService}  from './services/data.service';

import {AuthGuard}from './guard/auth-guard';
import {MentorGuard} from './guard/mentor-auth-guard';
import {StudentGuard} from './guard/student-guard';

import { FindMentorsComponent } from './components/find-mentors/find-mentors.component';
import { FooterComponent } from './components/footer/footer.component';
import { EditprofileComponent } from './components/editprofile/editprofile.component';
import { ModalDirective } from './directives/modal.directive';
import { ModalComponent } from './components/modal/modal.component';
import { MentordetailComponent } from './components/mentordetail/mentordetail.component';
import { MentorService } from './services/mentor-service.service';
import {LoadingService} from './services/loading.service';
import { ErrorComponent } from './components/error/error.component';


  import { CloudinaryModule } from '@cloudinary/angular-5.x';
  import * as  Cloudinary from 'cloudinary-core';
import { RegisterStudentComponent } from './register-student/register-student.component';
import { ServiceComponent } from './components/service/service.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { ChangePasswordComponent } from './components/change-password/change-password.component';
import {enableProdMode} from '@angular/core';
import { VerifiyTokenComponent } from './components/verifiy-token/verifiy-token.component';
import { PasswordGuard } from './guard/password-guard.guard';
import { LoadingInterceptor } from './services/loading-interceptor.interceptor';

enableProdMode();


var id:any;
const appRoutes:Routes=[{path:'',component:HomeComponent},
{path:'about',component:AboutComponent},
{path:'register',component:RegisterComponent},
{path:'login',component:LoginComponent},
{path:'profile',component:ProfileComponent, canActivate:[AuthGuard]},
{path:'find-mentors',component:FindMentorsComponent, canActivate:[StudentGuard]},
{path:'profile/edit',component:EditprofileComponent, canActivate:[AuthGuard]},
{path:'mentor/:id',component:MentordetailComponent},
{path:'error-page',component:ErrorComponent},
{path:'register-student',component:RegisterStudentComponent},
{path:'services',component:ServiceComponent},
{path:'forgot-password',component:ForgotPasswordComponent},
{path:'change-password',component:ChangePasswordComponent,canActivate:[AuthGuard]},
{path:'verify-token',component:VerifiyTokenComponent, canActivate:[PasswordGuard]},
{path:'**', redirectTo:''}

]

@NgModule({
  entryComponents: [ModalComponent ],
  declarations: [
    AppComponent,

    HomeComponent,
    AboutComponent,
    LoginComponent,
    NavbarComponent,
    RegisterComponent,
    ProfileComponent,
    FindMentorsComponent,
    FooterComponent,
    EditprofileComponent,
    ModalDirective,
    ModalComponent,
    MentordetailComponent,
    ErrorComponent,
    RegisterStudentComponent,
    ServiceComponent,
    ForgotPasswordComponent,
    ChangePasswordComponent,
    VerifiyTokenComponent  
   
  ],
  imports: [
  FormsModule,
  ReactiveFormsModule,
  // FileUploadModule,
    BrowserModule.withServerTransition({appId:'angularSeo'}),
    HttpClientModule,
    RouterModule.forRoot(appRoutes),
    NgbModule.forRoot(),
    CloudinaryModule.forRoot(Cloudinary, { cloud_name: 'mentome', api_secret:'uR7CNXyjXNk_esh10g-nwhQEocc', api_key:'456493615534494',
      upload_preset:'zapewgp1'}),
    AgmCoreModule.forRoot({
      apiKey:"AIzaSyCs9Za3rl7jZdfryoLs46zzCyvR0SORz5c",
      libraries:["places"]
      // region:"JP"

    }),
        // NgAutoCompleteModule,
        BrowserTransferStateModule
  ],
  providers: [ValidateService,AuthGuard,MentorGuard, LoadingService,
    StudentGuard,AuthService,DataService,LocationService, MentorService, PasswordGuard,
    LoadingService,{
      provide:HTTP_INTERCEPTORS,
    useFactory:(service:LoadingService)=>new LoadingInterceptor(service),
    multi:true,
    deps:[LoadingService]}],
  bootstrap: [AppComponent]
})
export class AppModule { }
