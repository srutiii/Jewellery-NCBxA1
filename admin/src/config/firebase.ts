import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyBINa_qTwjX4GquqvzzraTRa1v6-duz2BA",
  authDomain: "data-collection-3ef77.firebaseapp.com",
  projectId: "data-collection-3ef77",
  storageBucket: "data-collection-3ef77.firebasestorage.app",
  messagingSenderId: "876448675052",
  appId: "1:876448675052:web:19a75d9562fe98bed8a1c9",
  measurementId: "G-QT8HECDJQ5"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export default app;
