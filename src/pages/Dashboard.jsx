import React from 'react'
import { auth } from '../firebase/firebase';
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const navigate = useNavigate();

    const handleLogout = async () => {
        await signOut(auth);
        navigate("/");
        
    }


  return (
    <div className='flex flex-col items-center mt-20 gap-4'>
        <h1 className='text-3xl font-bold'>Dashboard</h1>

        <button
        onClick={handleLogout}
        className='bg-red-500 text-white px-4 py-2'
        >Logout</button>
      
    </div>
  )
}

export default Dashboard
