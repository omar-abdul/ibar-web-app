var express = require("express") 
var router = express.Router() 
const Controller = require("./userController") 

router.post("/register", Controller.registerHandler) 
router.post("/authenticate", Controller.loginHandler) 
router.get("/profile", Controller.profileHandler) 
router.put("/update", Controller.updateUserHandler) 
router.put("/update/image", Controller.uploadImageHandler) 
router.post("/forgot-password", Controller.passwordResetHandler) 
router.post("/account/password-reset", Controller.passConfirmationHandler) 
router.post("/authenticate-student", Controller.studentLoginHandler)
router.post("/update-password", Controller.updatePasswordHandler)
router.delete("/delete/image",Controller.deleteImage)

router.get("/logout",Controller.logOutHandler)

router.get("/refresh-token", Controller.reauthenticateMiddleware)

router.get("/subjects", Controller.subjectHandler)

module.exports = router
