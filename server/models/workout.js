const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const workoutSchema = new Schema({
  date: { type: Date, required: true },
  type: { type: mongoose.Types.ObjectId, ref: "WorkoutType", required: true },
  description: { type: String, default: "" },
  duration: { type: Number, default: null },
  user: { type: mongoose.Types.ObjectId, ref: "User", required: true },
});

module.exports = mongoose.model("Workout", workoutSchema);
