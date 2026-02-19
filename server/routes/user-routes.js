const express = require("express");
const { check } = require("express-validator");
const checkAuth = require("../middleware/check-auth");
const userCtrls = require("../controllers/user-controllers");

const router = express.Router();

router.post(
  "/signup",
  [
    check("name")
      .trim()
      .not()
      .isEmpty()
      .matches(/^[^<>]*$/)
      .withMessage("Nimi ei saa sisältää HTML-tageja"),

    check("email").normalizeEmail().isEmail(),
    check("password").isLength({ min: 6 }),
  ],
  userCtrls.signUp,
);

router.post(
  "/login",
  [
    check("email").normalizeEmail().isEmail(),
    check("password").not().isEmpty(),
  ],
  userCtrls.logIn,
);

router.get("/me", checkAuth, userCtrls.getMe);

module.exports = router;
