const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const workoutTypeSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    owner: { type: mongoose.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true },
);

// uniikki per käyttäjä (sama nimi sallittu eri käyttäjille)
workoutTypeSchema.index({ owner: 1, name: 1 }, { unique: true });

module.exports = mongoose.model("WorkoutType", workoutTypeSchema);
