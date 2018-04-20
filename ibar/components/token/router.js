var express = require("express");
var router = express.Router();

const Controller = require('./tokenController');



router.get("/confirmation/:token", Controller.confirmationToken);
router.post("/resend-token", Controller.resendToken);

module.exports = router;