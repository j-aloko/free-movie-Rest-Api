const router = require("express").Router();
const User = require("../Models/User");
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");

//REGISTER USERS API

router.post("/register", async (req, res) => {
  const newUser = new User({
    username: req.body.username,
    email: req.body.email,
    password: CryptoJS.AES.encrypt(
      req.body.password,
      process.env.PASS_SEC
    ).toString(),
  });

  try {
    const user = await newUser.save();
    const { password, ...others } = user._doc;
    res.status(200).json(others);
  } catch (error) {
    res.status(500).json(error);
  }
});

//LOGIN API

router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    !user && res.status(401).json("Wrong password or username");

    const bytes = CryptoJS.AES.decrypt(user.password, process.env.PASS_SEC);
    const originalPassword = bytes.toString(CryptoJS.enc.Utf8);

    originalPassword !== req.body.password &&
      res.status(401).json("Wrong password or username");

    accessToken = jwt.sign(
      {
        id: user._id,
        isAdmin: user.isAdmin,
      },
      process.env.JWT_SEC_KEY,
      { expiresIn: "2d" }
    );

    const { password, ...info } = user._doc;
    res.status(200).json({ ...info, accessToken });
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
