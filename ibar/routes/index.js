var express = require("express");
var router = express.Router();
var Util = require("../controller/util");
const  passport =  require("passport");
const { body, validationResult } = require('express-validator/check');
const userController = require('../controller/userController');

router.post("/register", userController.registerController);
router.post("/authenticate",userController.authenticateUser);
router.get('/profile',userController.getProfile)
router.get('/confirmation/:token',userController.confirmationToken);
router.post("/resend-token",userController.resendToken);
router.put('/update',userController.updateUser)
router.get('/find-mentors',userController.findNearMentor);
router.get("/mentor/:id",userController.getMentorDetail);
router.get('/history',userController.getHistory);
router.put('/update/image',userController.uploadImage);
router.post('/forgot-password',userController.passwordReset);
router.post('/account/password-reset',userController.passwordConfirmation);
router.post('/hire',userController.hireMentor);
router.post('/authenticate-student',userController.authenticateStudent);
router.post('/update-password',userController.updatePassword)
module.exports = router;
