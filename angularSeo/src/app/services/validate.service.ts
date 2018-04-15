import { Injectable } from "@angular/core";
import { parse, format,  isValidNumber } from "libphonenumber-js";

@Injectable()
export class ValidateService {
  constructor() {}
  validateRegister(user) {
    if (
      user.name == undefined ||
      user.phoneNumber == undefined ||
      user.password == undefined ||
      user.email==undefined
    ) {
      return false;
    } else {
      return true;
    }
  }

  validateNameLength(user){
if (
    user.name.length<4){
      return false;
    }
    else{
      return true;
    }
  }
  validatePasswordMatch(p1,p2){
    if(p1===p2){
      return true
    }
   else{ return false};
  }
  validatePasswordLength(user){
    if (
        user.password.length<4){
          return false;
        }
        else{
          return true;
        }
      }

  validateEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  }
  validateLogin(user) {
    if (user.email == undefined || user.password == undefined) {
      return false;
    } else {
      return true;
    }
  }
  validatePhoneNumber(phoneNumber) {
 
    let parsed = parse(phoneNumber);
    
  

    return isValidNumber(parsed.phone,'SO')
}
}