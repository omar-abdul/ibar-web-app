const {
  body,
  validationResult,
  param,
  query
} = require("express-validator/check");
const { sanitizeBody } = require("express-validator/filter");
const bcrypt = require("bcryptjs");
const crypto = require('crypto');

const passport = require("passport");
const multer = require("multer");

const jwt_helper = require("../../helper/jwt-helper");

const User = require("./userModel");
const util = require("../../helper/util");
const mail = require("../../helper/mail");
const crypto_hmac = require("../../helper/hmac_helper");
const Token = require("../token/tokenModel");
const Mentor = require("../mentor/mentorModel");

async function hashPassword(password) {
  let salt = await bcrypt.genSalt(10);
  let hashed = await bcrypt.hash(password, salt);
  return hashed;
}

async function jsUcfirst(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

module.exports.registerHandler = [
  body("name", "Name must be at least 4 characters").isLength({
    min: 4
  }),
  body("email", "Must be a vaild email")
    .isEmail()
    .trim()
    .normalizeEmail(),
  body("password", "Password be at least 8 characters").isLength({
    min: 8
  }),
  body("phoneNumber")
    .custom(async value => {
      return util.isValidNumber(value);
    })
    .withMessage("Phone number must be of from the Somali region"),

  sanitizeBody("name")
    .trim()
    .escape(),

  util.asynMiddleWare(async function(req, res, next) {
    const phone_number = await util.formatNumber(req.body.phoneNumber);
    // const password = await hashPassword(req.body.password)
    const errors = validationResult(req);
    //(req.body);
    const email = await util.emailToLowerCase(req.body.email);
    const name = await jsUcfirst(req.body.name);

    if (!errors.isEmpty()) {
      res.json({
        success: false,
        msg: errors.array()
      });
    } else {
      let user;
      const data = await User.getUserByEmailOrNumber(email, phone_number); // check whether email or phone number already exists

      if (data.exists) {
        res.json({
          success: false,
          msg: "User with this email  or phone number already exists"
        });
      } else {
        user = {
          name: name,
          email: email,
          password: req.body.password.pass,
          phoneNumber: phone_number,
          role: req.body.role
        };

        const addedUser = await User.addUser(user);
        if (user.role === "mentors") {
          const mentor = {
            id: addedUser.id,
            subject_id: req.body.subject_id,
            city_name: req.body.city_name,
            location: {
              lng: req.body.location.longtitude,
              lat: req.body.location.latitude
            }
          };

          const addedMentor = await Mentor.addMentor(mentor);
          const addedSubject = await Mentor.addTeachSubject(mentor);
        }

        const token = {
          user_id: addedUser.id,
          token: crypto.randomBytes(16).toString("hex")
        };
        const addToken = await Token.addToken(token.user_id, token.token);

        mail
          .sendConfirmationEmail(token.token, email, req.headers.host)
          .then(info => {
            res.json({
              success: true,
              msg:
                "A confirmation email has been sent to your email address, please verify your account"
            });
          })
          .catch(next);
      }
    }
  })
];
module.exports.loginHandler = [
  body("email", "Must be a valid email")
    .isEmail()
    .trim()
    .normalizeEmail(),
  util.asynMiddleWare(async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.json({
        success: false,
        msg: errors.array()
      });
    } else {
      const email = await util.emailToLowerCase(req.body.email);
      const user = await User.getUserByEmail(email);
      let isMatch;
      if (user) {
        isMatch = await User.comparePassword(req.body.password, user.password);
        if (isMatch) {
          if (!user.is_verified) {
            res.json({
              success: false,
              msg: "Please verify your account to login"
            });
          } else {
            const loggedUser = {
              id: user.id,
              name: user.name,
              email: user.email,
              role: user.role,
              phone_number: user.phone_number
            };
						const token = jwt_helper.signToken(loggedUser);
						const refreshToken = await crypto_hmac.createCrytoHmac(user.email)


						const rowCount = await User.addRefreshToken(refreshToken, user.id);
						

            return res.json({
              success: true,
              token: "JWT " + token,
              user: loggedUser,
              refresh_token: refreshToken
            });
          }
        } else if (!isMatch) {
          res.json({
            success: false,
            msg: "Email and passowrd are incorrect"
          });
        }
      } else {
        res.json({
          success: false,
          msg: "No user is associated with this email"
        });
      }
    }
  })
];

