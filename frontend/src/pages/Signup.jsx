import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import React, { useState } from "react";
import { auth } from "../firebase/firebase";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleSignup = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      await updateProfile(userCredential.user, {
        displayName: name || email.split("@")[0],
      });

      await userCredential.user.reload();
      navigate("/dashboard");
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4
    bg-gradient-to-br from-[#fdfaf6] via-[#f3e9df] to-[#e9d8c8] relative overflow-hidden">

      
      <div className="absolute w-[300px] h-[300px] bg-[#e6d3c3] rounded-full blur-3xl opacity-40 top-[-50px] left-[-50px]" />
      <div className="absolute w-[250px] h-[250px] bg-[#d6bfa7] rounded-full blur-3xl opacity-40 bottom-[-50px] right-[-50px]" />

      
      <div className="relative w-full max-w-md 
      bg-white/80 backdrop-blur-xl 
      border border-[#e7d7c7] 
      rounded-3xl shadow-[0_10px_40px_rgba(0,0,0,0.08)] p-8">

        <h1 className="text-3xl font-semibold text-center text-[#4b2e2e] mb-2">
          Create Account
        </h1>

        <p className="text-center text-gray-500 text-sm mb-6">
          Build habits. Stay consistent.
        </p>

        <div className="flex flex-col gap-4">

          <input
            placeholder="Your name"
            onChange={(e) => setName(e.target.value)}
            className="px-4 py-3 rounded-xl 
            bg-white/70 
            border border-[#e7d7c7] 
            focus:outline-none focus:ring-2 focus:ring-[#c8a27a] 
            transition duration-200"
          />

          <input
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
            className="px-4 py-3 rounded-xl 
            bg-white/70 
            border border-[#e7d7c7] 
            focus:outline-none focus:ring-2 focus:ring-[#c8a27a] 
            transition duration-200"
          />

          <input
            type="password"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
            className="px-4 py-3 rounded-xl 
            bg-white/70 
            border border-[#e7d7c7] 
            focus:outline-none focus:ring-2 focus:ring-[#c8a27a] 
            transition duration-200"
          />

          
          <button
            onClick={handleSignup}
            className="mt-3 
            bg-gradient-to-r from-[#6f4e37] to-[#5c3d2e] 
            hover:from-[#5c3d2e] hover:to-[#4b2e2e] 
            text-white py-3 rounded-xl font-medium 
            transition duration-300 
            shadow-md hover:shadow-lg active:scale-[0.98]"
          >
            Get Started
          </button>

        </div>

        <p className="text-center text-gray-500 text-sm mt-6">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/")}
            className="text-[#6f4e37] hover:underline cursor-pointer"
          >
            Login
          </span>
        </p>

      </div>
    </div>
  );
};

export default Signup;