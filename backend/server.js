import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import taskRoutes from './routes/taskRoutes.js';


const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect("mongodb+srv://anushka:Jacob@cluster0.xgvejlw.mongodb.net/?appName=Cluster0/admin").then(() => console.log("Connected to MongoDB")).catch((err) => console.log(err));

app.get("/", (req, res) => {
    res.send("API is working");
});

app.use("/api", taskRoutes);

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})



