import mongoose from "mongoose";

const habitSchema = new mongoose.Schema({
  title: String,
  userId: String,
  streak: { type: Number, default: 0 },
  lastCompleted: Date,
});

export default mongoose.model("Habit", habitSchema);