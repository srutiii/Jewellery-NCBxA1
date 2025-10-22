import admin from 'firebase-admin';
import { firebaseConfig } from './firebase-config.js';

// Initialize Firebase Admin
let serviceAccount;

if (firebaseConfig.useEnvVars) {
  // Use environment variables
  serviceAccount = {
    type: "service_account",
    project_id: "ncbxa1",
    private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
    private_key: process.env.FIREBASE_PRIVATE_KEY ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n') : undefined,
    client_email: process.env.FIREBASE_CLIENT_EMAIL,
    client_id: process.env.FIREBASE_CLIENT_ID,
    auth_uri: "https://accounts.google.com/o/oauth2/auth",
    token_uri: "https://oauth2.googleapis.com/token",
    auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
    client_x509_cert_url: process.env.FIREBASE_CLIENT_CERT_URL
  };
} else {
  // Use direct configuration
  serviceAccount = firebaseConfig.serviceAccount;
}

// Initialize the app if it hasn't been initialized
if (!admin.apps.length) {
  try {
    console.log('Initializing Firebase Admin...');
    console.log('Using environment variables:', firebaseConfig.useEnvVars);
    console.log('Project ID:', serviceAccount.project_id);
    console.log('Client Email:', serviceAccount.client_email);
    
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      databaseURL: firebaseConfig.databaseURL
    });
    console.log('✅ Firebase Admin initialized successfully');
  } catch (error) {
    console.error('❌ Error initializing Firebase Admin:', error);
    console.error('Service Account:', serviceAccount);
  }
}

export const db = admin.firestore();
export default admin;
