// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA87k59Y0yvzptwjS0CB5jqQR80igso3sw",
  authDomain: "dino-dash-66723.firebaseapp.com",
  databaseURL: "https://dino-dash-66723-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "dino-dash-66723",
  storageBucket: "dino-dash-66723.firebasestorage.app",
  messagingSenderId: "456959919434",
  appId: "1:456959919434:web:fde2e8ba634046c8642db3",
  measurementId: "G-5LXYMB5NEH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);