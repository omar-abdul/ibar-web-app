const {
    body,
    validationResult,
    param,
    query
  } = require("express-validator/check");
  const { sanitizeBody } = require("express-validator/filter");
  const passport = require("passport");
  
 
  const util = require("../../helper/util");


  const Comment = require('./commentModel');



module.exports.getCommentHandler =util.asynMiddleWare(
    async  function(req, res, next) {
        const id = req.params.id;
        const comments = await Comment.getComments(id)
            if (comments) {
              res.json({
                success: true,
                comments: comments
              });
            } else {
              res.json({
                success: false,
                msg: "No comments found"
              });
            }
          
    
      }
)
  
  
  module.exports.addCommentHandler = [
    passport.authenticate("jwt", {
      session: false
    }),
  util.asynMiddleWare(
    async function(req, res, next) {
        const rate = {
          student: req.user.id,
          mentor: req.body.mentor,
          num: req.body.stars
        };
    
        const result = await Comment.addRate(rate)
          
            const comment = {
              student: req.user.id,
              mentor: req.body.mentor,
              text: req.body.text,
              rateId: result.id
            };
           
    
            const addComment = await Comment.addComment(comment);
            if(addComment.rowCount >0){
              res.json({
                success:true
              })
            }
            else{
              res.json({
                success:false
              })
            }

          
          
  
      }
  )
  ];
  