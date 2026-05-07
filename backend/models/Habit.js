import mongoose from "mongoose";

const habitSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },

  streak: {
    type: Number,
    default: 0,
  },

  lastCompleted: {
    type: Date,
    default: null,
  },

  completedDates: {
    type: [String],
    default: [],
  },

  userId: {
    type: String,
    required: true,
  },
});

const Habit = mongoose.model("Habit", habitSchema);

export default Habit;