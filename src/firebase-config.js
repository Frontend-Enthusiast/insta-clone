import { initializeApp } from "firebase/app";
import {getAuth} from "firebase/auth";
import {getFirestore} from 'firebase/firestore';
import {getStorage} from 'firebase/storage'
const firebaseConfig = {
    apiKey: "AIzaSyBbpI3tKWUtCFDGBvolNYV1fA1-FAnwlWc",
    authDomain: "insta-clone-4f438.firebaseapp.com",
    projectId: "insta-clone-4f438",
    storageBucket: "insta-clone-4f438.appspot.com",
    messagingSenderId: "821810997579",
    appId: "1:821810997579:web:9e6542f248e08b12d920ce",
    measurementId: "G-RWY2GJ8340"
  };
  
const app = initializeApp(firebaseConfig);  
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);