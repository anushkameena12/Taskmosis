import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../firebase/firebase";
import { useEffect, useState } from "react";
import axios from "axios";
import { updateProfile } from "firebase/auth";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const Dashboard = ({ user }) => {
  const navigate = useNavigate();
  const [showProfile, setShowProfile] = useState(false);
  const [newName, setNewName] = useState(user?.displayName || "");

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
  });

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/");
  };

  const fetchStats = async () => {
    try {

      const today = new Date().toISOString().split("T")[0];
      
      const taskRes = await axios.get(
        `http://localhost:5000/api/tasks?userId=${user.uid}&date=${today}`
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
        .slice(0, 10);

      setTodayData({
        pendingTasks,
      });

    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (user) fetchStats();
  }, [user]);

  return (
  <div className="min-h-screen px-6 py-8 bg-gradient-to-br from-[#fdfaf6] via-[#f3e9df] to-[#e9d8c8]">
    <div className="flex justify-between items-center mb-10">
      <h1 className="text-2xl font-semibold text-[#4b2e2e]">
        Taskmosis
      </h1>


    <div className="relative">
      <button
      onClick={() =>
        setShowProfile(!showProfile)
      }
      className="
      w-12 h-12
      rounded-full
      overflow-hidden
      border-2 border-[#d6b89c]
      shadow-sm
      hover:scale-105
      transition"
    >
      {user?.photoURL ? (
        <img
          src={user.photoURL}
          alt="profile"
          className="w-full h-full object-cover"
        />

      ) : (
      <div
      className="
      w-full h-full
      flex items-center justify-center
      bg-[#6f4e37]
      text-white
      font-semibold"
      >
        {user?.displayName?.charAt(0) || "U"}
        </div>

      )}

    </button>
    
    {showProfile && (
      <div
        className="
        absolute right-0 mt-3
        w-80
        bg-[#fdfaf6]
        border border-[#e6d3c3]
        rounded-2xl
        shadow-xl
        p-5
        z-50"
      >
        <button
        onClick={() => setShowProfile(false)}
        className="
        absolute top-4 right-4
        w-8 h-8
        flex items-center justify-center
        rounded-full
        bg-[#f3e9df]
        hover:bg-[#e6d3c3]
        text-[#6f4e37]
        transition"
        >
          ✕
        </button>
        
        <div className="flex flex-col items-center">
          {user?.photoURL ? (
            <img
              src={user.photoURL}
              alt="profile"
              className="
              w-20 h-20
              rounded-full
              object-cover
              border-2 border-[#d6b89c]"
            />

          ) : (
          
          <div
          className="
          w-20 h-20
          rounded-full
          bg-[#6f4e37]
          text-white
          flex items-center justify-center
          text-2xl font-semibold"
          >
            {user?.displayName?.charAt(0) || "U"}
          </div>
          )}
          
          <h2
            className="
            mt-4
            text-xl font-semibold
            text-[#4b2e2e]"
          >
            {user?.displayName || "User"}
          </h2>

          <p className="text-sm text-gray-500">
            {user?.email}
          </p>

        </div>
        
        
        <div className="mt-6">
          
          <label
            className="
            text-sm
            text-[#6f4e37]"
          >
            Change Name
          </label>

          <input
            value={newName}
            onChange={(e) =>
              setNewName(e.target.value)
            }

            className="
            w-full mt-2
            px-4 py-3
            rounded-xl
            border border-[#e6d3c3]
            bg-white
            focus:outline-none
            focus:ring-2
            focus:ring-[#c8a27a]"
          />
          
          
          <button
            onClick={async () => {
              try {
                await updateProfile(auth.currentUser, {
                  displayName: newName,
                });

                window.location.reload();

              } catch (error) {
                console.log(error);
              }
            }}

            className="
            w-full mt-4
            bg-[#6f4e37]
            hover:bg-[#5c3d2e]
            text-white
            py-3 rounded-xl
            transition"
          >
            Save Changes
          </button>

        </div>
        
        
        <button
        onClick={handleLogout}
        className="
        w-full mt-4
        bg-red-500
        hover:bg-red-600
        text-white
        py-3 rounded-xl
        transition"
        >
          Logout
          </button>
          </div>
        )}
        </div>
        </div>

      {/*  header */}
      <div className="mb-10">
        <h2 className="text-4xl font-semibold text-[#4b2e2e] mb-2">
          Welcome back, {user?.displayName || "User"}
        </h2>
        <p className="text-gray-500">
          Stay consistent and track your growth.
        </p>
      </div>

      {/* Graphs */}
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
             {habitStats.bestStreak} 🔥
          </h3>
        </div>
      </div>

     
      <div className="grid md:grid-cols-3 gap-6 mb-10">

        {/*  Task Progress */}
        <div className="bg-white/80 border rounded-2xl p-6 h-[320px] flex flex-col">
          <h3 className="text-lg font-semibold text-[#4b2e2e] mb-4">
            Task Progress
          </h3>

          <div className="flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={[
                  { name: "Completed", value: taskStats.completed },
                  { name: "Pending", value: taskStats.pending },
                ]}
              >
                <XAxis dataKey="name" stroke="#6b7280" />
                <YAxis />
                <Tooltip />
                <Bar
                  dataKey="value"
                  fill="#6f4e37"
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/*  Today focus card */}
        <div className="bg-white/90 border border-[#e6d3c3] rounded-2xl p-6 h-[320px] flex flex-col items-center">

          <h3 className="text-lg font-semibold text-[#4b2e2e] mb-4">
             Today's Focus 🎯
          </h3>

          <h4 className="text-sm text-gray-500 mb-3">
            Pending Tasks
          </h4>

          {todayData.pendingTasks.length === 0 ? (
            <p className="text-gray-400 text-sm mt-6">
              All done 
            </p>
          ) : (
            <div className="w-full space-y-2 overflow-y-auto flex-1 pr-2">
              {todayData.pendingTasks.map((task) => (
                <div
                  key={task._id}
                  className="bg-[#fdf8f3] border border-[#e6d3c3] px-4 py-2 rounded-lg text-[#4b2e2e] text-sm text-center shadow-sm hover:scale-[1.02] transition"
                >
                  {task.title}
                </div>
              ))}
            </div>
          )}
        </div>

       
        <div className="bg-white/80 border rounded-2xl p-6 h-[320px] flex flex-col">
          <h3 className="text-lg font-semibold text-[#4b2e2e] mb-4">
            Top Habits
          </h3>

          <div className="flex-1 overflow-x-auto">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={habitStats.chartData}>
                <XAxis dataKey="name" stroke="#6b7280" />
                <YAxis />
                <Tooltip />
                <Bar
                  dataKey="streak"
                  fill="#a67c52"
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      
      <div className="grid md:grid-cols-2 gap-6">

        <div
          onClick={() => navigate("/tasks")}
          className="cursor-pointer bg-white/80 border rounded-2xl p-6 shadow hover:scale-[1.02] transition"
        >
          <h2 className="text-xl font-semibold text-[#4b2e2e]">
            Tasks
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
           Habits
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