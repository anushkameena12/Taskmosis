import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import CalendarHeatmap from "react-calendar-heatmap";
import "react-calendar-heatmap/dist/styles.css";
import { subDays } from "date-fns";

const Habits = ({ user }) => {
  const navigate = useNavigate();

  const [habits, setHabits] = useState([]);
  const [title, setTitle] = useState("");

 
  const [editingHabit, setEditingHabit] = useState(null);
  const [editTitle, setEditTitle] = useState("");

 
  const [deletingHabit, setDeletingHabit] = useState(null);


  const fetchHabits = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/habits?userId=${user.uid}`
      );

      setHabits(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (user) fetchHabits();
  }, [user]);

  // Add habit
  const addHabit = async () => {
    if (!title.trim()) return;

    try {
      await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/habits`, {
        title,
        userId: user.uid,
      });

      setTitle("");
      fetchHabits();

    } catch (error) {
      console.log(error);
    }
  };

  // Mark done
  const markDone = async (id) => {
    try {
      await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/api/habits/${id}`
      );

      fetchHabits();

    } catch (error) {
      console.log(error);
    }
  };

  // Save edited habit
  const handleEdit = async () => {
    if (!editTitle.trim()) return;

    try {
      await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/api/habits/edit/${editingHabit._id}`,
        {
          title: editTitle,
        }
      );

      setEditingHabit(null);
      setEditTitle("");

      fetchHabits();

    } catch (error) {
      console.log(error);
    }
  };

  // Delete habit
  const handleDelete = async () => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_API_BASE_URL}/api/habits/delete/${deletingHabit._id}`
      );

      setDeletingHabit(null);

      fetchHabits();

    } catch (error) {
      console.log(error);
    }
  };

  // Check if completed today
  const isCompletedToday = (lastCompleted) => {
    if (!lastCompleted) return false;

    const today = new Date()
      .toISOString()
      .split("T")[0];

    const last = new Date(lastCompleted)
      .toISOString()
      .split("T")[0];

    return today === last;
  };

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

  return (
    <div
      className="
      min-h-screen px-6 py-8
      bg-gradient-to-br
      from-[#fdfaf6]
      via-[#f3e9df]
      to-[#e9d8c8]"
    >

    
      <div className="relative flex items-center mb-10">

        <button
          onClick={() => navigate("/dashboard")}
          className="
          text-[#6f4e37]
          hover:underline"
        >
          ← Back
        </button>

        <h1
          className="
          absolute left-1/2
          -translate-x-1/2
          text-3xl font-semibold
          text-[#4b2e2e]"
        >
          Habits
        </h1>

      </div>

  
      <div
        className="
        flex gap-3 mb-10
        max-w-2xl mx-auto"
      >

        <input
          value={title}
          onChange={(e) =>
            setTitle(e.target.value)
          }

          placeholder="Add a new habit..."

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
          onClick={addHabit}

          className="
          bg-[#6f4e37]
          hover:bg-[#5c3d2e]
          text-white
          px-5 py-3
          rounded-xl transition"
        >
          Add
        </button>

      </div>

      <div
        className="
        grid
        sm:grid-cols-2
        lg:grid-cols-3
        gap-6"
      >

        {habits.length === 0 ? (
          <p className="text-gray-500">
            No habits yet?
          </p>
        ) : (
          habits.map((habit) => (

            <div
              key={habit._id}

              className="
              bg-white/80
              border border-[#e6d3c3]
              rounded-2xl
              p-5
              shadow-sm
              hover:shadow-md
              transition"
            >

            
              <div className="flex justify-between items-start mb-4">

                <h2
                  className="
                  text-lg font-semibold
                  text-[#4b2e2e]"
                >
                  {habit.title}
                </h2>

                <div className="flex gap-2">

                  <button
                    onClick={() => {
                      setEditingHabit(habit);
                      setEditTitle(habit.title);
                    }}

                    className="
                    text-xs
                    px-3 py-1
                    rounded-lg
                    bg-[#f3e9df]
                    hover:bg-[#e6d3c3]
                    text-[#6f4e37]
                    transition"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() =>
                      setDeletingHabit(habit)
                    }

                    className="
                    text-xs
                    px-3 py-1
                    rounded-lg
                    bg-red-100
                    hover:bg-red-200
                    text-red-600
                    transition"
                  >
                    Delete
                  </button>

                </div>

              </div>

           
             {/* Heatmap */}
            <div className="mb-4 overflow-hidden">
              <div className="scale-[0.85] origin-left">
                <CalendarHeatmap
                startDate={subDays(new Date(), 90)}
                endDate={new Date()}
                values={Array.from({ length: 91 }, (_, i) => {
                  const date = subDays(new Date(), 90 - i).toISOString().split("T")[0];
                  const completed = habit.completedDates?.some((d) =>
                    new Date(d).toISOString().split("T")[0] === date);
                  return {
                    date,
                    count: completed ? 1 : 0,
                  };
                })}
                
                classForValue={(value) => {
                  if (!value || value.count === 0) {
                    return "color-empty";
                  }
                  return "color-scale-4";
                }}
                
                titleForValue={(value) => {
                  const formattedDate = new Date(value.date)
                  .toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  });
                  
                  return value.count
                  ? `Completed on ${formattedDate}`
                  : `No activity on ${formattedDate}`;
                }}
                
                showWeekdayLabels={false}
                />
                </div>
                
                </div>

              <p
                className="
                text-sm
                text-[#a67c52]
                mb-4"
              >
                 {habit.streak} day streak 🔥
              </p>

         
              <button
                onClick={() =>
                  markDone(habit._id)
                }

                disabled={isCompletedToday(
                  habit.lastCompleted
                )}

                className={`
                  w-full py-2 rounded-xl
                  transition text-sm
                  ${
                    isCompletedToday(
                      habit.lastCompleted
                    )
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-[#a67c52] hover:bg-[#8c6239] text-white"
                  }
                `}
              >
                {isCompletedToday(
                  habit.lastCompleted
                )
                  ? "Done Today ✓"
                  : "Mark Done"}
              </button>

            </div>
          ))
        )}

      </div>

  
      {editingHabit && (

        <div
          className="
          fixed inset-0
          bg-black/40
          flex items-center justify-center
          z-50"
        >

          <div
            className="
            bg-[#fdfaf6]
            w-[90%] max-w-md
            rounded-2xl
            p-6
            shadow-xl"
          >

            <h2
              className="
              text-2xl font-semibold
              text-[#4b2e2e]
              mb-4"
            >
              Edit Habit
            </h2>

            <input
              value={editTitle}

              onChange={(e) =>
                setEditTitle(e.target.value)
              }

              className="
              w-full px-4 py-3
              rounded-xl
              border border-[#e6d3c3]
              bg-white
              focus:outline-none
              focus:ring-2
              focus:ring-[#c8a27a]"
            />

            <div className="flex justify-end gap-3 mt-6">

              <button
                onClick={() => {
                  setEditingHabit(null);
                  setEditTitle("");
                }}

                className="
                px-4 py-2
                rounded-xl
                bg-gray-200
                hover:bg-gray-300
                transition"
              >
                Cancel
              </button>

              <button
                onClick={handleEdit}

                className="
                px-4 py-2
                rounded-xl
                bg-[#6f4e37]
                hover:bg-[#5c3d2e]
                text-white
                transition"
              >
                Save
              </button>

            </div>

          </div>

        </div>
      )}

 
      {deletingHabit && (

        <div
          className="
          fixed inset-0
          bg-black/40
          flex items-center justify-center
          z-50"
        >

          <div
            className="
            bg-[#fdfaf6]
            w-[90%] max-w-sm
            rounded-2xl
            p-6
            shadow-xl"
          >

            <h2
              className="
              text-xl font-semibold
              text-[#4b2e2e]
              mb-3"
            >
              Delete Habit?
            </h2>

            <p className="text-gray-500 mb-6">
              This action cannot be undone.
            </p>

            <div className="flex justify-end gap-3">

              <button
                onClick={() =>
                  setDeletingHabit(null)
                }

                className="
                px-4 py-2
                rounded-xl
                bg-gray-200
                hover:bg-gray-300"
              >
                Cancel
              </button>

              <button
                onClick={handleDelete}

                className="
                px-4 py-2
                rounded-xl
                bg-red-500
                hover:bg-red-600
                text-white"
              >
                Delete
              </button>

            </div>

          </div>

        </div>
      )}

    </div>
  );
};

export default Habits;