const { body, validationResult, param } = require("express-validator/check");
const { sanitizeBody } = require("express-validator/filter");
const pg = require("pg");
var config = require("../config/database");
var bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
// const { isValidNumber, format ,parse} = require("libphonenumber-js");
const  phoneUtil = require('google-libphonenumber').PhoneNumberUtil.getInstance();
const pnf= require('google-libphonenumber').PhoneNumberFormat



var mg = require("nodemailer-mailgun-transport");
const passport = require("passport");
const multer = require("multer");
const cloudinary = require("cloudinary");

const pool = pg.Pool(config);

async function hashPassword(password) {
  let salt = await bcrypt.genSalt(10);
  let hashed = await bcrypt.hash(password, salt);
  return hashed;
}

async function emailToLowerCase(email){
  var lowerCaseEmail = email.toLowerCase();
  return lowerCaseEmail;



}

module.exports.registerController = [
  body("name", "Name must be at least 4 characters").isLength({ min: 4 }),
  body("email", "Must be a vaild email")
    .isEmail()
    .trim()
    .normalizeEmail(),
  body("password", "Password be at least 8 characters").isLength({ min: 8 }),
  body("phoneNumber").custom(value=>{
    return new Promise((resolve,reject)=>{
      
      const parsed = phoneUtil.parse(value,'SO')
 
    
         resolve(phoneUtil.isValidNumber(parsed))

    })

  }).withMessage('Phone number must be of from the Somali region'),

  sanitizeBody("name")
    .trim()
    .escape(),

  async function(req, res, next) {
    console.log(req.headers.host+'/login');
    const parsed = phoneUtil.parse(req.body.phoneNumber,'SO')
 
    const phone_number=phoneUtil.format(parsed,pnf.NATIONAL)

    let password = await hashPassword(req.body.password);

    const errors = validationResult(req);
    const email = await emailToLowerCase(req.body.email)

    if (!errors.isEmpty()) {
      res.json({ success: false, msg: errors.array() });
    } else {
      pool.connect(function(err, client, done) {
        const query = "SELECT id FROM users WHERE email = $1;";

        if (err) {
          return console.error("There was an eror", err);
        }

        client.query(query, [email], function(err, result) {
          if (err) {
            return console.error("error happened during query 1", err);
          } else if (result.rows.length > 0) {
            console.log(result.rows[0]);
            res.json({success:false,msg:[{msg:"User with this email already exists"}]})
          } else {
            const role = req.body.role;

            client.query('INSERT INTO users (name,password,email,phone_number,role) VALUES ($1,$2,$3,$4,$5) RETURNING id',
            [req.body.name, password,email, phone_number, role],
          async function(err, results){
            if (err) return console.log(err)

            if(role ==='mentors'){
              client.query('INSERT INTO mentors (user_id) VALUES ($1)',
              [results.rows[0].id],
              function(err, _results){
                if (err) return console.log(err)
              });

            }
            var token = {
              user_id: results.rows[0].id,
              token: crypto.randomBytes(16).toString("hex")
            };
            client.query(
              `INSERT INTO token (user_id,token) VALUES ($1,$2)`,
              [token.user_id, token.token],
              await function(err, results) {
                if (err) return console.error("error happend", err);
                done();
                var auth = {
                  auth: {
                    api_key: "key-2b85bb3479d8d1da8bfe1b9ef556aab6",
                    domain:
                      "sandboxa38371f16a98467998b4ef540213a303.mailgun.org"
                  }
                };
                var transporter = nodemailer.createTransport(mg(auth));

                var mailOptions = {
                  from: "no-reply@ibar.com",
                  to: email,
                  subject: "Verify your account",
                  text:
                    "Hello,\n\n" +
                    "Please verify your account by clicking the link: \nhttp://" +
                    req.headers.host +
                    "/api/confirmation/" +
                    token.token +
                    ".\n"
                };
                transporter.sendMail(mailOptions, function(error, info) {
                  if (error) {
                    console.error("the error in sending is",error);
                     var errArr =[];
                     var msg={
                      msg:"There was an error sending the email"
                     }
                     errArr.push(msg);
                     res.json({success:false,msg:errArr});
                  } else {
                    console.log("Email sent: " + info.messageId);
                    res.json({
                      success: true,
                      msg: "A confirmation email has been sent to your email address, please verify your account"
                    });
                  }
                });
              }
            );

          })






          }
        });
      });
    }
  }
];

