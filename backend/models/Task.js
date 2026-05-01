import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
},
completed: {
    type: Boolean,
    default: false,
},

userId: {
    type: String,
    required: true,
},

teamId: {
    type: String,
    default: null,
},

createdAt: {
    type: Date,
    default: Date.now,
}
})

const Task = mongoose.model("Task", taskSchema);

export default Task;