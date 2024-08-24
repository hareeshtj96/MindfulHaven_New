// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth} from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyALqe15108H869TAfdeB-ig_LRirXaHXnI",
  authDomain: "mindfulhaven-42d47.firebaseapp.com",
  projectId: "mindfulhaven-42d47",
  storageBucket: "mindfulhaven-42d47.appspot.com",
  messagingSenderId: "76567475499",
  appId: "1:76567475499:web:32e1efd1ee8807bd82416e",
  measurementId: "G-7RH5N0TXZ7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);