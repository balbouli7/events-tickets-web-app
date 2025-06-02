const express =require("express")
const { userRegister, userLogin, verifyUser, resetPassword, forgetPassword, updatePassword } = require("../controllers/authControllers");
const { upload } = require("../config/cloudinary");
const { verifyToken } = require("../middlewares/authMiddleware");
const router=express.Router()

router.post("/register", upload.single("profileImage"), userRegister);
router.post('/login',userLogin)
router.post('/verify',verifyUser)
router.post('/forgetpassword',forgetPassword)
router.post('/resetpassword/:token',resetPassword)
router.put('/updatePassword',verifyToken,updatePassword)
module.exports=router