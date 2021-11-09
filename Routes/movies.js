const router = require("express").Router();
const Movies = require("../Models/Movies");
const { verifyAdmin, authToken } = require("../Verification");

//CREATING & POSTING A MOVIE

router.post("/", verifyAdmin, async (req, res) => {
  const newMovie = new Movies(req.body);
  try {
    const movie = await newMovie.save();
    res.status(200).json(movie);
  } catch (error) {
    res.status(500).json(error);
  }
});

//UPDATING MOVIES

router.put("/:id", verifyAdmin, async (req, res) => {
  try {
    const updatedMovie = await Movies.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    const movie = await updatedMovie.save();
    res.status(200).json(movie);
  } catch (error) {
    res.status(500).json(error);
  }
});

//DELETING MOVIES
router.delete("/:id", verifyAdmin, async (req, res) => {
  try {
    await Movies.findByIdAndDelete(req.params.id);
    res.status(200).json("Movie deleted Successfully");
  } catch (error) {
    res.status(500).json(error);
  }
});

//GET SINGLE MOVIE
router.get("/find/:id", authToken, async (req, res) => {
  try {
    const movie = await Movies.findById(req.params.id);
    res.status(200).json(movie);
  } catch (error) {
    res.status(500).json(error);
  }
});

//GET RANDOM MOVIES PER TYPE

router.get("/random", authToken, async (req, res) => {
  const type = req.query.type;
  let movies;
  try {
    if (type === "series") {
      movies = await Movies.aggregate([
        {
          $match: { isSeries: true },
        },
        {
          $sample: { size: 1 },
        },
      ]);
    } else {
      movies = await Movies.aggregate([
        {
          $match: { isSeries: false },
        },
        {
          $sample: { size: 1 },
        },
      ]);
    }
    res.status(200).json(movies);
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
