import { BrowserModule } from '@angular/platform-browser';
import { BrowserTransferStateModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {RouterModule,Routes} from '@angular/router';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AgmCoreModule } from '@agm/core';
import {ErrorHandler} from "@angular/core";
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';


import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
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


import { RegisterStudentComponent } from './components/register-student/register-student.component';
import { ServiceComponent } from './components/service/service.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { ChangePasswordComponent } from './components/change-password/change-password.component';
import {enableProdMode} from '@angular/core';
import { VerifiyTokenComponent } from './components/verifiy-token/verifiy-token.component';
import { PasswordGuard } from './guard/password-guard.guard';
import { LoadingInterceptor } from './services/loading-interceptor.interceptor';

import { RegisterFormComponent } from './components/register-form/register-form.component';
import { LoginFormComponent } from './components/login-form/login-form.component';
import { StudentLoginComponent } from './components/student-login/student-login.component';
import { StarFormComponent } from './components/star-form/star-form.component';
import { StarComponent } from './components/star/star.component';

import { CommentsComponent } from './components/comments/comments.component';
import { CommentService } from './services/comment.service';
import { RateComponent } from './components/rate/rate.component';
import { ResendTokenComponent } from './components/resend-token/resend-token.component';
import { MentorRegisterFormComponent } from './components/mentor-register-form/mentor-register-form.component';

import {ErrorsHandler} from "./error-handler";
import { CitySearchComponent } from './components/city-search/city-search.component';
import { SubjectSearchComponent } from './components/subject-search/subject-search.component';
import { MentorCardComponent } from './components/mentor-card/mentor-card.component';
import { CofirmGuard } from './guard/cofirm.guard';
import { ProfileCardComponent } from './components/profile-card/profile-card.component';
import { ProfileInfoComponent } from './components/profile-info/profile-info.component';
import { JobHistoryComponent } from './components/job-history/job-history.component';

import { SubjectCardComponent } from './components/subject-card/subject-card.component'

enableProdMode();


var id:any;
const appRoutes:Routes=[{path:'',component:HomeComponent},
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
{path:'confirmation/page',component:ResendTokenComponent,canActivate:[CofirmGuard]},

{path:'**', redirectTo:'error-page'}

]

@NgModule({
  entryComponents: [ModalComponent ],
  declarations: [
    AppComponent,

    HomeComponent,

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
    VerifiyTokenComponent,
    RegisterFormComponent,
    LoginFormComponent,
    StudentLoginComponent,
    StarFormComponent,
    StarComponent,
    CommentsComponent,
    RateComponent,
    ResendTokenComponent,
    MentorRegisterFormComponent,
    CitySearchComponent,
    SubjectSearchComponent,
    MentorCardComponent,
    ProfileCardComponent,
    ProfileInfoComponent,
    JobHistoryComponent,
    
    SubjectCardComponent  
   
  ],
  imports: [
  FormsModule,
  ReactiveFormsModule,
  // FileUploadModule,
    BrowserModule.withServerTransition({appId:'angularSeo'}),
    HttpClientModule,
    RouterModule.forRoot(appRoutes),
    NgbModule.forRoot(),
    AgmCoreModule.forRoot({
      apiKey:"AIzaSyCs9Za3rl7jZdfryoLs46zzCyvR0SORz5c",
      libraries:["places"]
      // region:"JP"

    }),
        // NgAutoCompleteModule,
        BrowserTransferStateModule
  ],
  providers: [ValidateService,AuthGuard,MentorGuard, LoadingService,
    {
      provide:ErrorHandler,
      useClass:ErrorsHandler
    },
    StudentGuard,AuthService,DataService,LocationService, MentorService, PasswordGuard,
    LoadingService,{
      provide:HTTP_INTERCEPTORS,
    useFactory:(service:LoadingService)=>new LoadingInterceptor(service),
    multi:true,
    deps:[LoadingService],
    },CommentService, CofirmGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
