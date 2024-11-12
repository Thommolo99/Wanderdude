// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getAuth } from 'firebase/auth';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBEsamOofhfyA-FLBYu7Ije4fl8cHd8vOA",
  authDomain: "wanderdude-60d71.firebaseapp.com",
  projectId: "wanderdude-60d71",
  storageBucket: "wanderdude-60d71.appspot.com",
  messagingSenderId: "914294328541",
  appId: "1:914294328541:web:ce20ad02361760044b9f34"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
export const auth = getAuth(app);