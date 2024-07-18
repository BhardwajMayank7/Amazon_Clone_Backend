const jwt = require("jsonwebtoken");
const User = require("../models/userSchema");

// Ensure this key to be present inside .env
// to create this key use this command node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
const keysecret = process.env.KEY;

const authenticate = async (req, res, next) => {
  try {
    const token = req.cookies.eccomerce;

    if (!token) {
      throw new Error("Unauthorized: No token provided");
    }

    const verifyToken = jwt.verify(token, keysecret);

    const rootUser = await User.findOne({
      _id: verifyToken._id,
      "tokens.token": token,
    });

    if (!rootUser) {
      throw new Error("User Not Found");
    }

    req.token = token;
    req.rootUser = rootUser;
    req.userID = rootUser._id;

    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return res.status(401).send("Unauthorized: JWT token malformed");
    } else if (error.name === "TokenExpiredError") {
      return res.status(401).send("Unauthorized: JWT token expired");
    } else {
      return res.status(401).send("Unauthorized: No token provided");
    }
  }
};

module.exports = authenticate;
