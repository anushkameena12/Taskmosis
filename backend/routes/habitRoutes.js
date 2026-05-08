import express from "express";
import Habit from "../models/Habit.js";

const router = express.Router();


// Api to create a new habit
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
    res.status(500).json({
      message: error.message,
    });
  }
});


// Api to get all habits of a user
router.get("/", async (req, res) => {
  try {
    const { userId } = req.query;

    const habits = await Habit.find({ userId });

    res.json(habits);

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});


// Api to edit a habit
router.put("/edit/:id", async (req, res) => {
  try {

    const updatedHabit =
      await Habit.findByIdAndUpdate(
        req.params.id,
        {
          title: req.body.title,
        },
        { new: true }
      );

    res.json(updatedHabit);

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});


// Api to delete a habit
router.delete("/delete/:id", async (req, res) => {
  try {

    await Habit.findByIdAndDelete(
      req.params.id
    );

    res.json({
      message: "Habit deleted",
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});


//  Api to mark a habit as done for the day
router.put("/:id", async (req, res) => {
  try {

    const habit = await Habit.findById(
      req.params.id
    );

    if (!habit) {
      return res.status(404).json({
        message: "Habit not found",
      });
    }

    const today =
      new Date()
        .toISOString()
        .split("T")[0];

    const lastDate = habit.lastCompleted
      ? new Date(habit.lastCompleted)
          .toISOString()
          .split("T")[0]
      : null;

    
    if (lastDate === today) {
      return res.json(habit);
    }

    // streak logic
    if (lastDate) {

      const yesterday = new Date();

      yesterday.setDate(
        yesterday.getDate() - 1
      );

      const yesterdayStr =
        yesterday
          .toISOString()
          .split("T")[0];

      if (lastDate === yesterdayStr) {
        habit.streak += 1;
      } else {
        habit.streak = 1;
      }

    } else {
      habit.streak = 1;
    }

    // heatmap dates
    const alreadyExists =
      habit.completedDates.some(
        (date) =>
          new Date(date)
            .toISOString()
            .split("T")[0] === today
      );

    if (!alreadyExists) {
      habit.completedDates.push(
        new Date()
      );
    }

    habit.lastCompleted = new Date();

    await habit.save();

    res.json(habit);

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

export default router;