module.exports.authenticateUser = [
  body("email", "Must be a valid email")
    .isEmail()
    .trim()
    .normalizeEmail(),

  async function(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.json({ success: false, msg: errors.array() });
    }
    const email = await emailToLowerCase(req.body.email)
    const query = "SELECT * FROM users WHERE email = $1";
    console.log(email);

    pool.connect(async function(err, client, done) {
      if (err) {
        return console.error("error fetching", err);
      }

      let results = await client.query(query, [email]);
      if (results.rows.length > 0) {
        const temp = results.rows[0];
        const user = {
          name:temp.name,
          phone_number:temp.phone_number,
          is_verified:temp.is_verified,
          email:temp.email,
          id:temp.id,
          role:temp.role

        }

        let isMatch = await bcrypt.compare(req.body.password, temp.password);
        if (isMatch) {
          const token = jwt.sign({ data: user }, process.env.DB_SECRET, {
            expiresIn: 6040800
          });

          console.log(user);

          res.json({ success: true, token: "JWT " + token, user: user });
        } else if (!isMatch) {
          res.json({ success: false, msg: "Password associated with email is not correct" });
        }
      } else {
        res.json({ success: false, msg: "No user associated with this email" });
      }
    });
  }
];

module.exports.confirmationToken = function(req, res, next) {
  const token = req.params.token;

  pool.connect(function(err, client, done) {
    if (err) return console.error(err);
    const query = "SELECT * FROM token WHERE token = $1;";
    client.query(query, [token], function(err, results) {
      if (err) return console.log("there was a quert error", err);
      if (results.rows.length > 0) {
        const id = results.rows[0].user_id;
        client.query(
          "SELECT is_verified FROM users WHERE id = $1",
          [id],
          function(err, r) {
            if (err) console.log("there was a query eror", err);
            if (r.rows.length > 0) {
              console.log(r.rows[0]);
              if (r.rows[0].is_verified) {
                done();
                res.json({ success: false, msg: "User already verified" });
              } else {
                client.query(
                  "UPDATE users SET is_verified=$1 WHERE id=$2",
                  [true, id],
                  function(err, f_r) {
                    if (err) console.log("there was a query eror", err);
                    client.query(
                      "DELETE FROM token WHERE user_id=$1",
                      [id],
                      function(err, fr) {
                        done();
                        if (err) console.log("there was a query eror", err);
                        var u = req.headers.host+'/login'

                        res.redirect(u)
                      }
                    );
                  }
                );
              }
            }
          }
        );
      } else {
        done();
        res.json({ success: false, msg: "No matching token found" });
      }
    });
  });
};

module.exports.resendToken = [
  body("email", "Must be an email")
    .isLength({ min: 1 })
    .isEmail()
    .trim()
    .normalizeEmail(),

  function(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.json({ success: false, msg: errors.array() });
    }
    pool.connect(function(err, client, done) {
      const query = "SELECT * FROM users WHERE email = $1;";

      if (err) {
        return console.error("There was an eror", err);
      }

      client.query(query, [req.body.email], function(err, result) {
        if (err) {
          return console.error("error happened during query 1", err);
        }
        if (result.rows.length > 0) {
          const user = result.rows[0];
          if (user.is_verified) {
            done();
            res.json({ success: false, msg: "User already verified" });
          }
          var token = {
            user_id: user.id,
            token: crypto.randomBytes(16).toString("hex")
          };
          client.query(
            `INSERT INTO token (user_id,token) values($1,$2) 
                    on conflict (user_id)
                    do update set token=$2 WHERE token.user_id = $1;`,
            [token.user_id, token.token],
            function(err, r) {
              if (err) console.error(err);
              done();
              var auth = {
                auth: {
                  api_key: "key-2b85bb3479d8d1da8bfe1b9ef556aab6",
                  domain: "sandboxa38371f16a98467998b4ef540213a303.mailgun.org"
                }
              };
              var transporter = nodemailer.createTransport(mg(auth));

              var mailOptions = {
                from: "no-reply@ibar.com",
                to: req.body.email,
                subject: "Verify your account",
                text:
                  "Hello,\n\n" +
                  "Please verify your account by clicking the link: \nhttp://" +
                  req.headers.host +
                  "/confirmation/" +
                  token.token +
                  ".\n"
              };
              transporter.sendMail(mailOptions, function(error, info) {
                if (error) {
                  console.log(error);
                         var errArr =[];
                         var msg={
                          msg:"There was an error sending the email"
                         }
                         errArr.push(msg);
                } else {
                  console.log("Email sent: " + info.messageId);
                  res.json({
                    success: true,
                    msg: "A confirmation email has been sent"
                  });
                }
              });
            }
          );
        }
      });
    });
  }
];

