import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { getFirestore, collection, addDoc } from "firebase/firestore";


const firebaseConfig = {
  apiKey: "AIzaSyCUv-Ta9uDLJJHHEmky0_yCZ6cywPTu82c",
  authDomain: "hankmed-59b8b.firebaseapp.com",
  projectId: "hankmed-59b8b",
  storageBucket: "hankmed-59b8b.appspot.com",
  messagingSenderId: "870250265831",
  appId: "1:870250265831:web:2b1313d801b4c2edbf7642",
  measurementId: "G-3HJTHVFTB5"
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore(app);
export { auth, db, createUserWithEmailAndPassword, signInWithEmailAndPassword, addDoc, collection };