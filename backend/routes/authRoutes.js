const express =require("express")
const { userRegister, userLogin, verifyUser, resetPassword, forgetPassword } = require("../controllers/authControllers");
const { upload } = require("../config/cloudinary");
const router=express.Router()

router.post("/register", upload.single("profileImage"), userRegister);
router.post('/login',userLogin)
router.post('/verify',verifyUser)
router.post('/forgetpassword',forgetPassword)
router.post('/resetpassword/:token',resetPassword)
module.exports=router