const express = require("express");
const { check } = require("express-validator");

const workoutCtrls = require("../controllers/workout-controllers");
const checkAuth = require("../middleware/check-auth");

const router = express.Router();
router.use(checkAuth);

//Hae kaikki treeni
router.get("/", workoutCtrls.getMyWorkouts);

//Hae treenit userId:llä
router.get("/user/:uid", workoutCtrls.getWorkoutsByUserId);

//Hae yksi treeni id:llä
router.get("/:wid", workoutCtrls.getWorkoutById);

//Lisää uusi treeni
router.post(
  "/",
  [
    check("date").not().isEmpty().withMessage("Päivämäärä puuttuu"),
    check("type").not().isEmpty().isMongoId(),
    check("duration")
      .optional({ nullable: true, checkFalsy: true })
      .isInt({ min: 0 }),
    // check("creator").not().isEmpty(),
    check("description").optional().isString(),
  ],
  workoutCtrls.createWorkout,
);

//Muokkaa treeniä
router.patch(
  "/:wid",
  [
    check("date").optional().not().isEmpty(),
    check("type").optional().not().isEmpty().isMongoId(),
    check("duration")
      .optional({ nullable: true, checkFalsy: true })
      .isInt({ min: 0 }),

    check("description").optional().isString(),
  ],
  workoutCtrls.updateWorkout,
);

//Poista treeni
router.delete("/:wid", workoutCtrls.deleteWorkout);

module.exports = router;
