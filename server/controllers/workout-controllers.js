const { validationResult } = require("express-validator");
const mongoose = require("mongoose");
const HttpError = require("../models/http-error");
const Workout = require("../models/workout");
const User = require("../models/user");

// const Workout = require("../models/workout");

// const inUse = await Workout.exists({ user: req.userData.userId, type: tid });
// if (inUse) {
//   return next(new HttpError("Lajia ei voi poistaa, koska se on käytössä treeneissä.", 422));
// }

// Lista kaikista logatuista harjoituksista
const getMyWorkouts = async (req, res, next) => {
  let workouts;

  try {
    workouts = await Workout.find({ user: req.userData.userId }).sort({
      date: -1,
    });
  } catch (err) {
    return next(new HttpError("Harjoitusten haku epäonnistui", 500));
  }
  res.json({ workouts: workouts.map((w) => w.toObject({ getters: true })) });
};

//Kaikki treenit userId:llä
const getWorkoutsByUserId = async (req, res, next) => {
  const userId = req.params.uid;

  if (userId !== req.userData.userId) {
    return next(new HttpError("Ei valtuuksia", 403));
  }

  let workouts;
  try {
    workouts = await Workout.find({ user: req.userData.userId })
      .populate("type", "name color icon")
      .sort({ date: -1 });
  } catch (err) {
    return next(new HttpError("Treenien haku epäonnistui", 500));
  }

  res.json({ workouts: workouts.map((w) => w.toObject({ getters: true })) });
};

// Harjoitus Id:n perusteella
const getWorkoutById = async (req, res, next) => {
  const workoutId = req.params.wid;

  let workout;
  try {
    workout = await Workout.findById(workoutId).populate(
      "type",
      "name color icon",
    );
  } catch (err) {
    return next(new HttpError("Treenin haku epäonnistui", 500));
  }

  if (!workout) {
    return next(new HttpError("Treeniä ei löytynyt annetulla id:llä", 404));
  }

  // Omistajuus: vain oman treenin saa hakea
  if (workout.user.toString() !== req.userData.userId) {
    return next(new HttpError("Ei oikeuksia", 403));
  }

  res.json({ workout: workout.toObject({ getters: true }) });
};

// Uusi harjoitus
const createWorkout = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpError("Tarkista syötteesi", 422));
  }

  const { date, type, duration, description } = req.body;

  // creator tokenista
  const creator = req.userData?.userId;
  if (!creator) {
    return next(new HttpError("Ei oikeuksia", 401));
  }

  if (!date || !type) {
    return next(new HttpError("Tietoja puuttuu", 422));
  }

  const newWorkout = new Workout({
    date: new Date(date),
    type,
    duration:
      duration === undefined || duration === "" ? null : Number(duration),
    description: description || "",
    user: req.userData.userId,
  });

  let user;
  try {
    user = await User.findById(creator);
  } catch (err) {
    return next(new HttpError("Treenin lisäys epäonnistui", 500));
  }

  if (!user) {
    return next(new HttpError("Käyttäjää ei löytynyt", 404));
  }

  let sess;
  try {
    sess = await mongoose.startSession();
    sess.startTransaction();

    await newWorkout.save({ session: sess });
    user.workouts.push(newWorkout._id);
    await user.save({ session: sess });

    await sess.commitTransaction();
  } catch (err) {
    if (sess) {
      try {
        await sess.abortTransaction();
      } catch (_) {}
    }
    return next(new HttpError("Harjoituksen lisäys epäonnistui", 500));
  } finally {
    if (sess) sess.endSession();
  }

  res.status(201).json({ workout: newWorkout.toObject({ getters: true }) });
};

//Muokkaa harjoitusta
const updateWorkout = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpError("Tarkista syötteesi", 422));
  }

  const workoutId = req.params.wid;
  const { date, type, duration, description } = req.body;

  let workout;

  try {
    workout = await Workout.findById(workoutId);
  } catch (err) {
    return next(new HttpError("Treenin haku epäonnistui", 500));
  }

  if (!workout) {
    return next(new HttpError("Treeniä ei löytynyt", 404));
  }
  if (workout.user.toString() !== req.userData.userId) {
    return next(new HttpError("Ei valtuuksia", 403));
  }

  if (date !== undefined) workout.date = new Date(date);
  if (type !== undefined) workout.type = type;
  if (description !== undefined) workout.description = description;
  if (duration !== undefined) {
    workout.duration = duration === "" ? null : Number(duration);
  }

  try {
    await workout.save();
  } catch (err) {
    return next(new HttpError("Treenin päivitys epäonnistui", 500));
  }

  res.status(200).json({ workout: workout.toObject({ getters: true }) });
};

//Poista harjoitus
const deleteWorkout = async (req, res, next) => {
  const workoutId = req.params.wid;

  let workout;
  try {
    workout = await Workout.findById(workoutId).populate("user");
  } catch (err) {
    return next(new HttpError("Treenin haku epäonnistui", 500));
  }

  if (!workout) return next(new HttpError("Treeniä ei löytynyt", 404));

  if (workout.user.id !== req.userData.userId) {
    return next(new HttpError("Ei valtuuksia poistaaa tätä treeniä.", 403));
  }

  try {
    await workout.deleteOne();
    workout.user.workouts.pull(workout._id);
    await workout.user.save();
  } catch (err) {
    console.error(err);
    return next(new HttpError("Treenin poistaminen epäonnistui", 500));
  }

  res.status(200).json({ message: "Treeni poistettu" });
};

exports.getWorkoutById = getWorkoutById;
exports.getMyWorkouts = getMyWorkouts;
exports.createWorkout = createWorkout;
exports.updateWorkout = updateWorkout;
exports.deleteWorkout = deleteWorkout;
exports.getWorkoutsByUserId = getWorkoutsByUserId;
