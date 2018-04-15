const {
    body,
    validationResult,
    param,
    query
  } = require("express-validator/check");
  const { sanitizeBody } = require("express-validator/filter");

  const passport = require("passport");
 
  
  const config = require("../../config/database");
  const User = require("../user/userModel");
  const Mentor = require("../mentor/mentorModel")
  const util = require("../../helper/util");
  const Job = require("./jobModel");
  



module.exports.addJobHandler = [
    passport.authenticate("jwt", {
      session: false
    }),
    util.asynMiddleWare(
        async function(req, res, next) {
 
            const userIds = {
              mentor_id: req.body.id,
              student_id:req.user.id
            };

        
            if (req.user.role === "students") {
 
                const result = await Job.addJob(userIds);
                if(result.rowCount>0){
                    res.json({ success: true, msg: "Mentor hired" })
                }
                

  
            } else {
              res.json({
                success: false,
                msg: "Only students can hire mentors"
              });
            }
          }
    )
    
  ];
  
  module.exports.jobHistoryHandler = [
    passport.authenticate("jwt", {
      session: false
    }),
    util.asynMiddleWare(
        async function(req, res, next) {
            const job = await Job.getJobByUserId(req.user);
              res.json({
                  success: true,
                  job: job
                });
          }
    )
    
  ];
  