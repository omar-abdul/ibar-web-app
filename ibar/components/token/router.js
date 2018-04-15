var express = require("express");
var router = express.Router();
const passport = require("passport");



const { body, validationResult } = require("express-validator/check");
const Controller = require('./tokenController');



router.get("/confirmation/:token", Controller.confirmationToken);
router.post("/resend-token", Controller.resendToken);

module.exports = router;