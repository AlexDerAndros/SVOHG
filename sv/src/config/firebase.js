import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyA8L_u8fKGymHLIkDQ_v05RFaRfXajNYyc",
  authDomain: "sv-website-fbf6a.firebaseapp.com",
  databaseURL: "https://sv-website-fbf6a-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "sv-website-fbf6a",
  storageBucket: "sv-website-fbf6a.appspot.com",
  messagingSenderId: "1091169826936",
  appId: "1:1091169826936:web:ccb2ea138b4aab016d958d",
  measurementId: "G-0J8DY58WCW"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const GoogleProvider = new GoogleAuthProvider();

