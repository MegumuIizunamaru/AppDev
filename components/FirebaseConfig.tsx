// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDB8OhcDDJuf2aZ1Pbjkz667z1uBCtjZc4",
  authDomain: "appdatabase-c5805.firebaseapp.com",
  projectId: "appdatabase-c5805",
  storageBucket: "appdatabase-c5805.firebasestorage.app",
  messagingSenderId: "379444458313",
  appId: "1:379444458313:web:353ac5b0e27ef436afa098",
  measurementId: "G-KD11E57R6C"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);