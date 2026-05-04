import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../firebase/firebase";
import { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import CalendarHeatmap from "react-calendar-heatmap";
import "react-calendar-heatmap/dist/styles.css";
import { subDays} from "date-fns";

const Dashboard = ({ user }) => {
  const navigate = useNavigate();

  const [taskStats, setTaskStats] = useState({
    total: 0,
    completed: 0,
    pending: 0,
  });

  const [habitStats, setHabitStats] = useState({
    total: 0,
    bestStreak: 0,
    chartData: [],
  });

  const [todayData, setTodayData] = useState({
    pendingTasks: [],
    habits: [],
  });

  const generateHeatmapData = () => {
    return todayData.habits.filter((h) => h.lastCompleted).map((habit) => ({
      date: habit.lastCompleted.split("T")[0],
      count: habit.streak,
    }));
  }

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/");
  };

  const fetchStats = async () => {
    try {
   
      const taskRes = await axios.get(
        `http://localhost:5000/api/tasks?userId=${user.uid}`
      );

      const tasks = taskRes.data;
      const completed = tasks.filter((t) => t.completed).length;

      setTaskStats({
        total: tasks.length,
        completed,
        pending: tasks.length - completed,
      });

      
      const habitRes = await axios.get(
        `http://localhost:5000/api/habits?userId=${user.uid}`
      );

      const habits = habitRes.data;

      const bestStreak =
        habits.length > 0
          ? Math.max(...habits.map((h) => h.streak))
          : 0;

      const chartData = habits
        .sort((a, b) => b.streak - a.streak)
        .slice(0, 5)
        .map((h) => ({
          name: h.title,
          streak: h.streak,
        }));

      setHabitStats({
        total: habits.length,
        bestStreak,
        chartData,
      });

     
      const pendingTasks = tasks
        .filter((t) => !t.completed)
        .slice(0, 5);

      setTodayData({
        pendingTasks,
        habits,
      });

    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (user) fetchStats();
  }, [user]);

  return (
    <div className="min-h-screen px-6 py-8 
    bg-gradient-to-br from-[#fdfaf6] via-[#f3e9df] to-[#e9d8c8]">

    
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-2xl font-semibold text-[#4b2e2e]">
          Taskmosis ☕
        </h1>

        <button
          onClick={handleLogout}
          className="bg-[#6f4e37] hover:bg-[#5c3d2e] text-white px-4 py-2 rounded-xl text-sm"
        >
          Logout
        </button>
      </div>

    
      <div className="mb-10">
        <h2 className="text-4xl font-semibold text-[#4b2e2e] mb-2">
          Welcome back {user?.displayName || "User"}
        </h2>
        <p className="text-gray-500">
          Stay consistent and track your growth.
        </p>
      </div>

  
      <div className="grid md:grid-cols-3 gap-4 mb-10">

        <div className="bg-white/80 border rounded-xl p-4">
          <p className="text-gray-500 text-sm">Total Tasks</p>
          <h3 className="text-2xl font-semibold text-[#4b2e2e]">
            {taskStats.total}
          </h3>
        </div>

        <div className="bg-white/80 border rounded-xl p-4">
          <p className="text-gray-500 text-sm">Completed</p>
          <h3 className="text-2xl font-semibold text-[#4b2e2e]">
            {taskStats.completed}
          </h3>
        </div>

        <div className="bg-white/80 border rounded-xl p-4">
          <p className="text-gray-500 text-sm">Best Streak</p>
          <h3 className="text-2xl font-semibold text-[#4b2e2e]">
            🔥 {habitStats.bestStreak}
          </h3>
        </div>

      </div>

    
      <div className="grid md:grid-cols-2 gap-6 mb-10">

       
        <div className="bg-white/80 border rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-[#4b2e2e] mb-4">
            Task Progress
          </h3>

          <ResponsiveContainer width="100%" height={250}>
            <BarChart
              data={[
                { name: "Completed", value: taskStats.completed },
                { name: "Pending", value: taskStats.pending },
              ]}
            >
              <XAxis dataKey="name" stroke="#6b7280" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#6f4e37" />
            </BarChart>
          </ResponsiveContainer>
        </div>

       
        <div className="bg-white/80 border rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-[#4b2e2e] mb-4">
            Top Habits
          </h3>

          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={habitStats.chartData}>
              <XAxis dataKey="name" stroke="#6b7280" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="streak" fill="#a67c52" />
            </BarChart>
          </ResponsiveContainer>
        </div>

      </div>

  
      <div className="bg-white/80 border rounded-2xl p-6 mb-10">
        <h3 className="text-lg font-semibold text-[#4b2e2e] mb-4">
          Today Focus
        </h3>

        <div className="grid md:grid-cols-2 gap-6">

         
          <div>
            <h4 className="text-sm text-gray-500 mb-2">
              Pending Tasks
            </h4>

            {todayData.pendingTasks.length === 0 ? (
              <p className="text-gray-400 text-sm">
                All done 🎉
              </p>
            ) : (
              todayData.pendingTasks.map((task) => (
                <p key={task._id} className="text-[#4b2e2e] text-sm">
                  • {task.title}
                </p>
              ))
            )}
          </div>

          {/* Habit heatmap */}
          <div>
  <h4 className="text-sm text-gray-500 mb-2">
    Consistency
  </h4>

  {todayData.habits.length === 0 ? (
    <p className="text-gray-400 text-sm">
      No habits yet
    </p>
  ) : (
    <CalendarHeatmap
      startDate={subDays(new Date(), 60)}
      endDate={new Date()}
      values={generateHeatmapData()}
      classForValue={(value) => {
        if (!value) return "color-empty";
        if (value.count >= 5) return "color-scale-4";
        if (value.count >= 3) return "color-scale-3";
        if (value.count >= 2) return "color-scale-2";
        return "color-scale-1";
      }}
    />
  )}
</div>

        </div>
      </div>

  
      <div className="grid md:grid-cols-2 gap-6">

        <div
          onClick={() => navigate("/tasks")}
          className="cursor-pointer bg-white/80 border rounded-2xl p-6 shadow hover:scale-[1.02] transition"
        >
          <h2 className="text-xl font-semibold text-[#4b2e2e]">
            📋 Tasks
          </h2>
          <p className="text-gray-500 text-sm">
            Manage your daily tasks
          </p>
        </div>

        <div
          onClick={() => navigate("/habits")}
          className="cursor-pointer bg-white/80 border rounded-2xl p-6 shadow hover:scale-[1.02] transition"
        >
          <h2 className="text-xl font-semibold text-[#4b2e2e]">
            🔁 Habits
          </h2>
          <p className="text-gray-500 text-sm">
            Track your consistency
          </p>
        </div>

      </div>

    </div>
  );
};

export default Dashboard;