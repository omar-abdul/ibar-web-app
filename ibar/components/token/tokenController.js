
const {
    body,
    validationResult,
    param,
    query
  } = require("express-validator/check");
  const { sanitizeBody } = require("express-validator/filter");
  
 
 
  const crypto = require("crypto");

  const util = require("../../helper/util");
  const mail = require("../../helper/mail");
  const Token = require('./tokenModel');
  const User = require('../user/userModel');



module.exports.confirmationToken = util.asynMiddleWare(
    async (req, res, next) => {
      const token = req.params.token;
  
      const data = await Token.getToken(token);
      

      let isVerified;
      if(data){
        const id = data.user_id;
          isVerified = await User.getUserVerificationStatus(id);
          if (isVerified) {
            res.json({
              success: false,
              msg: "user alredy verfied"
            });
          } else if (!isVerified) {
            const update = await User.updateVerificationStatus(id);
            const deleteToken = await Token.deleteToken(id);
            res.redirect(req.headers.host + "/login");
          }
   
      } else{res.status(404).json({success:false})}



    }
  );
  
  module.exports.resendToken = [
    body("email", "Must be an email")
      .isLength({
        min: 1
      })
      .isEmail()
      .trim()
      .normalizeEmail(),
  
    util.asynMiddleWare(async (req, res, next) => {
      console.log(req.body);
      const errors = validationResult(req);
      const email = await util.emailToLowerCase(req.body.email);
      if (!errors.isEmpty()) {
        res.json({
          success: false,
          msg: errors.array()
        });
      } else {
        const user = await User.getUserByEmail(email);
        if (user.is_verified) {
          res.json({
            success: false,
            msg: "User already verified"
          });
        } else {
          const token = {
            user_id: user.id,
            token: crypto.randomBytes(16).toString("hex")
          };
          const addedToken = await Token.addToken(token.user_id, token.token);
          mail.sendConfirmationEmail(addedToken, email, req.headers.host)
          .then(info => {
            res.json({
              success: true,
              msg:
                "A confirmation email has been sent to your email address, please verify your account"
            });
          }).catch(next);
        }
      }
    })
  ];