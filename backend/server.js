import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import taskRoutes from './routes/taskRoutes.js';
import habitRoutes from './routes/habitRoutes.js';
import dotenv from 'dotenv';

dotenv.config();


const app = express();

app.use(
    cors({
        origin: "https://taskmosis.vercel.app/",
        credentials: true,
    }

));
app.use(express.json());


mongoose.connect(process.env.MONGO_URI).then(() => console.log("Connected to MongoDB")).catch((err) => console.log(err));

app.get("/", (req, res) => {
    res.send("API is working");
});

app.use("/api", taskRoutes);

app.use("/api/habits", habitRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})



