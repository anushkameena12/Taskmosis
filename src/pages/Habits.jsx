import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const Habits = ({ user }) => {
  const navigate = useNavigate();

  const [habits, setHabits] = useState([]);
  const [title, setTitle] = useState("");

  //  Fetch habits
  const fetchHabits = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/habits?userId=${user.uid}`
      );
      setHabits(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (user) fetchHabits();
  }, [user]);

  //  Add habits
  const addHabit = async () => {
    if (!title.trim()) return;

    try {
      await axios.post("http://localhost:5000/api/habits", {
        title,
        userId: user.uid,
      });

      setTitle("");
      fetchHabits();
    } catch (error) {
      console.log(error);
    }
  };

  //  Mark done
  const markDone = async (id) => {
    try {
      await axios.put(`http://localhost:5000/api/habits/${id}`);

      //  fetch fresh data (ensures sync)
      fetchHabits();
    } catch (error) {
      console.log(error);
    }
  };

  //  Check if completed today
  const isCompletedToday = (lastCompleted) => {
    if (!lastCompleted) return false;

    const today = new Date().toISOString().split("T")[0];
    const last = new Date(lastCompleted).toISOString().split("T")[0];

    return today === last;
  };

 
  const chartData = habits.map((habit) => ({
    name: habit.title,
    streak: habit.streak,
  }));

  if (!user) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white flex flex-col items-center py-10 px-4">
      
      {/*  Back */}
      <button
        onClick={() => navigate("/dashboard")}
        className="self-start mb-4 text-green-400 hover:underline"
      >
        ← Back to Dashboard
      </button>

      <h1 className="text-4xl font-bold mb-6 text-green-400">
        Habits 🌿
      </h1>

      {/*  Add Habit */}
      <div className="flex gap-3 mb-6 w-full max-w-xl">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="New habit..."
          className="flex-1 px-4 py-2 rounded-lg bg-slate-800 border border-green-400/20 focus:outline-none focus:ring-2 focus:ring-green-400"
        />

        <button
          onClick={addHabit}
          className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded-lg"
        >
          Add
        </button>
      </div>

      {/*  Habit List */}
      <div className="w-full max-w-xl space-y-3">
        {habits.length === 0 ? (
          <p className="text-gray-400 text-center">
            No habits yet 
          </p>
        ) : (
          habits.map((habit) => (
            <div
              key={habit._id}
              className="flex justify-between items-center bg-slate-800 border border-green-400/20 p-4 rounded-xl hover:shadow-[0_0_12px_rgba(34,197,94,0.3)] transition"
            >
              <div>
                <p className="text-lg">{habit.title}</p>
                <p className="text-sm text-green-300">
                   {habit.streak} day streak 🔥
                </p>
              </div>

              <button
                onClick={() => markDone(habit._id)}
                disabled={isCompletedToday(habit.lastCompleted)}
                className={`px-3 py-1 rounded ${
                  isCompletedToday(habit.lastCompleted)
                    ? "bg-gray-700 cursor-not-allowed"
                    : "bg-green-500 hover:bg-green-600"
                }`}
              >
                {isCompletedToday(habit.lastCompleted)
                  ? "✅"
                  : "Done"}
              </button>
            </div>
          ))
        )}
      </div>

      {/*  Chart */}
      <div className="w-full max-w-xl mt-10">
        <h2 className="text-xl mb-4 text-green-400">
          Progress 
        </h2>

        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <XAxis dataKey="name" stroke="#9CA3AF" />
            <YAxis stroke="#9CA3AF" />
            <Tooltip />
            <Bar
              dataKey="streak"
              fill="#22c55e"
              radius={[8, 8, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Habits;