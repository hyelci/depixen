// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCQN47Ety8I0JkhqbRRMK9eZmxUa8rvhy0",
  authDomain: "practice-988d8.firebaseapp.com",
  projectId: "practice-988d8",
  storageBucket: "practice-988d8.appspot.com",
  messagingSenderId: "533488804249",
  appId: "1:533488804249:web:1865c1ca2691d607a0b308",
  measurementId: "G-8Z0TRZSRCV",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
