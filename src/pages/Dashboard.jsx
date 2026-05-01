import React, { useEffect, useState } from 'react'
import { auth } from '../firebase/firebase';
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Dashboard = ({ user }) => {
    const navigate = useNavigate();

    const [tasks, setTasks] = useState([]);
    const [title, setTitle] = useState("");

    if(!user) return <p>Loading...</p>

    //Fetch tasks for the user
    const fetchTasks = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/tasks?userId=${user.uid}`);

        
        setTasks(res.data);
      }catch (error) {
        console.log(error);
      }
    }

    useEffect(() => {
     fetchTasks();
    }, []);

    const handleAddTask = async () => {
      try {
        await axios.post("http://localhost:5000/api/tasks", {
          title,
          userId: user.uid,
        })
        setTitle("");
        fetchTasks();
      }catch (error) {
        console.log(error);
      }
    }

    const handleLogout = async () => {
        await signOut(auth);
        navigate("/");
        
    }


  return (
    <div className='flex flex-col items-center mt-20 gap-4'>
        <h1 className='text-3xl font-bold'>Dashboard</h1>

        <div className='flex gap-2'>
          <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className='border px-2 py-1'
          placeholder='New Task'
          />
          <button
          onClick={handleAddTask}
          className='bg-blue-500 text-white px-4 py-2'
          >Add Task

          </button>
        </div>

        {/* Task List */}
        <ul className='w-1/2'>
          {tasks.map((task) => (
            <li key={task._id} className='border p-2 mt-2 flex justify-between'>
              {task.title}
            </li>
          ))}
        </ul>

        <button
        onClick={handleLogout}
        className='bg-red-500 text-white px-4 py-2'
        >Logout</button>
      
    </div>
  )
}

export default Dashboard
