import { signInWithEmailAndPassword } from 'firebase/auth';
import React, { useState } from 'react'
import { auth } from '../firebase/firebase';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            await signInWithEmailAndPassword(auth, email, password);
            navigate("/dashboard");
        } catch (error){
            alert(error.message);
        }
    }

  return (
    <div className='flex flex-col items-center mt-20 gap-4'>
        <h1 className='text-2xl font-bold'>
            Login
        </h1>

        <input
        className='border border-gray-300 rounded-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500'
        placeholder='Email'
        onChange={(e) => setEmail(e.target.value)}
        />

        <input
        className='border border-gray-300 rounded-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500'
        type='password'
        placeholder='Password'
        onChange={(e) => setPassword(e.target.value)}
        />

        <button
        onClick={handleLogin}
        className='bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300'
        >
            Login
        </button>

      
    </div>
  )
}

export default Login
