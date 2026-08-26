// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { addDoc, collection, getFirestore } from "firebase/firestore";
import { Attendee, Doot } from "./interfaces";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCeATBIGcWHLNKfhpncIjtrCe6e_K0RGfQ",
  authDomain: "anas-82877.firebaseapp.com",
  projectId: "anas-82877",
  storageBucket: "anas-82877.firebasestorage.app",
  messagingSenderId: "46307839554",
  appId: "1:46307839554:web:c6c287bec639420d8a67db"
};

// Initialize Firebase
export const firebaseApp = initializeApp(firebaseConfig);

export const register = (name: string) => {
  addDoc(collection(getFirestore(firebaseApp), "attendees"), {
    name: name,
    timestamp: new Date().valueOf(),
  } as Attendee);
};

export const logDoot = (name: string, ignoreInLeaderboard?: boolean) => {
  addDoc(collection(getFirestore(firebaseApp), "doots"), {
    dooter: name,
    timestamp: new Date().valueOf(),
    ignoreInLeaderboard: ignoreInLeaderboard,
  } as Doot);
};
