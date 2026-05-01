import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { auth } from '../firebase/firebase';
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

const Tasks = ({ user }) => {
  const navigate = useNavigate();

  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");

  if (!user) return <p className="text-center mt-10">Loading...</p>;

  //  Fetch tasks
  const fetchTasks = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/tasks?userId=${user.uid}`
      );
      setTasks(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  //  Add task
  const handleAddTask = async () => {
    if (!title.trim()) return;

    try {
      await axios.post("http://localhost:5000/api/tasks", {
        title,
        userId: user.uid,
      });

      setTitle("");
      fetchTasks();
    } catch (error) {
      console.log(error);
    }
  };

  //  Delete task
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/tasks/${id}`);
      fetchTasks();
    } catch (error) {
      console.log(error);
    }
  };

  // Toggle complete
  const handleToggleComplete = async (id, completed) => {
    try {
      await axios.put(`http://localhost:5000/api/tasks/${id}`, {
        completed: !completed,
      });
      fetchTasks();
    } catch (error) {
      console.log(error);
    }
  };

  // Logout
  const handleLogout = async () => {
    await signOut(auth);
    navigate("/");
  };

  //  Stats
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.completed).length;
  const pendingTasks = totalTasks - completedTasks;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white flex flex-col items-center py-10 px-4">

    {/* Back */}
    <button
      onClick={() => navigate("/dashboard")}
      className="self-start mb-4 text-green-400 hover:underline"
    >
      ← Back to Dashboard
    </button>

    <h1 className="text-4xl font-bold mb-6 text-green-400">
      Tasks 🌿
    </h1>

    {/* Stats */}
    <div className="grid grid-cols-3 gap-4 mb-8 w-full max-w-xl">
      <div className="bg-slate-800 border border-green-400/20 p-4 rounded-xl text-center shadow-green-500/10 shadow">
        <p className="text-gray-400 text-sm">Total</p>
        <h2 className="text-2xl font-bold">{totalTasks}</h2>
      </div>

      <div className="bg-green-600 p-4 rounded-xl text-center shadow">
        <p className="text-sm">Completed</p>
        <h2 className="text-2xl font-bold">{completedTasks}</h2>
      </div>

      <div className="bg-yellow-500 p-4 rounded-xl text-center shadow text-black">
        <p className="text-sm">Pending</p>
        <h2 className="text-2xl font-bold">{pendingTasks}</h2>
      </div>
    </div>

    {/* Add Task */}
    <div className="flex gap-3 mb-6 w-full max-w-xl">
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Add a new task..."
        className="flex-1 px-4 py-2 rounded-lg bg-slate-800 border border-green-400/20 focus:outline-none focus:ring-2 focus:ring-green-400"
      />

      <button
        onClick={handleAddTask}
        disabled={!title.trim()}
        className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded-lg transition disabled:opacity-50"
      >
        Add
      </button>
    </div>

    {/*  Task List */}
    <div className="w-full max-w-xl space-y-3">
      {tasks.length === 0 ? (
        <p className="text-gray-400 text-center text-lg">
          No tasks yet 🌿 <br /> Start building your flow
        </p>
      ) : (
        tasks.map((task) => (
          <div
            key={task._id}
            className="flex justify-between items-center bg-slate-800 border border-green-400/20 p-4 rounded-xl shadow-green-500/10 shadow-lg hover:scale-[1.02] hover:border-green-400/40 transition"
          >
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() =>
                  handleToggleComplete(task._id, task.completed)
                }
                className="w-5 h-5 accent-green-500"
              />

              <span
                className={`text-lg ${
                  task.completed
                    ? "line-through text-green-400"
                    : ""
                }`}
              >
                {task.title}
              </span>
            </div>

            <button
              onClick={() => handleDelete(task._id)}
              className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded-md text-sm transition"
            >
              Delete
            </button>
          </div>
        ))
      )}
    </div>

    {/*  Logout */}
    <button
      onClick={handleLogout}
      className="mt-8 bg-red-600 hover:bg-red-700 px-5 py-2 rounded-lg transition"
    >
      Logout
    </button>
  </div>
)};
export default Tasks;