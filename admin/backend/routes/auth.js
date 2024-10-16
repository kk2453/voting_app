const express = require("express");
const router = express.Router();
const User = require("../models/User.js");
const { body, validationResult } = require("express-validator");
var bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");
const fetchuser = require("../middleware/fetchuser.js");

router.post(
  "/createuser",
  [
    body("name", "enter the valid name").isLength({ min: 3 }),
    body("email", "enter the valid email").isEmail(),
    body("aadharNumber", "enter the valid aadharNumber").isLength({ min: 9 }),
    body("password", "enter the valid password").isLength({ min: 3 }),
  ],
  async (req, res) => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      success = false;
      return res.json({ success, errors: result.array() });
    }
    try {
      let user = await User.findOne({ email: req.body.email });
      if (user) {
        return res.json({
          success: false,
          error: "please enter a unique value for email",
        });
      }
      let aaaa = await User.findOne({ aadharNumber: req.body.aadharNumber });
      if (aaaa) {
        return res.json({
          success: false,
          error: "please enter a unique value for aadharNumber",
        });
      }

      const salt = await bcrypt.genSaltSync(10);
      const secPass = await bcrypt.hash(req.body.password, salt);

      user = await User.create({
        name: req.body.name,
        email: req.body.email,
        aadharNumber: req.body.aadharNumber,
        password: secPass,
        isvoted: req.body.isvoted,
      });
      /*.then(res.send(req.body))
      .catch(err=>{console.log(err)
        res.json({error:"please enter a unique value for email",message:err.message})
      })*/
      console.log(req.body);
      const data = {
        user: {
          id: user.id,
        },
      };
      var token = jwt.sign(data, "shhhhh");
      success = true;
      res.json({ success, token });
    } catch (error) {
      console.error(error.message);
      success = false;
      res.status(500).send(success, "some error occured");
    }
  }
);

router.post(
  "/login",
  [
    body("email", "enter the valid email").isEmail(),
    body("aadharNumber", "enter the valid email").exists(),
    body("password", "password cannot be blank").exists(),
  ],
  async (req, res) => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      success = false;
      return res.status(400).json({ success, errors: result.array() });
    }

    try {
      const { email, password } = req.body;
      let user = await User.findOne({ email: email });
      let aaaa = await User.findOne({ aadharNumber: req.body.aadharNumber });
      if (!aaaa) {
        success = false;
        return res.json({
          success,
          error: "please try to login with correct credentials",
        });
      }
      if (!user) {
        success = false;
        return res.json({
          success,
          error: "please try to login with correct credentials",
        });
      }
      const passwordCompare = await bcrypt.compare(password, user.password);
      if (!passwordCompare) {
        success = false;
        return res.json({
          success,
          error: "please try to login with correct credentials",
        });
      }
      if (user.isvoted === true) {
        success = false;
        success1 = false;
        return res.status(200).json({success,success1,error: "User with this id is already voted" });
      }
      const data={
        user:{
          id:user.id
        }
       }
      var token = jwt.sign(data, "shhhhh");
      success = true;
      res.json({ success, token });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("some error occured");
    }
  }
);
router.post('/getuser',fetchuser,async(req,res)=>{

  try {
    userId=req.user.id;
    const user=await User.findById(userId).select("-password");
    res.send(user)
  } catch (error) {
      console.error(error.message)
      res.status(500).send("some error occured")
  }
  
})

router.put("/updateuser/:id",async (req, res) => {
  try {
    const { name, email, aadharNumber, isvoted } = req.body;
    const newNote = {};
    if (name) {
      newNote.name = name;
    }
    if (email) {
      newNote.email = email;
    }
    if (aadharNumber) {
      newNote.aadharNumber = aadharNumber;
    }
    if (isvoted) {
      newNote.isvoted = isvoted;
    }

    let user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).send("please use the correct credentials");
    }

    /*if (user.user.toString() !== req.user.id) {
      return res.status(401).send("Not allowed");
    }*/

    user = await User.findByIdAndUpdate(
      req.params.id,
      { $set: newNote },
      { new: true }
    );
    res.json({ user });
    console.log(newNote);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("some error occured");
  }
});

module.exports = router;
