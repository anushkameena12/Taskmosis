import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import taskRoutes from "./routes/taskRoutes.js";
import habitRoutes from "./routes/habitRoutes.js";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(
  cors({
    origin: [
        "https://taskmosis.vercel.app",
        "https://taskmosis-d76g4wylq-anushka-meenas-projects.vercel.app"
    ] ,
        
    credentials: true,
  })
);

app.use(express.json());

// routes
app.use("/api", taskRoutes);
app.use("/api/habits", habitRoutes);

app.get("/", (req, res) => {
  res.send("API is working");
});


const PORT = process.env.PORT || 5000;


mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB");

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.log("MongoDB connection error:", err);
  });