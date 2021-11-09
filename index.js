const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const authRoute = require("./Routes/auth");
const userRoute = require("./Routes/user");
const movieRoute = require("./Routes/movies");
const listRoute = require("./Routes/lists");

const cors = require("cors");

dotenv.config();

app.listen(8888, () => {
  console.log("Server Running");
});

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("Mongo Server Connected");
  })
  .catch((error) => {
    console.log(error);
  });

app.use(express.json());
app.use(cors());
app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/movies", movieRoute);
app.use("/api/lists", listRoute);
