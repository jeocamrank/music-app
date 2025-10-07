// Import the functions you need from the SDKs you need
import { initializeApp, getApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB5Br8eZkk6U_Kwkh2V17bPT_UmlHpWeBg",
  authDomain: "music-app-53622.firebaseapp.com",
  projectId: "music-app-53622",
  storageBucket: "music-app-53622.firebasestorage.app",
  messagingSenderId: "498680002889",
  appId: "1:498680002889:web:a7932bb47aefebb1644298",
  measurementId: "G-MD209YMWK3"
};

// Initialize Firebase
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(app);
export default app;