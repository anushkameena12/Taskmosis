import express from "express";
import Task from "../models/Task.js";

const router = express.Router();


// API for creating a new task
router.post("/tasks", async (req, res) => {

  try {

    const {
      title,
      userId,
      teamId,
      date,
    } = req.body;

    const newTask = new Task({
      title,
      userId,
      teamId,
      date,
    });

    await newTask.save();

    res.status(201).json(newTask);

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }

});


// API for fetching tasks for a user on a specific date
router.get("/tasks", async (req, res) => {

  try {

    const {
      userId,
      date,
    } = req.query;

    const tasks = await Task.find({
      userId,
      date,
    });

    res.json(tasks);

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }

});


// API for deleting a task
router.delete("/tasks/:id", async (req, res) => {

  try {

    const { id } = req.params;

    await Task.findByIdAndDelete(id);

    res.json({
      message: "Task deleted",
    });

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }

});


// API for updating task completion status
router.put("/tasks/:id", async (req, res) => {

  try {

    const { id } = req.params;

    const { completed } = req.body;

    const updatedTask =
      await Task.findByIdAndUpdate(
        id,
        { completed },
        { new: true }
      );

    res.json(updatedTask);

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }

});


export default router;