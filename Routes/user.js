const router = require("express").Router();
const User = require("../Models/User");
const { verifyUser, verifyAdmin } = require("../Verification");

//UPDATE USER

router.put("/:id", verifyUser, async (req, res) => {
  if (req.body.password) {
    req.body.password = CryptoJS.AES.encrypt(
      req.body.password,
      process.env.PASS_SEC
    ).toString();
  }
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );

    const user = await updatedUser.save();
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json(error);
  }
});

//DELETING USER ACCOUNT

router.delete("/:id", verifyUser, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json("Your Account has been deleted Successfully");
  } catch (error) {
    res.status(500).json(error);
  }
});

//GET A SINGLE USER
router.get("/find/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    const { password, ...others } = user._doc;
    res.status(200).json(others);
  } catch (error) {
    res.status(500).json(error);
  }
});

//GET ALL USERS
router.get("/", verifyAdmin, async (req, res) => {
  try {
    const query = req.query.new;
    const users = query
      ? await User.find().sort({ id: -1 }).limit(5)
      : await User.find();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json(err);
  }
});

//GET USERS STATS PER MONTH
router.get("/stats", verifyAdmin, async (req, res) => {
  const today = new Date();
  const lastYear = today.setFullYear(today.setFullYear() - 1);

  //create a month array
  const monthsArray = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  try {
    const data = await User.aggregate([
      {
        $project: {
          month: { $month: "$createdAt" },
        },
      },
      {
        $group: {
          _id: "$month",
          total: { $sum: 1 },
        },
      },
    ]);

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
