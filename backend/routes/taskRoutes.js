import express from 'express';
import Task from '../models/Task.js';



const router = express.Router();

// Task creation 

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

// Get all tasks for a user

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