module.exports.updateUser = [
  body("name", "Must be at least 4 characters").isLength({ min: 4 }),
  body("email", "Must be a vaild email")
    .isEmail()
    .trim()
    .normalizeEmail(),
  body("phoneNumber").custom(value=>{
    return new Promise((resolve,reject)=>{
      const parsed = phoneUtil.parse(value,'SO')
         resolve(phoneUtil.isValidNumber(parsed )) 
      
    })

  }).withMessage('Phone number must be of from the Somali region'),
  body("location")
    .exists()
    .custom((value, { req }) => {
      return new Promise((reject,resolve)=>{
     if (value.longtitude > 180 || value.longtitude < -180) {
        console.log("wrong");
        return false;
      }
      if (value.latitude > 90 || value.latitude < -90) {
        console.log("wrong");
        return false
      }
      else{
        return true;
      }
      }).withMessage('Location must be valid longtitude and latitude')

    }),
  passport.authenticate("jwt", { session: false }),

 async function(req, res, next) {
    var errors = validationResult(req);
    let subjects = req.body.subjects;

    if (!errors.isEmpty) {
      res.json({ success: false, msg: errors.array() });
    }
    const parsed = phoneUtil.parse(req.body.phoneNumber,'SO')
 
    const phone_number=phoneUtil.format(parsed,pnf.NATIONAL)
    pool.connect(function(err, client, done) {
      if (err) return console.error("there was an error", err);
      client.query(
        "UPDATE  users SET name= $1, phone_number=$2 where id=$3;",
        [req.body.name, phone_number, req.user.id],
        function(err, s) {
          if (err) console.error(err);
          if(req.user.role=="mentors"){
          client.query(
            `UPDATE mentors SET location= ST_SetSRID(ST_MakePoint($1, $2),4326), 
            city_name= $3, subjects= $4,about=$5, imageurl = $6,
             lng=$7, lat=$8
              
              where  user_id =$9 RETURNING id, city_name,subjects;`,
            [
              req.body.location.longtitude,
              req.body.location.latitude,
              req.body.city_name,
              subjects,
              req.body.about,
              req.body.imageurl,
              req.body.lng,
              req.body.lat,
              req.user.id
            ],
            function(err, results) {
                  done();
                  if (err) {
                    console.error(err);
                    res.json({ success: false, msg: "There was an error" });
                  } else {
                    var user = {
                      name: req.body.name,
                      email: req.body.email,
                      phoneNumber: req.body.phoneNumber,
                      city_name: req.body.city_name
                    };
                    res.json({
                      success: true,
                      msg: "information updated successfully",
                      user: results.rows[0]
                    });
                  }
                }
              );            

          }



              // console.log(JSON.parse(subjects))


            }
          );
        })
      }
];

module.exports.findNearMentor = [
  function(req, res, next) {
    var lng = parseFloat(req.query.lng);
    var lat = parseFloat(req.query.lat);
    var subject = req.query.subject;

    pool.connect(function(err, client, done) {
      if (subject) {
        let query = `SELECT * FROM mentors
        inner join users on users.id = mentors.user_id

             
              WHERE ST_DWithin(mentors.location, ST_SetSRID(ST_MakePoint($1, $2),4326),10000)
             AND $3= ANY(mentors.subjects)`;
        console.log(subject);
        client.query(query, [lng, lat, subject], function(err, results) {
          done();
          if (err) console.error("error in q", err);
          if (results.rows.length > 0) {
            res.json({ success: true, res: results.rows });
          } else {
            res.json({ success: false, res: "no" });
          }
        });
      } else {
          var wkt = 'POINT('|lng||','+lat||')';
        let query = `SELECT * FROM mentors  inner join users on users.id = mentors.user_id  
         WHERE ST_DWithin(mentors.location, ST_SetSRID(ST_MakePoint($1, $2),4326),10000);`;
        console.log("no");
        client.query(query, [lng,lat], function(err, results) {
          done();
          if (err) console.error("error in q", err);
          if (results.rows.length > 0) {
            res.json({ success: true, res: results.rows });
          } else {
            res.json({ success: false, msg: "No nearby mentors" });
          }
        });
      }

      if (err) console.error(err);
    });
  }
];

