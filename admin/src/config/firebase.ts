import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyCUxDydGNg6qaU_iVZilnfgGPDEjz6rpaE",
  authDomain: "ncbxa1.firebaseapp.com",
  projectId: "ncbxa1",
  storageBucket: "ncbxa1.firebasestorage.app",
  messagingSenderId: "1041550463547",
  appId: "1:1041550463547:web:6de1ac9c17b4e2ac9c021e",
  measurementId: "G-CMW93JS5DE"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export default app;
