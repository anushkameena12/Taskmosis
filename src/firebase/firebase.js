import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";



const firebaseConfig = {
  apiKey: "AIzaSyAKP3BbItnA2IQlNfUFzi3uW99H_erty3s",
  authDomain: "taskmosis-8c2bd.firebaseapp.com",
  projectId: "taskmosis-8c2bd",
  storageBucket: "taskmosis-8c2bd.firebasestorage.app",
  messagingSenderId: "250088379260",
  appId: "1:250088379260:web:fea68e0850f72bd6be8af9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);