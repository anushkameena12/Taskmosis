import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const Habits = ({ user }) => {
  const navigate = useNavigate();

  const [habits, setHabits] = useState([]);
  const [title, setTitle] = useState("");

  const fetchHabits = async () => {
    const res = await axios.get(
      `http://localhost:5000/api/habits?userId=${user.uid}`
    );
    setHabits(res.data);
  };

  useEffect(() => {
    if (user) fetchHabits();
  }, [user]);

  const addHabit = async () => {
    if (!title.trim()) return;

    await axios.post("http://localhost:5000/api/habits", {
      title,
      userId: user.uid,
    });

    setTitle("");
    fetchHabits();
  };

  const markDone = async (id) => {
    await axios.put(`http://localhost:5000/api/habits/${id}`);
    fetchHabits();
  };

  const chartData = habits.map((habit) => ({
    name: habit.title,
    streak: habit.streak
  }));

  console.log(chartData);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white flex flex-col items-center py-10 px-4">

      {/* 🔙 Back */}
      <button
        onClick={() => navigate("/dashboard")}
        className="self-start mb-4 text-green-400 hover:underline"
      >
        ← Back to Dashboard
      </button>

      <h1 className="text-4xl font-bold mb-6 text-green-400">
        Habits 🌿
      </h1>

      {/* ➕ Add Habit */}
      <div className="flex gap-3 mb-6 w-full max-w-xl">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="New habit..."
          className="flex-1 px-4 py-2 rounded-lg bg-slate-800 border border-green-400/20 focus:outline-none focus:ring-2 focus:ring-green-400"
        />

        <button
          onClick={addHabit}
          className="bg-green-500 px-4 py-2 rounded-lg"
        >
          Add
        </button>
      </div>

      {/* 📋 Habit List */}
      <div className="w-full max-w-xl space-y-3">
        {habits.length === 0 ? (
          <p className="text-gray-400 text-center">
            No habits yet 🌿
          </p>
        ) : (
          habits.map((habit) => (
            <div
              key={habit._id}
              className="flex justify-between items-center bg-slate-800 border border-green-400/20 p-4 rounded-xl"
            >
              <div>
                <p className="text-lg">{habit.title}</p>
                <p className="text-sm text-gray-400">
                  🔥 Streak: {habit.streak}
                </p>
              </div>

              <button
                onClick={() => markDone(habit._id)}
                className="bg-green-500 px-3 py-1 rounded"
              >
                Done
              </button>
            </div>
          ))
        )}
      </div>

      {/* Stats */}
      <div className="w-full max-w-xl mt-10">
  <h2 className="text-xl mb-4 text-green-400">Progress 📊</h2>

  <ResponsiveContainer width="100%" height={300}>
  <BarChart data={chartData}>
    <XAxis dataKey="name" stroke="#9CA3AF" />
    <YAxis stroke="#9CA3AF" />
    <Tooltip />
    
    <Bar 
      dataKey="streak" 
      fill="#22c55e"   // ✅ THIS MAKES BARS VISIBLE
      radius={[6, 6, 0, 0]}
    />
  </BarChart>
</ResponsiveContainer>
</div>
    </div>
  );
};

export default Habits;