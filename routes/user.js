const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const saltRounds = 10;
const {
  registration_val,
  login_val,
} = require("../validation/user_validation");
const { create_token, get_token_data, check_token } = require("./auth");
const User_schema = require("../schema/user_schema");
//const
router.post("/registration", async (req, res) => {
  const data = req.body;
  const { error } = registration_val({ data });
  if (error) {
    res.send({ error });
  } else {
    // data["role"] = "admin";
    const { password } = data;
    const hash_password = bcrypt.hashSync(password, saltRounds);
    data["password"] = hash_password;
    delete data["confirm_password"];
    const newUser = new User_schema(data);
    try {
      const response = await newUser.save();
      res.send({ user_data: response, success: true });
    } catch (error) {
      res.status(401).send(error);
    }
  }
});
router.post("/login", async (req, res) => {

  const { body } = req;
  const { error } = login_val({ data: body });
  if (error) {
    res.send({ error });
  } else {
    try {
      const { email, password } = body;
      const user_data = await User_schema.findOne({ email });
      if (user_data) {
        const { _id, role } = user_data;
        const isMatch = bcrypt.compareSync(password, user_data["password"]);
        if (isMatch) {
          const data = { email, _id, role };
          let token = create_token({ data });
          delete user_data["password"];
          res.send({ data: user_data, token });
        } else {
          res.status(401).send("invalid email or password");
        }
      } else {
        res.status(401).send("invalid email or password");
      }
    } catch (error) {
      res.send(error.message);
    }
  }
});



router.post("/forgotpassword", async (req, res) => {

  const { email: data } = req.body;

  try {
    // Find the user by email
    const user = await User_schema.findOne({ email: data });
    if (!user) {
      return res.status(404).send("User not found.");
    }

    // Generate a token for password reset

    let token = create_token({ data });
    
    // const resetLink = `http://localhost:3000/resetpassword/${token}`;
    
    const resetLink = `http://mysmartshop.s3-website.ap-south-1.amazonaws.com/resetpassword/${token}`;
    // Create transporter for sending email
    const transporter = nodemailer.createTransport({
      service: "gmail", // Your email provider
      auth: {
        user: process.env.EMAIL, // Gmail address
        pass: process.env.EMAIL_PASSWORD, // Gmail password or app password
      },
    });

    // Send the reset email
    await transporter.sendMail({
      from: process.env.EMAIL,
      to: data,
      subject: "Password Reset",
      html: `<p>Click <a href="${resetLink}">here</a> to reset your smartShop password.</p>`,
    });
    // Send success response
    res.send("Password reset link has been sent to your email.");
  } catch (error) {
    res.status(500).send("Error sending email.");
  }
});

router.post("/resetpassword", async (req, res) => {
  const { headers, body } = req;
  const {newPassword} = body ;
  const  email = get_token_data({ headers });
  try {
    // Extract email or user data from token
    const email = get_token_data({ headers });
        
    if (!email) {
      return res.status(400).json({ error: "Invalid token or email not found in token" });
    }
       
    // Hash the new password before storing it
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    // Update the user's password
    const result = await User_schema.updateOne({ email }, { $set: { password: hashedPassword } });
    if (result.nModified === 0) {
      return res.status(404).json({ error: "User not found or password is the same" });
    }

    res.status(200).json({ message: "Password updated successfully" });

  } catch (error) {
    res.status(500).json({ error: "An error occurred while resetting the password" });
  }
})



module.exports = router;
