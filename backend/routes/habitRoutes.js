import express from "express";
import Habit from "../models/Habit.js";

const router = express.Router();

// ➕ Add Habit
router.post("/", async (req, res) => {
  try {
    const { title, userId } = req.body;

    const newHabit = new Habit({
      title,
      userId,
    });

    await newHabit.save();
    res.status(201).json(newHabit);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 📥 Get Habits
router.get("/", async (req, res) => {
  try {
    const { userId } = req.query;

    const habits = await Habit.find({ userId });
    res.json(habits);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 🔁 Mark Habit Complete (streak logic)
router.put("/:id", async (req, res) => {
  try {
    const habit = await Habit.findById(req.params.id);

    const today = new Date();
    const last = habit.lastCompleted;

    if (!last) {
      habit.streak = 1;
    } else {
      const diff = Math.floor(
        (today - last) / (1000 * 60 * 60 * 24)
      );

      if (diff === 1) {
        habit.streak += 1; // continue streak
      } else if (diff > 1) {
        habit.streak = 1; // reset streak
      }
    }

    habit.lastCompleted = today;

    await habit.save();
    res.json(habit);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;