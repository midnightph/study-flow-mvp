// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDUTk2_ZvsPFohwwiL1hVahkaMaZ83lV9c",
  authDomain: "studyflow-6a225.firebaseapp.com",
  projectId: "studyflow-6a225",
  storageBucket: "studyflow-6a225.firebasestorage.app",
  messagingSenderId: "838383646269",
  appId: "1:838383646269:web:996ca219f318700b8bdc54"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);

// Initialize Analytics (only in production)
let analytics;
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'production') {
  analytics = getAnalytics(app);
}

export { analytics };
export default app;
