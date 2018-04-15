var express = require("express");
var router = express.Router();
const Controller = require("./mentorController");




router.get("/find-mentors", Controller.findMentorHandler);
router.get("/mentor/:id", Controller.mentorDetailHandler);


module.exports = router