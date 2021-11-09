const router = require("express").Router();
const Lists = require("../Models/Lists");
const { verifyAdmin, authToken } = require("../Verification");

//CREATING & POSTING A List

router.post("/", verifyAdmin, async (req, res) => {
  const newList = new Lists(req.body);
  try {
    const lists = await newList.save();
    res.status(200).json(lists);
  } catch (error) {
    res.status(500).json(error);
  }
});

//UPDATING Lists

router.put("/:id", verifyAdmin, async (req, res) => {
  try {
    const updatedList = await Lists.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    const list = await updatedList.save();
    res.status(200).json(list);
  } catch (error) {
    res.status(500).json(error);
  }
});

//DELETING List
router.delete("/:id", verifyAdmin, async (req, res) => {
  try {
    await Lists.findByIdAndDelete(req.params.id);
    res.status(200).json("List deleted Successfully");
  } catch (error) {
    res.status(500).json(error);
  }
});

//GET LIST
router.get("/", authToken, async (req, res) => {
  const typeQuery = req.query.type;
  const genreQuery = req.query.genre;
  let list = [];

  try {
    if (typeQuery) {
      if (genreQuery) {
        list = await Lists.aggregate([
          {
            $match: { type: typeQuery, genre: genreQuery },
          },
          {
            $sample: { size: 10 },
          },
        ]);
      } else {
        list = await Lists.aggregate([
          {
            $match: { type: typeQuery },
          },
          {
            $sample: { size: 10 },
          },
        ]);
      }
    } else {
      list = await Lists.aggregate([
        {
          $sample: { size: 10 },
        },
      ]);
    }
    res.status(200).json(list);
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
