// Import the functions you need from the SDKs
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';  

// Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyAlEiXc5c9x0IpInih4hVkzs52F1upEHsY",
  authDomain: "budget-tracker-e56d7.firebaseapp.com",
  projectId: "budget-tracker-e56d7",
  storageBucket: "budget-tracker-e56d7.firebasestorage.app",
  messagingSenderId: "462868303588",
  appId: "1:462868303588:web:9974e78803b3b59142e6f1",
  measurementId: "G-CB0S1JHXRW"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
