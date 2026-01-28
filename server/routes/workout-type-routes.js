const express = require("express");
const { check } = require("express-validator");

const checkAuth = require("../middleware/check-auth");
const typeCtrls = require("../controllers/workout-type-controllers");

const router = express.Router();

router.use(checkAuth);

router.get("/", typeCtrls.getMyTypes);

router.post(
  "/",
  [
    check("name").not().isEmpty().withMessage("Nimi puuttuu"),
    check("color").optional({ checkFalsy: true }).isString(),
    check("icon").optional({ checkFalsy: true }).isString(),
  ],
  typeCtrls.createType,
);

router.patch(
  "/:tid",
  [
    check("name").optional().not().isEmpty(),
    check("color").optional({ checkFalsy: true }).isString(),
    check("icon").optional({ checkFalsy: true }).isString(),
  ],
  typeCtrls.updateType,
);

router.delete("/:tid", typeCtrls.deleteType);

module.exports = router;
