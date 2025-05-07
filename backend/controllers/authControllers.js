require("dotenv").config();
const User = require("../models/user")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const otpGenerator = require('otp-generator')
const nodemailer = require('nodemailer')
const { upload, cloudinary } = require("../config/cloudinary");
let otpStorage = {}
//user register
exports.userRegister = async (req, res) => {
  try {
      const { email, password, firstName, lastName, mobile, confirmPassword, address } = req.body;

      if (!email || !password || !confirmPassword || !firstName || !lastName || !mobile || !address) {
          return res.status(400).json({ error: "All fields are required." });
      }

      if (password !== confirmPassword) {
          return res.status(400).json({ error: "Passwords do not match." });
      }

      const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
      if (!passwordPattern.test(password)) {
          return res.status(400).json({ error: "Password must contain at least one uppercase letter, one lowercase letter, and be at least 8 characters long." });
      }

      const emailExists = await User.findOne({ email });
      if (emailExists) {
          return res.status(400).json({ error: "Email already exists." });
      }

      const mobileExists = await User.findOne({ mobile });
      if (mobileExists) {
          return res.status(400).json({ error: "Mobile number already exists." });
      }

      let profileImageUrl = "/uploads/default-profile.png";
      if (req.file) {
          const result = await cloudinary.uploader.upload(req.file.path, {
              folder: "profile_images",
          });
          profileImageUrl = result.secure_url;
      }

      const newUser = new User({
          email,
          password,
          firstName,
          lastName,
          mobile,
          address,
          profileImage: profileImageUrl
      });

      const savedUser = await newUser.save();
      const normalizedEmail = email.toLowerCase();
      const generatedOTP = otpGenerator.generate(6, {
          lowerCaseAlphabets: false,
          upperCaseAlphabets: false,
          specialChars: false
      });

      otpStorage[normalizedEmail] = { otp: generatedOTP, timestamp: Date.now() };

      const transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
              user: process.env.EMAIL,
              pass: process.env.passwordEmail
          }
      });

      const mailOptions = {
          from: process.env.EMAIL,
          to: email,
          subject: "Account verification",
          text: `Your verification code is: ${generatedOTP}`
      };

      transporter.sendMail(mailOptions);

      res.status(201).json({ message: "Email with verification code sent", user: savedUser });
  } catch (err) {
      res.status(500).json({ error: err.message });
  }
};

  //user verification
  exports.verifyUser = async (req, res) => {
    try {
      const { verifyCode, email } = req.body;
      const normalizedEmail = email.toLowerCase();  
  
      const storedOTPData = otpStorage[normalizedEmail];
      if (!storedOTPData || storedOTPData.otp !== verifyCode) {
  
        return res.status(400).json({ message: "Wrong verification code." });
      }
  
      await User.findOneAndUpdate({ email: normalizedEmail }, { isVerified: true });
      delete otpStorage[normalizedEmail];  
      return res.status(200).json({ message: "Account verified" });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  };
  
//user login
exports.userLogin = async (req, res) => {
  try {
    const { identifier, password } = req.body

    if (!identifier || !password) {
      return res.status(400).json({ error: "Please provide email/mobile and password" })
    }
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    const mobilePattern = /^(\+216)?[0-9]{8}$/; 

    let query = {};
    if (emailPattern.test(identifier)) {
      query.email = identifier
    } else if (mobilePattern.test(identifier)) {
      query.mobile = identifier
    } else {
      return res.status(400).json({ error: "Invalid email or mobile number format." })
    }
    const user = await User.findOne(query)
    if (!user) {
      return res.status(400).json({ error: "User not found" })
    }
    if (user.isVerified!==true) {
      return res.status(400).json({ error: "Please verify your account before logging in." })
  }
    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
      return res.status(400).json({ error: "Incorrect password" })
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    )
    return res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        email: user.email,
        mobile: user.mobile,
        role: user.role,
      },
    })
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
}

//forget password

exports.forgetPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "15m" });

    // Store email in session for further use
    // req.session.resetEmail = email; // Make sure the session middleware is initialized

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.passwordEmail,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: "Reset Password",
      text: `Click here to reset your password: http://localhost:3000/resetpassword/${token}`,
    };

    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.error("Error sending email:", err);
        return res.status(500).json({ message: "Error sending reset email." });
      }
      res.status(200).json({ message: "Password reset email sent successfully." });
    });
  } catch (err) {
    console.error("Error in forgetPassword:", err);
    res.status(500).json({ message: err.message });
  }
};
//reset password
exports.resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    if (!decodedToken) {
      return res.status(400).json({ message: "Invalid or expired token." });
    }

    const { newPassword } = req.body;

    // Find user by decoded userId from the token
    const user = await User.findById(decodedToken.userId);

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Validate new password with regex
    const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
    if (!passwordPattern.test(newPassword)) {
      return res.status(400).json({
        message:
          "Password must contain at least one uppercase letter, one lowercase letter, and be at least 8 characters long.",
      });
    }

    // Update the user's password
    user.password = newPassword;
    user.confirmPassword = newPassword;
    await user.save();

    res.status(200).json({ message: "Password updated successfully." });
  } catch (err) {
    console.error("Error in resetPassword:", err);
    res.status(500).json({ message: err.message });
  }
};