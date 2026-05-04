import express from 'express';
import Task from '../models/Task.js';



const router = express.Router();

// API for creating tasks

router.post("/tasks", async (req, res) => {
    try {
        const { title, userId, teamId } = req.body;

        const newTask = new Task({
            title,
            userId,
            teamId,
        });

        await newTask.save();

        res.status(201).json(newTask);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// API for getting all tasks for a user

router.get("/tasks", async (req, res) => {
    try {
        const { userId } = req.query;
        const tasks = await Task.find({ userId });
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;

// API for deleting a task

router.delete("/tasks/:id", async (req, res) => {
    try {
        const { id } = req.params;

        await Task.findByIdAndDelete(id);

        res.json({ message: "Task deleted" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// API for updating a task

router.put("/tasks/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { completed } = req.body;

        const updatedTask = await Task.findByIdAndUpdate(
            id,
            { completed },
            { new: true }
        );
        res.json(updatedTask);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
