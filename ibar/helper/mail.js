const nodemailer = require("nodemailer");
const  mg = require("nodemailer-mailgun-transport");
const {SendMailError} = require("./custom-errors");

APIKEY = "key-2b85bb3479d8d1da8bfe1b9ef556aab6"
DOMAIN = "mg.ibar.so"

const auth = {
  auth: {
    api_key: APIKEY,
    domain:
     DOMAIN
  }
};




module.exports.sendConfirmationEmail=async function(token,email,host,response){

    
    const transporter = nodemailer.createTransport(mg(auth));
  
    const mailOptions = {
      from: "no-reply@ibar.so",
      to: email,
      subject: "Verify your account",
      text:
        "Hello,\n\n" +
        "Please verify your account by clicking the link: \nhttp://" +
        host +
        "/api/confirmation/" +
        token +
        ".\n"
    };
  try{
    const sendMail = await transporter.sendMail(mailOptions);
    return sendMail;
  }catch(e){
    throw new SendMailError("There was an error sending the email: "+e.message);
  }



    
  }


  module.exports.sendResetPassEmail=async function(token,email,host,response){
    
    const transporter = nodemailer.createTransport(mg(auth));
  
    const mailOptions = {
      from: "no-reply@ibar.so",
      to: email,
      subject: "Verify your account",
      text:
        "Hello,\n\n" +
        "Copy this token and paste it on the form to reset your password: "+
        token +
        ".\n"
    };
  try{
    const sendMail = await transporter.sendMail(mailOptions);
    return sendMail;
  }catch(e){
    throw new SendMailError("There was an error sending the email: "+e.message);
  }



    
  }


