// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCm2L5dkL3DlCmCGE9f-B4Fy2s_t1H6cL0",
  authDomain: "a2-avito.firebaseapp.com",
  projectId: "a2-avito",
  storageBucket: "a2-avito.firebasestorage.app",
  messagingSenderId: "286867399069",
  appId: "1:286867399069:web:5cb5a59c8c8ee4b37b4f74",
  measurementId: "G-J54F04YH0Y"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);}
