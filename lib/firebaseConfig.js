// lib/firebaseConfig.js
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"; // Optional: for Firestore
import { getAuth } from "firebase/auth"; // Optional: for Auth

// const firebaseConfig = {
//   apiKey: "YOUR_API_KEY",
//   authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
//   projectId: "YOUR_PROJECT_ID",
//   storageBucket: "YOUR_PROJECT_ID.appspot.com",
//   messagingSenderId: "YOUR_SENDER_ID",
//   appId: "YOUR_APP_ID"
// };

const firebaseConfig = {
  apiKey: "AIzaSyCF7C3-Mt0eMYy73dcz29I3z_a8ZIaGMAg",
  authDomain: "amaninternational-6e382.firebaseapp.com",
  projectId: "amaninternational-6e382",
  storageBucket: "amaninternational-6e382.firebasestorage.app",
  messagingSenderId: "237379891487",
  appId: "1:237379891487:web:d2067b750cf182f950402a",
  measurementId: "G-S93JYHZ1TH"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

const db = getFirestore(app); // If you're using Firestore
const auth = getAuth(app); // If you're using Auth

export { app, db, auth };
