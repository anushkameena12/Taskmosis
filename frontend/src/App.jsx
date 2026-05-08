import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Tasks from "./pages/Tasks";
import Habits from "./pages/Habits";
import Onboarding from "./pages/Onboarding";

import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase/firebase";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
      console.log("Auth state:", currentUser);
      console.log("displayName:", currentUser?.displayName);
console.log("email:", currentUser?.email);
console.log("uid:", currentUser?.uid);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
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
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route
          path="/"
          element={!user ? <Login /> : <Navigate to="/dashboard" />}
        />
        <Route path="/signup" element={<Signup />} />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={user ? <Dashboard user={user} /> : <Login/>}
        />
        <Route
          path="/tasks"
          element={user ? <Tasks user={user} /> : <Navigate to="/" />}
        />
        <Route
          path="/habits"
          element={user ? <Habits user={user} /> : <Navigate to="/" />}
        />
        <Route
          path="/onboarding"
          element={user ? <Onboarding user={user} /> : <Navigate to="/" />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;