module.exports.getMentorDetail = [
  param("id", "Must be a valid id").isInt(),

  function(req, res, next) {
    pool.connect(function(err, client, done) {
      var id = req.params.id;
      if (err) throw err;
      client.query(
        `SELECT * FROM mentors
        inner join users on users.id = mentors.user_id
         WHERE mentors.user_id = $1
       ;
        `,
        [id],
        function(err, results) {
          done();
          if (err) throw err;
          if (results.rows.length > 0) {
            res.json({ success: true, user: results.rows[0] });
          } else {
            res.json({ success: false, msg: "No mentor found with that id" });
          }
        }
      );
    });
  }
];

module.exports.hireMentor = [
  passport.authenticate("jwt", { session: false }),
  function(req, res, next) {
    var mentor_id = req.body.id;
    var student_id = req.user.id;

    pool.connect(function(err, client, done) {
      if (err) throw err;
     if(req.user.role == 'students'){
      client.query(
        `SELECT name FROM users where id = $1`,
        [mentor_id],
        function(err, users) {
          if (err) throw err;
          if (users.rows.length > 0) {
            const sid = users.rows[0].id;
            console.log(users.rows[0])
            const m_name = users.rows[0].name;
            client.query(
              `INSERT INTO jobs(mentor_id,student_id,mentor_name,student_name) VALUES($1,$2,$3,$4)`,
              [mentor_id, student_id, m_name, req.user.name],

              function(err, result) {
                done();
                if (err) throw err;
                res.json({ success: true, msg: "JOb added" });
              }
            );
          } else {
            res.json({ success: false, msg: "Not mentor with that id" });
          }
        }
      );

     }else {res.json({success:false,msg:"Only students can hire mentors"})} 
    });
  }
];

module.exports.getHistory = [
  passport.authenticate("jwt", { session: false }),
  function(req, res, next) {
    console.log(req.user.role)

    pool.connect(function(err, client, done) {
      if (err) throw err;
      let id;
      let role 
      if(req.user.role=='mentors'){
        id ='mentor_id';
        role = 'mentors'
      }
      else {
        id = 'student_id';
        role = 'students'

      }

      client.query(`select id from users where id =$1`,[req.user.id],function(err,ids){
        if(err) return console.error('err',err)
          const uid = ids.rows[0].id;
       client.query(`SELECT * FROM jobs WHERE   ${id} = $1`, 
        [req.user.id], function(
        err,
        job
      ) {
        done();
        if (job.rows.length > 0) {
          console.log(job.rows)
          res.json({ success: true, job: job.rows });
        } else {
          console.log('bo')
          res.json({ success: false, msg: "No job associated with this id" });
        }
      });

      })

    });
  }
];

var upload = multer({ dest: "uploads/" }).single("image");
module.exports.uploadImage = [
passport.authenticate('jwt', {session:false}),
  function(req, res, next) {
    upload(req, res, function(err) {
      cloudinary.config({
        cloud_name: process.env.CLOUD_NAME,
        api_key: process.env.API_KEY,
        api_secret: process.env.API_SECRET
      });

      cloudinary.v2.uploader.upload(
        req.file.path,
        {
          public_id: "mentome/" + req.user.id,
          invalidate: true,
          overwrite: true
        },
        function(err, result) {
          if (err) {
            res.json({
              success: false,
              msg: err
            });
            console.log(result)
          } else {
            pool.connect(function(err, client, done) {
              if (err) throw err;
              client.query(
                `UPDATE mentors SET imageurl = $1 WHERE user_id = $2`,
                [result.url,req.user.id],
                function(err, _r) {
                  done();
                  if (err) throw err;
                  res.json({ success: true, url: result.url });
                }
              );
            });
          }
        }
      );
    });
  }
];

module.exports.getProfile = [
passport.authenticate('jwt',{session:false}),
function(req,res,next){
  let role;


  pool.connect(function(err, client,done){

    if(err){
      console.log(err)
    }
      if (req.user.role=='mentors'){

    const query = `SELECT *
     from users
     inner join mentors on user_id = $1
      where users.id = $1`;
    client.query(query,[req.user.id],function(err, results){
      done();
        if(err){
          console.log(err);
          res.end();
        }

        res.json({success:true, user:results.rows[0]})
      })
  }
  else {
    const query = `SELECT * from users where id = $1`;
    client.query(query,[req.user.id],function(err, results){
      done();
        if(err){
          console.log(err);
          res.end();
        }

        res.json({success:true, user:results.rows[0]})
      })
  }



  })
}

]

