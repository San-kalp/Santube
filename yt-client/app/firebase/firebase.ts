import { initializeApp } from "firebase/app";
import {getAuth,signInWithPopup,GoogleAuthProvider,onAuthStateChanged,User} from "firebase/auth";
import { getAnalytics } from "firebase/analytics";


const firebaseConfig = {
  apiKey: "AIzaSyC0xzyH5KGxLG2zfQuYJ3RJr5DLmiQb1YE",
  authDomain: "santube-3ff1e.firebaseapp.com",
  projectId: "santube-3ff1e",
  storageBucket: "santube-3ff1e.appspot.com",
  messagingSenderId: "35557424787",
  appId: "1:35557424787:web:6d02b79f4aa2b6cdc0d766",
  measurementId: "G-3GYK0HBG0Y"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);


const auth = getAuth(app);


export function signInWithGoogle(){
    return signInWithPopup(auth, new GoogleAuthProvider());
}


/**
 * Signs a user out 
 * @returns - A promise that resolves when the user is signed out 
 */
export function signOut(){
    return auth.signOut();
}


/**
 * 
 * @param callback - Will take either of 2 values - user or null
 * @returns - A function to unsub callback
 */
export function onAuthStateChangedHelper(callback : (user:User | null)=> void){
    return onAuthStateChanged(auth,callback);
}

