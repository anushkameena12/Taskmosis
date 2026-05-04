import express from "express";
import Habit from "../models/Habit.js";

const router = express.Router();

//  API for adding habits
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

//  API for getting habits
router.get("/", async (req, res) => {
  try {
    const { userId } = req.query;

    const habits = await Habit.find({ userId });
    res.json(habits);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//  API for marking habit as complete (streak logic)
router.put("/:id", async (req, res) => {
  try {
    const habit = await Habit.findById(req.params.id);

    if (!habit) {
      return res.status(404).json({ message: "Habit not found" });
    }

    const today = new Date();

    // Convert today to YYYY-MM-DD
    const todayStr = today.toISOString().split("T")[0];
    const todayDate = new Date(todayStr);

    let diff = 1;

    if (habit.lastCompleted) {
      const lastStr = habit.lastCompleted.toISOString().split("T")[0];
      const lastDate = new Date(lastStr);

      diff = Math.floor(
        (todayDate - lastDate) / (1000 * 60 * 60 * 24)
      );
    }

    //  Streak logic
    if (!habit.lastCompleted) {
      habit.streak = 1;
    } else if (diff === 1) {
      habit.streak += 1;
    } else if (diff > 1) {
      habit.streak = 1;
    }
   

    habit.lastCompleted = today;

    await habit.save();

    res.json(habit);
  } catch (error) {
    console.log(error); 
    res.status(500).json({ message: error.message });
  }
});

export default router;