module.exports.passwordReset = [
body("email").isEmail().trim().normalizeEmail(),
async function(req,res,next){
  const em = await emailToLowerCase(req.body.email)
  pool.connect(function(err, client,done){
    if (err) return console.error("err connection",err);
 
    client.query('SELECT email, id from users where email = $1',[em],function(err,results){
      if(err)return console.error("err during quer",err);
      if(results.rows.length>0){
                var token = {
                  user_id: results.rows[0].id,
                  token: crypto.randomBytes(8).toString("hex")
                };

                client.query('UPDATE  users  SET password_reset_token = $1 where email = $2',[token.token,req.body.email],function(err,_t){
                  done();
                                      var auth = {
                      auth: {
                        api_key: "key-2b85bb3479d8d1da8bfe1b9ef556aab6",
                        domain:
                          "sandboxa38371f16a98467998b4ef540213a303.mailgun.org"
                      }
                    };
                    var transporter = nodemailer.createTransport(mg(auth));

                    var mailOptions = {
                      from: "no-reply@ibar.com",
                      to: em,
                      subject: "Verify your account",
                      text:
                        "Hello,\n\n" +
                        "copy and paste the token below:"+
                        '\n'+
                        
                        token.token +
                        ".\n"
                    };
                    transporter.sendMail(mailOptions, function(error, info) {
                      if (error) {
                         console.error(error);
                         var errArr =[];
                         var msg={
                          msg:"There was an error sending the email"
                         }
                         errArr.push(msg);

                       
                      } else {
                        console.log("Email sent: " + info.messageId);
                        res.json({
                          success: true,
                          msg: "An email was sent to you"
                        });
                      }
                    });


                })
      }
    })
  })
}


]
module.exports.passwordConfirmation= function(req,res,next){
  pool.connect(function(err,client,done){
    if(err)return console.error(err);
    client.query('SELECT * from users where password_reset_token = $1',[req.body.token],function(err,results){
      done();
      if(err)return console.error(err);
      console.log(results.rows)

      if(results.rows.length>0){

        const user = results.rows[0]
        const token = jwt.sign({ data: user }, process.env.DB_SECRET, {
            expiresIn: 6040800
          });
          res.json({success:true, token:"JWT "+token, user:user})
 
      }
      else{
        res.json({success:false,msg:"token does not match try resending "})
      }
    })
  })
}

module.exports.updatePassword = [

body('password',"Password must be at least 8 characters long").isLength({min:8}),
passport.authenticate('jwt',{session:false}),

function(req,res,next){
  pool.connect( async function(err,client,done){
    if(err)return console.error(err);
    let password = await hashPassword(req.body.password);
    client.query('UPDATE users set password = $1 where email = $2',[password,req.user.email],function(err,result){
      if(err) console.error(err);
      client.query('update users set password_reset_token= NULL where id = $1',[req.user.id],function(err, _r){
        done();
        if (err) console.log("errr",err);
         res.json({success:true, msg: 'password updated'})
      })
     
    });
  })
}

]

module.exports.authenticateStudent=[

body("email", "Must be a valid email")
    .isEmail()
    .trim()
    .normalizeEmail(),

 async function(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.json({ success: false, msg: errors.array() });
    }
    const email = await emailToLowerCase(req.body.email)
    const query = "SELECT * FROM users WHERE email = $1 AND is_verified =$2 AND role=$3";

    pool.connect(async function(err, client, done) {
      if (err) {
        return console.error("error fetching", err);
      }

   client.query(query, [req.body.email, true,'students'],async function(err,results){
     done();
        if (results.rows.length > 0) {
        const user = results.rows[0];
        console.log(user);
        let isMatch = await bcrypt.compare(req.body.password, user.password);
        if (isMatch) {
          const token = jwt.sign({ data: user }, process.env.DB_SECRET, {
            expiresIn: 6040800
          });

          res.json({ success: true, token: "JWT " + token, user: user });
        } else if (!isMatch) {
          res.json({ success: false, msg: "Email or password are incorrect" });
        }
      } else {
        res.json({ success: false, msg: "Email or password are incorrect" });
      }

   });
  
    });
  }



]