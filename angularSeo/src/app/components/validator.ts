import { AbstractControl } from '@angular/forms';
import { parse, format,  isValidNumber } from 'libphonenumber-js';

export function validphoneNumber(control: AbstractControl) :{[key: string]: boolean}{
  const num = "+252"+control.value;
  const parsed = parse(num);
  let isValid:boolean=false ;
 
  if(!control.value ){
    return null;
  }
 

  if(parsed.phone!== undefined){
    isValid = isValidNumber(parsed.phone,'SO')
  }

 
  if(isValid){
    return null;
  }
  return {validNumber: true} ;
}

export function passwordMatch(control: AbstractControl):{[key: string]: boolean} {
  const pass = control.get('pass');
  const confirmPwd = control.get('confirmPass');
  if (!pass || !confirmPwd) {return null; }

  if(pass.value === confirmPwd.value) {return null; }
  return {mismatch: true};
}

