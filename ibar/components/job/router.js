var express = require("express");
var router = express.Router();
const passport = require("passport");

const Controller = require("./jobContorller");


router.get("/history", Controller.jobHistoryHandler);
router.post("/hire", Controller.addJobHandler);



module.exports = router;
