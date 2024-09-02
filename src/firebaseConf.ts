// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBCOKLhRaUROxVw44yBN9psOkqpv31Q9Qg",
  authDomain: "wanderd2de.firebaseapp.com",
  projectId: "wanderd2de",
  storageBucket: "wanderd2de.appspot.com",
  messagingSenderId: "176807645717",
  appId: "1:176807645717:web:58efff2009d50c7d04741c"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);