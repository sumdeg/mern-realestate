// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY ,
  authDomain: "mern-estate-2db43.firebaseapp.com",
  projectId: "mern-estate-2db43",
  storageBucket: "mern-estate-2db43.appspot.com",
  messagingSenderId: "270436658346",
  appId: "1:270436658346:web:0b0c8e5c6f07ca8db434d3"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);