module.exports.updateUserHandler = [
  body("phoneNumber")
    .custom(async value => {
      return util.isValidNumber(value);
    })
    .withMessage("Phone number must be of from the Somali region"),
  body("location")
    .custom((value, { req }) => {
      if (value) {
        if (value.longtitude > 180 || value.longtitude < -180) {
          return false;
        }
        if (value.latitude > 90 || value.latitude < -90) {
          return false;
        } else {
          return true;
        }
      } else {
        return true;
      }
    })
    .withMessage("Location must be valid longtitude and latitude"),
  passport.authenticate("jwt", {
    session: false
  }),

  util.asynMiddleWare(async function(req, res, next) {
    var errors = validationResult(req);
    let subjects = req.body.subjects;
    

    if (!errors.isEmpty()) {
      res.json({
        success: false,
        msg: errors.array()
      });
    } else {
      req.body.phoneNumber = await util.formatNumber(req.body.phoneNumber);

      const data = await User.getExistingUserByNumber(
        req.body.phoneNumber,
        req.user.email
      );
      let id;

      if (data.exists) {
        res.json({
          success: false,
          msg: "Phone number is already in use"
        });
      } else {
        id = await User.updateUser(req.user.id, req.body);

        if (id) {
          if (req.user.role === "mentors") {
            const mentor = await Mentor.updateMentor(id, req.body, subjects);
          }
          res.json({
            success: true,
            msg: "information updated successfully"
          });
        } else {
          res.json({
            success: false,
            msg: "Something went wrong"
          });
        }
      }
    }
  })
];

module.exports.deleteImage = [
  
  passport.authenticate("jwt", {
    session: false
  }),
  util.asynMiddleWare(async function(req ,res, next){
    const id = req.user.id;
    const url= User.updateImageUrl(id,null);
    const img = util.deleteImage(id);

    res.json({
      success:true
    })



  })
]

module.exports.addJobHandler = [
  passport.authenticate("jwt", {
    session: false
  }),
  async function(req, res, next) {
    const mentor = {
      id: req.body.id,
      phoneNumber: req.body.phone_number
    };
    const student = {
      id: req.user.id,
      name: req.user.name
    };

    if (req.user.role === "students") {
      User.getMentorById(mentor.id)
        .then(data => (mentor.name = data.name))
        .then(data => {
          return User.addJob(mentor, student);
        })
        .then(result => res.json({ success: true, msg: "Mentor hired" }))
        .catch(err => {
          next(err);
        });
    } else {
      res.json({
        success: false,
        msg: "Only students can hire mentors"
      });
    }
  }
];

module.exports.jobHistoryHandler = [
  passport.authenticate("jwt", {
    session: false
  }),
  async function(req, res, next) {
    User.getJobByUserId(req.user)
      .then(job => {
        res.json({
          success: true,
          job: job
        });
      })
      .catch(e => {
        next(e);
      });
  }
];

var upload = multer({
  dest: "uploads/"
});
module.exports.uploadImageHandler = [
  passport.authenticate("jwt", {
    session: false
  }),
  upload.single("image"),
  util.asynMiddleWare(async function(req, res, next) {
    const result = await util.uploadImage(req.file, req.user.id);
    const url = await User.updateImageUrl(req.user.id, result.secure_url);

    if (url !== undefined) {
      res.json({
        success: true,
        url: result.secure_url
      });
    }
  })
];

module.exports.profileHandler = [
  passport.authenticate("jwt", {
    session: false
  }),
  util.asynMiddleWare(async function(req, res, next) {
    //(req.cookies);

    role = req.user.role;
    if (role === "mentors") {
      const mentor = await Mentor.getMentorById(req.user.id);

      res.json({
        success: true,
        user: mentor
      });
    } else if (role === "students") {
      const student = await User.getUserById(req.user.id);
      res.json({
        success: true,
        user: student
      });
    }
  })
];

module.exports.passwordResetHandler = [
  body("email", "Please enter a valid email address")
    .isEmail()
    .trim()
    .normalizeEmail(),
  util.asynMiddleWare(async function(req, res, next) {
    const error = validationResult(req);
    if (!error.isEmpty()) {
      res.json({
        success: false,
        msg: error.array()
      });
    } else {
      const em = await util.emailToLowerCase(req.body.email);
      const result = await User.getUserByEmail(em);

      if (result) {
        const token = {
          user_id: result.id,
          token: crypto.randomBytes(8).toString("hex")
        };
        const addToken = await Token.addPasswordToken(em, token.token);

        if (addToken.rowCount > 0) {
          mail
            .sendResetPassEmail(token.token, em, req.headers.host)
            .then(info => {
              if (info) {
                res.json({
                  success: true,
                  msg: "An email was sent to you",
                  token: token.token
                });
              }
            })
            .catch(next);
        }
      } else {
        res.json({
          success: false,
          msg: "No user associated with this email"
        });
      }
    }
  })
];
module.exports.passConfirmationHandler = [
  util.asynMiddleWare(async function(req, res, next) {
    const results = await Token.getPassToken(req.body.token);
    if (results) {
      const user = results;
			const token = jwt_helper.signToken(loggedUser);
			const refreshToken = await crypto_hmac.createCrytoHmac(user.email)

      res.json({
        success: true,
        token: "JWT " + token,
				user: user,
				refresh_token:refreshToken
      });
    } else {
      res.json({
        success: false,
        msg: "token does not match try resending "
      });
    }
  })
];

