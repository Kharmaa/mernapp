const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const HttpError = require("../models/http-error");
const User = require("../models/user");

require("dotenv").config();

const getMe = async (req, res, next) => {
  if (!req.userData?.userId) {
    return next(new HttpError("Ei oikeuksia", 401));
  }

  let user;
  try {
    user = await User.findById(req.userData.userId).select(
      "name email workouts",
    );
  } catch (err) {
    return next(new HttpError("Käyttäjän haku epäonnistui", 500));
  }

  if (!user) {
    return next(new HttpError("Käyttäjää ei löytynyt", 404));
  }

  res.json({
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      workoutsCount: user.workouts.length,
    },
  });
};

//Rekisteröinti
const signUp = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpError("Tarkista syötteesi", 422));
  }

  const { name, email, password } = req.body;

  let thisUser;
  try {
    thisUser = await User.findOne({ email });
  } catch (err) {
    return next(new HttpError("Sisäänkirjaus epäonnistui", 500));
  }

  if (thisUser) {
    return next(new HttpError("Käyttäjä on jo rekisteröitynyt", 422));
  }

  let hashPassword;
  try {
    hashPassword = await bcrypt.hash(password, 12);
  } catch (err) {
    return next(
      new HttpError("Käyttäjää ei voitu luoda, yritä uudelleen.", 500),
    );
  }

  const createdUser = new User({
    name,
    email,
    password: hashPassword,
    workouts: [],
  });

  try {
    await createdUser.save();
  } catch (err) {
    if (err.code === 11000) {
      return next(new HttpError("Sähköposti on jo käytössä", 422));
    }
    console.error("SAVE ERROR:", err);
    return next(new HttpError("Käyttäjän luonti epäonnistui", 500));
  }

  let token;
  try {
    token = jwt.sign(
      { userId: createdUser.id, email: createdUser.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" },
    );
  } catch (err) {
    return next(new HttpError("Käyttäjän luonti epäonnistui", 500));
  }

  res.status(201).json({
    userId: createdUser.id,
    email: createdUser.email,
    token: token,
    user: {
      id: createdUser.id,
      name: createdUser.name,
      email: createdUser.email,
    },
  });
};

//Sisäänkirjaus
const logIn = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpError("Tarkista syötteesi", 422));
  }

  const { email, password } = req.body;

  let thisUser;
  try {
    thisUser = await User.findOne({ email });
  } catch (err) {
    return next(new HttpError("Kirjautuminen epäonnistui", 500));
  }

  if (!thisUser) {
    return next(
      new HttpError(
        "Kirjautuminen epäonnostui. Väärä sähköposti tai salasana",
        401,
      ),
    );
  }

  let validPassword = false;
  try {
    validPassword = await bcrypt.compare(password, thisUser.password);
  } catch (err) {
    return next(
      new HttpError(
        "Sisäänkirjaus epäonnistui. Tarkista syötteesi ja yritä uduelleen",
        500,
      ),
    );
  }

  if (!validPassword) {
    return next(
      new HttpError(
        "Kirjautuminen epäonnostui. Väärä sähköposti tai salasana",
        401,
      ),
    );
  }

  let token;
  try {
    token = jwt.sign(
      { userId: thisUser.id, email: thisUser.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" },
    );
  } catch (err) {
    return next(new HttpError("Kirjautuminen epäonnistui", 500));
  }

  res.json({
    userId: thisUser.id,
    email: thisUser.email,
    token: token,
    user: {
      id: thisUser.id,
      name: thisUser.name,
      email: thisUser.email,
    },
  });
};

exports.signUp = signUp;
exports.logIn = logIn;
exports.getMe = getMe;
