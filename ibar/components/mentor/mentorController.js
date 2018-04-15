const {
    body,
    validationResult,
    param,
    query
  } = require("express-validator/check");
  const { sanitizeBody } = require("express-validator/filter");
  
 
  const util = require("../../helper/util");

  const User = require('../user/userModel');
  const Mentor = require('./mentorModel');


module.exports.findMentorHandler = [
    query("lng")
      .custom((value, { req }) => {
        if (value > 180 || value < -180) {
          return false;
        } else {
          return true;
        }
      })
      .withMessage("Location must be valid longtitude and latitude"),
    query("lat")
      .custom((value, { req }) => {
        if (value > 90 || value < -90) {
          return false;
        } else {
          return true;
        }
      })
      .withMessage("Location must be valid longtitude and latitude"),
      util.asynMiddleWare(
    async function(req, res, next) {
        var lng = req.query.lng;
        var lat = req.query.lat;
        var subject = req.query.subject;
        var errors = validationResult(req);
        if (!errors.isEmpty()) {
          res.json({
            success: false,
            res: errors.array()
          });
        } else {
          const mentors = await Mentor.findCloseMentor(lat, lng, subject);
          
          res.json({
            success: true,
            res: mentors
          });

        }
      })
    
  ];
  
  module.exports.mentorDetailHandler = [
    param("id", "Must be a valid id").isInt(),
    util.asynMiddleWare(
        async function(req, res, next) {
            var errors = validationResult(req);
            if (!errors.isEmpty()) {
              res.json({
                success: false,
                msg: errors.array()
              });
            } else {
             const id = req.params.id;
             const mentor= await Mentor.getMentorById(id)
                
                  if (mentor) {
                    res.status(200).json({
                      success: true,
                      user: mentor
                    });
                  } else {
                    res.status(200).json({
                      success: false,
                      msg: "No mentor found with that id"
                    });
                  }
                
            }
          }
    )
  
   
  ];