const jwt = require("jsonwebtoken");

//Authenticating TOKEN

const authToken = (req, res, next) => {
  const authHeader = req.headers.token;
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    jwt.verify(token, process.env.JWT_SEC_KEY, (error, user) => {
      if (error) {
        return res.status(404).json("Token is not valid");
      } else {
        req.user = user;
        next();
      }
    });
  } else {
    return res.status(500).json("You are not authenticated");
  }
};

//VERIFYING USER

const verifyUser = (req, res, next) => {
  authToken(req, res, () => {
    if (req.user.id === req.params.id || req.user.isAdmin) {
      next();
    } else {
      return res.status(404).json("You are not verified");
    }
  });
};

//VERIFYING ADMIN

const verifyAdmin = (req, res, next) => {
  authToken(req, res, () => {
    if (req.user.isAdmin) {
      next();
    } else {
      return res.status(404).json("Denied! Admin Access only");
    }
  });
};

module.exports = { authToken, verifyUser, verifyAdmin };
