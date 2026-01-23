import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBxUVANB5uK3buhLwJmG_N2SJ-vndgALm4",
    authDomain: "disastersync-2a5f5.firebaseapp.com",
    projectId: "disastersync-2a5f5",
    storageBucket: "disastersync-2a5f5.firebasestorage.app",
    messagingSenderId: "527578496505",
    appId: "1:527578496505:web:fcff304a2d4ab24c479128"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
export const db = getFirestore(app);           // Firestore Database
export const auth = getAuth(app);              // Authentication
export const realtimeDb = getDatabase(app);    // Realtime Database (for live updates)

export default app;
