// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA8L_u8fKGymHLIkDQ_v05RFaRfXajNYyc",
  authDomain: "sv-website-fbf6a.firebaseapp.com",
  projectId: "sv-website-fbf6a",
  storageBucket: "sv-website-fbf6a.appspot.com",
  messagingSenderId: "1091169826936",
  appId: "1:1091169826936:web:ccb2ea138b4aab016d958d",
  measurementId: "G-0J8DY58WCW"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);

export { db };