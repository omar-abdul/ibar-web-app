var express = require("express");
var router = express.Router();
const passport = require("passport");

const tokenController = require('../components/token/tokenController');

const { body, validationResult } = require("express-validator/check");
const Controller = require("../components/user/userController");

router.post("/register",Controller.registerHandler);
router.post("/authenticate", Controller.loginHandler);
router.post("/resend-token", tokenController.resendToken);
router.put("/update", Controller.updateUserHandler);
router.get("/history", Controller.jobHistoryHandler);
router.put("/update/image", Controller.uploadImageHandler);
router.post("/forgot-password", Controller.passwordResetHandler);
router.post("/account/password-reset", Controller.passConfirmationHandler);
router.post("/hire", Controller.addJobHandler);
router.post("/authenticate-student", Controller.studentLoginHandler);
router.post("/update-password", Controller.updatePasswordHandler);
router.post("/profile",Controller.profileHandler);







module.exports = router;
