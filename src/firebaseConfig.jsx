// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {
    getFirestore,
    collection,
    addDoc,
    getDocs,
    deleteDoc,
    doc,
    updateDoc,
  } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBcUlFTGOXLk2QfqE5zHoLU0UfeiJ3aXw4",
  authDomain: "todo-app-5c0b1.firebaseapp.com",
  projectId: "todo-app-5c0b1",
  storageBucket: "todo-app-5c0b1.appspot.com",
  messagingSenderId: "671132780271",
  appId: "1:671132780271:web:eef8ff33f70d183f167d1a"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db, collection, addDoc, getDocs, deleteDoc ,doc,updateDoc,};