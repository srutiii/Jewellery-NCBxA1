// Firebase Configuration Instructions:
// 1. Go to Firebase Console > Project Settings > Service Accounts
// 2. Click "Generate New Private Key"
// 3. Download the JSON file
// 4. Copy the values below or use environment variables

export const firebaseConfig = {
  // Option 1: Direct configuration (not recommended for production)
  serviceAccount: {
    type: "service_account",
    project_id: "data-collection-3ef77",
    private_key_id: "your_private_key_id_here",
    private_key: "-----BEGIN PRIVATE KEY-----\nYour private key here\n-----END PRIVATE KEY-----\n",
    client_email: "firebase-adminsdk-xxxxx@data-collection-3ef77.iam.gserviceaccount.com",
    client_id: "your_client_id_here",
    auth_uri: "https://accounts.google.com/o/oauth2/auth",
    token_uri: "https://oauth2.googleapis.com/token",
    auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
    client_x509_cert_url: "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-xxxxx%40data-collection-3ef77.iam.gserviceaccount.com"
  },
  
  // Option 2: Environment variables (recommended)
  useEnvVars: true,
  
  // Database URL
  databaseURL: "https://data-collection-3ef77.firebaseio.com"
};

// Instructions for setup:
// 1. Download service account key from Firebase Console
// 2. Replace the values above with your actual service account details
// 3. Or set environment variables:
//    - FIREBASE_PRIVATE_KEY_ID
//    - FIREBASE_PRIVATE_KEY
//    - FIREBASE_CLIENT_EMAIL
//    - FIREBASE_CLIENT_ID
//    - FIREBASE_CLIENT_CERT_URL
