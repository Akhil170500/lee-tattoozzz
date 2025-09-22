// src/firebase.config.js

import { initializeApp, getApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAus52RGRH6HVQ3F6_IBlkIo2uhvufF5FU",
  authDomain: "lee-tattoozzz.firebaseapp.com",
  projectId: "lee-tattoozzz",
  storageBucket: "lee-tattoozzz.appspot.com", // FIXED: it was 'firebasestorage.app'
  messagingSenderId: "879455133162",
  appId: "1:879455133162:web:5200b8a33a0b66f1fce693",
  measurementId: "G-93263LGYDC"
};

// Initialize app (only once)
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Get auth instance
const auth = getAuth(app);
const db = getFirestore(app);
//  Export named constants (NO default)
export { app, auth, db };
