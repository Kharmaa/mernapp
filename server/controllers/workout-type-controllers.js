const { validationResult } = require("express-validator");
const HttpError = require("../models/http-error");
const WorkoutType = require("../models/workout-type");
const Workout = require("../models/workout");

// Hae kirjautuneen käyttäjän lajit
// GET /api/types
const getMyTypes = async (req, res, next) => {
  try {
    const types = await WorkoutType.find({ owner: req.userData.userId }).sort({
      name: 1,
    });
    res.json({ types: types.map((t) => t.toObject({ getters: true })) });
  } catch (err) {
    return next(new HttpError("Lajien haku epäonnistui", 500));
  }
};

// Luo uusi laji
// POST /api/types
const createType = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return next(new HttpError("Tarkista syötteesi", 422));

  const { name, color, icon } = req.body;

  try {
    const created = new WorkoutType({
      name: name.trim(),
      color: color || "",
      icon: icon || "",
      owner: req.userData.userId,
    });

    await created.save();

    res.status(201).json({ type: created.toObject({ getters: true }) });
  } catch (err) {
    if (err.code === 11000) {
      return next(new HttpError("Laji on jo olemassa", 422));
    }
    return next(new HttpError("Lajin luonti epäonnistui", 500));
  }
};

// Päivitä laji
// PATCH /api/types/:tid
const updateType = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return next(new HttpError("Tarkista syötteesi", 422));

  const { tid } = req.params;
  const { name, color, icon } = req.body;

  let typeDoc;
  try {
    typeDoc = await WorkoutType.findById(tid);
  } catch (err) {
    return next(new HttpError("Lajin haku epäonnistui", 500));
  }

  if (!typeDoc) return next(new HttpError("Lajia ei löytynyt", 404));

  if (typeDoc.owner.toString() !== req.userData.userId) {
    return next(new HttpError("Ei valtuuksia", 403));
  }

  if (name !== undefined) typeDoc.name = name.trim();
  if (color !== undefined) typeDoc.color = color;
  if (icon !== undefined) typeDoc.icon = icon;

  try {
    await typeDoc.save();
    res.json({ type: typeDoc.toObject({ getters: true }) });
  } catch (err) {
    if (err.code === 11000) {
      return next(new HttpError("Laji on jo olemassa", 422));
    }
    return next(new HttpError("Lajin päivitys epäonnistui", 500));
  }
};

// Poista laji
// DELETE /api/types/:tid
const deleteType = async (req, res, next) => {
  const { tid } = req.params;

  let typeDoc;
  try {
    typeDoc = await WorkoutType.findById(tid);
  } catch (err) {
    return next(new HttpError("Lajin haku epäonnistui", 500));
  }

  if (!typeDoc) return next(new HttpError("Lajia ei löytynyt", 404));

  if (typeDoc.owner.toString() !== req.userData.userId) {
    return next(new HttpError("Ei valtuuksia", 403));
  }

  const inUse = await Workout.countDocuments({
    user: req.userData.userId,
    type: new mongoose.Types.ObjectId(tid),
  });

  if (inUse > 0) {
    return next(
      new HttpError(
        "Lajia ei voi poistaa, koska se on käytössä treeneissä.",
        422,
      ),
    );
  }

  try {
    await typeDoc.deleteOne();
  } catch (err) {
    return next(new HttpError("Lajin poistaminen epäonnistui", 500));
  }

  res.json({ message: "Laji poistettu" });
};

exports.getMyTypes = getMyTypes;
exports.createType = createType;
exports.updateType = updateType;
exports.deleteType = deleteType;
