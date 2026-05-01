import { useNavigate } from "react-router-dom";

const Dashboard = ({ user }) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white flex flex-col items-center justify-center px-6">

      <h1 className="text-4xl font-bold mb-4 text-center">
        Welcome back 🌿
      </h1>

      <p className="text-gray-400 mb-10 text-center max-w-md">
        Stay consistent, track your tasks, and build better habits every day.
      </p>

      <div className="flex flex-col md:flex-row gap-6">

        {/* Tasks Card */}
        <div
          onClick={() => navigate("/tasks")}
          className="cursor-pointer bg-slate-800 border border-green-400/20 hover:border-green-400/40 p-6 rounded-xl shadow-green-500/10 shadow-lg hover:scale-[1.03] transition"
        >
          <h2 className="text-xl font-semibold mb-2 text-green-400">
            📋 Tasks
          </h2>
          <p className="text-gray-400 text-sm">
            Manage your daily tasks efficiently
          </p>
        </div>

        {/* Habits Card */}
        <div
          onClick={() => navigate("/habits")}
          className="cursor-pointer bg-slate-800 border border-green-400/20 hover:border-green-400/40 p-6 rounded-xl shadow-green-500/10 shadow-lg hover:scale-[1.03] transition"
        >
          <h2 className="text-xl font-semibold mb-2 text-green-400">
            🔁 Habits
          </h2>
          <p className="text-gray-400 text-sm">
            Build consistency with daily habits
          </p>
        </div>

      </div>

    </div>
  );
};

export default Dashboard;