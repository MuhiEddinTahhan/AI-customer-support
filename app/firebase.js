// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC-fnS4-3XSFGKm_efal44US_oMtN8DE7I",
  authDomain: "ai-customer-chatbot-signin.firebaseapp.com",
  projectId: "ai-customer-chatbot-signin",
  storageBucket: "ai-customer-chatbot-signin.appspot.com",
  messagingSenderId: "103816005216",
  appId: "1:103816005216:web:9fc001be46089378082505"
};

// Initialize Firebase
 const app = initializeApp(firebaseConfig);
export const auth = getAuth(app)