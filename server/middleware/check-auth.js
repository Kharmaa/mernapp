const jwt = require("jsonwebtoken");
const HttpError = require("../models/http-error");

module.exports = (req, res, next) => {
  if (req.method === "OPTIONS") {
    return next();
  }

  try {
    const authHeader = req.headers.authorization; // "Bearer TOKEN"
    if (!authHeader) {
      return next(new HttpError("Autentikointi puuttuu", 401));
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      return next(new HttpError("Autentikointi epäonnistui", 401));
    }

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    req.userData = { userId: decodedToken.userId, email: decodedToken.email };

    return next();
  } catch (err) {
    return next(new HttpError("Autentikointi epäonnistui", 401));
  }
};