module.exports.updatePasswordHandler = [
  body("password", "Password must be at least 8 characters long").isLength({
    min: 8
  }),
  passport.authenticate("jwt", {
    session: false
  }),

  util.asynMiddleWare(async function(req, res, next) {
    let password = await hashPassword(req.body.password);
    const result = await User.updatePassword(req.user.email, password);
    if (result.rowCount > 0) {
      res.json({
        success: true,
        msg: "password updated"
      });
    } else {
      res.json({
        success: false,
        msg: "password updated"
      });
    }
  })
];

module.exports.studentLoginHandler = [
  body("email", "Must be a valid email")
    .isEmail()
    .trim()
    .normalizeEmail(),

  util.asynMiddleWare(async function(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.json({
        success: false,
        msg: errors.array()
      });
    } else {
      const email = await util.emailToLowerCase(req.body.email);

      const role = "students";
      let user;

      const data = await User.getUserByRole(email, role);
      let isMatch;

      if (data) {
        user = data;
        isMatch = await User.comparePassword(req.body.password, data.password);

        if (isMatch) {
          if (!user.is_verified) {
            res.json({
              success: false,
              msg: "Please verify your account to continue"
            });
          } else {
            const loggedUser = {
              id: user.id,
              name: user.name,
              email: user.email,
              role: user.role,
              phone_number: user.phone_number
            };
            const token = jwt_helper.signToken(loggedUser);

						const refreshToken = await crypto_hmac.createCrytoHmac(user.email)
            const rowCount = await User.addRefreshToken(refreshToken, user.id);

            res.json({
              success: true,
              token: "JWT " + token,
              user: user,
              refresh_token: refreshToken
            });
          }
        } else if (!isMatch) {
          res.json({
            success: false,
            msg: "Email or password are incorrect"
          });
        }
      } else {
        res.json({
          success: false,
          msg: "Email and password are incorrect"
        });
      }
    }
  })
];

module.exports.subjectHandler = [
  util.asynMiddleWare(async function(req, res, next) {
    const subjects = await User.getSubjects();

    res.json({
      success: true,
      subjects: subjects
    });
  })
];

module.exports.reauthenticateMiddleware = async function(req, res, next) {

  passport.authenticate("jwt", { session: false }, async function(
    err,
    userLogged,
    info
  ) {
    if (err) {
      return next(err);
    }
    if (!userLogged) {
      const email = req.body.email;

			
      const ref_token = req.header('X-Refresh-Token');
      
			const user = await User.getByRefreshToken(ref_token);


      if (user === null || user === undefined || user === "") {
        return res.status(401).json({
          success: false
        });
      }

      const diff = Date.daysBetween(new Date(Date.now()), user.date_issued);

      if (diff > 180) {
        return res.status(401).json({ success: false });
      }
      const loggedUser = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone_number: user.phone_number
			};
			req.user = user;
			

      const token = jwt_helper.signToken(loggedUser);
      return res.json({
        success: true,
        token: "JWT " + token,
				user: userLogged,
				refresh_token:ref_token

      });
		}

	
		
		const ref_token = req.header('X-Refresh-Token');


    req.user = userLogged;
		const token = jwt_helper.signToken(userLogged);
		const refreshToken = await crypto_hmac.createCrytoHmac(userLogged.email)
    return res.json({
      success: true,
      token: "JWT " + token,
			user: userLogged,
			refresh_token:ref_token
		 });
  })(req, res, next);
};

module.exports.logOutHandler =[
 async function(req,res,next){
 const ref_token = req.header('X-Refresh-Token');
 const del = await User.deleteRefreshTk(ref_token);
 if(del.rowCount > 0 ){
   res.json({
     success:true
   })
 }
}]

Date.daysBetween = function(date1, date2) {
  //Get 1 day in milliseconds
  var one_day = 1000 * 60 * 60 * 24;

  // Convert both dates to milliseconds
  var date1_ms = date1.getTime();
  var date2_ms = date2.getTime();

  // Calculate the difference in milliseconds
  var difference_ms = date2_ms - date1_ms;

  // Convert back to days and return
  return Math.round(difference_ms / one_day);
};
