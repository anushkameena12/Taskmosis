import mongoose from "mongoose";

const teamSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    members: [
        {
            type: String,
        }
    ]
});

const Team = mongoose.model("Team", teamSchema);

export default Team;