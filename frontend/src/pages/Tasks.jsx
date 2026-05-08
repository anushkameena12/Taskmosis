import React, { useEffect, useState } from "react";
import axios from "axios";
import { auth } from "../firebase/firebase";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import {
  format,
  addDays,
  startOfWeek,
} from "date-fns";

const Tasks = ({ user }) => {
  const navigate = useNavigate();

  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");

  const [selectedDate, setSelectedDate] = useState( new Date().toISOString().split("T")[0]
);

  if (!user) {
  return (
    <div
      className="
      min-h-screen
      flex flex-col
      items-center
      justify-center
      bg-gradient-to-br
      from-[#fdfaf6]
      via-[#f3e9df]
      to-[#e9d8c8]"
    >

      
      <div
        className="
        w-16 h-16
        border-4
        border-[#d6b89c]
        border-t-[#6f4e37]
        rounded-full
        animate-spin"
      />

      
      <h2
        className="
        mt-6
        text-2xl font-semibold
        text-[#4b2e2e]"
      >
        Taskmosis
      </h2>

      <p
        className="
        text-[#8b6f5a]
        mt-2"
      >
        Preparing your workspace...
      </p>

    </div>
  );
}

  const fetchTasks = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/tasks?userId=${user.uid}&date=${selectedDate}`
      );

      setTasks(res.data);

    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [selectedDate]);

  const handleAddTask = async () => {
    if (!title.trim()) return;

    try {
      await axios.post(
        "http://localhost:5000/api/tasks",
        {
          title,
          userId: user.uid,
          date: selectedDate,
        }
      );

      setTitle("");
      fetchTasks();

    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async (id) => {
    try {

      await axios.delete(
        `http://localhost:5000/api/tasks/${id}`
      );

      fetchTasks();

    } catch (error) {
      console.log(error);
    }
  };

  const handleToggleComplete = async (
    id,
    completed
  ) => {
    try {

      await axios.put(
        `http://localhost:5000/api/tasks/${id}`,
        {
          completed: !completed,
        }
      );

      fetchTasks();

    } catch (error) {
      console.log(error);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/");
  };

  // Stats
  const totalTasks = tasks.length;

  const completedTasks = tasks.filter(
    (t) => t.completed
  ).length;

  const pendingTasks =
    totalTasks - completedTasks;

  // Calendar
  const currentDate = new Date();

  const weekDays = Array.from(
    { length: 7 },
    (_, index) => {
      return addDays(
        startOfWeek(currentDate, {
          weekStartsOn: 1,
        }),
        index
      );
    }
  );

  return (
    <div
      className="
      min-h-screen px-6 py-8
      bg-gradient-to-br
      from-[#fdfaf6]
      via-[#f3e9df]
      to-[#e9d8c8]"
    >

      {/* Navbar */}
      <div
        className="
        flex justify-between
        items-center
        mb-10"
      >

        <button
          onClick={() =>
            navigate("/dashboard")
          }

          className="
          text-[#6f4e37]
          hover:underline"
        >
          ← Back
        </button>

        <h1
          className="
          text-2xl font-semibold
          text-[#4b2e2e]"
        >
          Tasks
        </h1>

        <button
          onClick={handleLogout}

          className="
          bg-[#6f4e37]
          hover:bg-[#5c3d2e]
          text-white
          px-4 py-2
          rounded-xl
          text-sm"
        >
          Logout
        </button>

      </div>

      {/* Weekly Calendar */}
      <div className="max-w-3xl mx-auto mb-10">
        <div className="flex justify-between gap-3">
          {weekDays.map((day) => {
            const formattedDate = format(day, "yyyy-MM-dd");
            const isToday = formattedDate ===
            format(currentDate, "yyyy-MM-dd");
            
            const isSelected = formattedDate === selectedDate;
            return (
            <button
            key={formattedDate}
            onClick={() =>
            setSelectedDate(formattedDate)
          }
          className="
          flex flex-col
          items-center gap-2
          transition"
        >

       
          <p
            className={`
              text-sm font-medium
              ${
                isSelected
                  ? "text-[#4b2e2e]"
                  : "text-[#8b6f5a]"
              }
            `}
          >
            {format(day, "EEE").charAt(0)}
          </p>

          {/* Date */}
          <div
            className={`
              w-12 h-12
              rounded-2xl
              flex items-center
              justify-center
              font-semibold
              shadow-sm
              transition-all
              ${
                isSelected
                  ? "bg-[#6f4e37] text-white scale-105"
                  : "bg-white/80 border border-[#e6d3c3] text-[#6f4e37]"
              }
            `}
          >
            {format(day, "dd")}
          </div>

        
          {isToday && (
            <span className="text-[10px] text-[#a67c52]">
              today
            </span>
          )}

        </button>
      );
    })}

  </div>


  <p className="text-center text-[#6f4e37] mt-5 font-medium">
    Tasks for {format(new Date(selectedDate), "MMMM dd, yyyy")}
  </p>

</div>

      {/* Stats */}
      <div
        className="
        grid md:grid-cols-3
        gap-4 mb-10
        max-w-3xl mx-auto"
      >

        <div
          className="
          bg-white/80 border
          rounded-xl p-4
          text-center"
        >

          <p
            className="
            text-gray-500 text-sm"
          >
            Total
          </p>

          <h2
            className="
            text-2xl font-semibold
            text-[#4b2e2e]"
          >
            {totalTasks}
          </h2>

        </div>

        <div
          className="
          bg-white/80 border
          rounded-xl p-4
          text-center"
        >

          <p
            className="
            text-gray-500 text-sm"
          >
            Completed
          </p>

          <h2
            className="
            text-2xl font-semibold
            text-[#6f4e37]"
          >
            {completedTasks}
          </h2>

        </div>

        <div
          className="
          bg-white/80 border
          rounded-xl p-4
          text-center"
        >

          <p
            className="
            text-gray-500 text-sm"
          >
            Pending
          </p>

          <h2
            className="
            text-2xl font-semibold
            text-[#a67c52]"
          >
            {pendingTasks}
          </h2>

        </div>

      </div>

      {/* Add Task */}
      <div
        className="
        flex gap-3 mb-8
        max-w-2xl mx-auto"
      >

        <input
          value={title}

          onChange={(e) =>
            setTitle(e.target.value)
          }

          placeholder="Add a new task..."

          className="
          flex-1 px-4 py-3
          rounded-xl
          bg-white/80
          border border-[#e6d3c3]
          focus:outline-none
          focus:ring-2
          focus:ring-[#c8a27a]"
        />

        <button
          onClick={handleAddTask}

          disabled={!title.trim()}

          className="
          bg-[#6f4e37]
          hover:bg-[#5c3d2e]
          text-white
          px-5 py-3
          rounded-xl
          transition
          disabled:opacity-50"
        >
          Add
        </button>

      </div>

      {/* Task List */}
      <div
        className="
        max-w-2xl mx-auto
        space-y-3"
      >

        {tasks.length === 0 ? (

          <p
            className="
            text-gray-400
            text-center text-lg"
          >
            No tasks yet
            <br />
            Start small, stay consistent
          </p>

        ) : (

          tasks.map((task) => (

            <div
              key={task._id}

              className="
              flex justify-between
              items-center
              bg-white/80
              border border-[#e6d3c3]
              px-4 py-3
              rounded-xl
              shadow-sm
              hover:shadow-md
              hover:scale-[1.01]
              transition"
            >

              <div
                className="
                flex items-center
                gap-3"
              >

                <input
                  type="checkbox"

                  checked={task.completed}

                  onChange={() =>
                    handleToggleComplete(
                      task._id,
                      task.completed
                    )
                  }

                  className="
                  w-5 h-5
                  accent-[#6f4e37]"
                />

                <span
                  className={`
                    text-md
                    ${
                      task.completed
                        ? "line-through text-gray-400"
                        : "text-[#4b2e2e]"
                    }
                  `}
                >
                  {task.title}
                </span>

              </div>

              <button
                onClick={() =>
                  handleDelete(task._id)
                }

                className="
                text-sm px-3 py-1
                rounded-md
                bg-[#e57373]
                hover:bg-[#d32f2f]
                text-white"
              >
                Delete
              </button>

            </div>
          ))
        )}

      </div>

    </div>
  );
};

export default Tasks;