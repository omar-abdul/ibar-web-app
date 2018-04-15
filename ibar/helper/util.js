const nodemailer = require("nodemailer");
const  mg = require("nodemailer-mailgun-transport");
const phoneUtil = require("google-libphonenumber").PhoneNumberUtil.getInstance();
const pnf = require("google-libphonenumber").PhoneNumberFormat;
const cloudinary = require("cloudinary");

const {UploadError} = require("./custom-errors");


module.exports.emailToLowerCase = async function(email){
  return email[0].toLowerCase()+email.substr(1);
}


  module.exports.isValidNumber =async function(number){
   const parsed = phoneUtil.parse(number,"SO")
   return phoneUtil.isValidNumber(parsed);
  };


  
  module.exports.formatNumber = async function(number){
    const parsed = phoneUtil.parse(number,"SO")
    return phoneUtil.format(parsed,pnf.NATIONAL);

  };

  module.exports.uploadImage = async function(file,id){
    cloudinary.config({
      cloud_name: process.env.CLOUD_NAME,
      api_key: process.env.API_KEY,
      api_secret: process.env.API_SECRET
    });
    try{
     const result = await cloudinary.v2.uploader
      .upload(file.path, {
        public_id: "mentome/" + id,
        invalidate: true,
        overwrite: true
      })
      return result;
    }catch(e){
      throw new UploadError("There was an error while trying to upload the image :"+e.message)

    }


  }

  module.exports.asynMiddleWare = fn=>(req,res,next)=>{
    Promise.resolve(fn(req,res,next)).catch(next);
  }