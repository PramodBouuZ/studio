// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBOT_JH59xqK_Hab06MuGc1i89SB8XuL1k",
  authDomain: "bantconfirm-new.firebaseapp.com",
  projectId: "bantconfirm-new",
  storageBucket: "bantconfirm-new.firebasestorage.app",
  messagingSenderId: "72456811813",
  appId: "1:72456811813:web:7a2f2f023a4123a4b116cc",
  measurementId: "G-BRPMVVZKCW"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);