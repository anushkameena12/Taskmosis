import { BrowserRouter, Route, Routes } from "react-router-dom"
import Login from "./pages/Login"
import Signup from "./pages/Signup"
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase/firebase";
import Dashboard from "./pages/Dashboard";


function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      console.log("Auth state:", currentUser);

    });

    return () => unsubscribe();
  }, []);
  

  return (
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<Login/>} />
      <Route path="/signup" element={<Signup/>} />

      <Route path="/dashboard" element={user ? <Dashboard /> : <Login />} />
    </Routes>
    </BrowserRouter>
   
  )
}

export default App
