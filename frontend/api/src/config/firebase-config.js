// Firebase Configuration Instructions:
// 1. Go to Firebase Console > Project Settings > Service Accounts
// 2. Click "Generate New Private Key"
// 3. Download the JSON file
// 4. Copy the values below or use environment variables

export const firebaseConfig = {
  // Option 1: Direct configuration (not recommended for production)
  serviceAccount: {
    type: "service_account",
    project_id: "ncbxa1",
    private_key_id: "4007f5b45ad8eb629bc3ebb1ebf890e67ba819bf",
    private_key:
      "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCpmbMsf0Szuk98\nCRAKtVirEsCc1CIR/E/O7vif6RJEEDiYY0q4ilndeflPtSItPyHP7oKqQ2N5Y3Pt\nSUruEeebEc+GsxyOLpeZTnHPyDkuw2ZFiYm4ah7ia76X1vPiLvtUeeEjKLdwL7Ay\nkW3lsVqv8x2wVT17LMhJ/ubgXkZ0go1EJfboJP+fo1nfRM22Zrcm5iX1IK7Uisdd\n0xEZMJuZBCMWJYm23toq1KczhSJh13CFaKrjhmgiX4lx/P6GYSMW19qdlfXrGmSI\n6kIc4CmZavOU2v6PnCpqsu93ZLZO40aL+mRgrRtf1jjRcyG4Q/shYpokjcgat8uO\nqwqyyV+TAgMBAAECggEAHVr4q9GFgzRS0K3C5I+Z/tZal2qSURmieLddOlR9sGE8\nYogBJWrw/ghAMl8wQLOmNxbZ7/2FCLxBkwc2HHnl5C3ThUWYQjXnUIZG5ceKukDh\nAVU6jLx1hwxOK3rtsK8gGnGUGeFQyu6+KSqJ4pFtmHnUoDJI13qbWk9wB9LZkA3G\ndp/yaN/4eFlL9hTSz4FuQb42wFr/JzSLeHJa6xDWOjEZIDfKF0pcIcxnxaFWcuC4\nwtU/AAgT+oudEVBHwGeCLgoc884viv1RqO+3GGEaQnW3LG4ak+XjkT9/cRK6XWRC\nbvOT2SVjN8zVSqTnOnNEIC4i4JINoHdiMKdZaKUTMQKBgQDfTsWBRx49eXoDYrT1\nwYnCDwnS1ax44GLOqQ/WKTT0QMwQ7tEQcN8tLd1P8C8kO1Dczzn5xLiGhUPhmutN\ngY/l7mFC4mUESx+MxF014bxousNfFunAR7Ig/I7vDpPdYXOyUGc21ZcOGnYKA9Ay\nlQ35iM22p5XquWmbK+RncS/wIwKBgQDCbg+nbea85/VEOHTglNHQbXYxgZuaXY4z\nVoLnOSdq7fBjR0bhfZiZItK5A/ZnfjWzk5AcQW7bydMNRgoSxJU9cGdE63jnwj2+\nBfHNRoVPypp/tv/PjRAzORq4zLKqAYTAcy6kW9Ww5V7N2gh+Mwf/6nmUftquDfkP\nG8axVrwR0QKBgEODZ0csn0Hqxi7b2uYqO2IGdeveWiS5gmYEyxrunmnyZUABVAfq\neC8KnMycS0RjApGfvWF8TmWtSNaepeFq+HyF07YLCIuBwuomPCAcPYBUZtkK7mUJ\nyBsdAIHaIG5gFkCk+m+jp+XFrkZc3MdONUlqSPeeNz8eC4W0gXucxueNAoGAXR3O\n+3XECvbgXSLYvvInJjY2Y/FZr21c/DNTkB+sRCbeeP2a8cVv/u9RknBWYyxr1aw3\nWYDw8exP2syPaHujqgAaRUSs6/n4DfjU3GYI1LUIl1/yVdmOR6nypUzLyGXfyTeg\nv/CHgCfp5pakeKRCEYufXMIAQ1nHzTeVSjtq6PECgYBRwao2B2nVYfcJ3lq3/gwO\nvRaHSiss/D4s1PvhoRFKjn6hJhla2N0vMrJl6y4YC5FuKbUna9Yw2iiiOJyNfCC+\n/dpQRD+C6RTNgGqWIKjiKYj8stElIo/ww2INkwAcL8HU5MNRM9tmF+rEnN1Yea0l\nxzRNkvljVHf3+0ASTuAg9A==\n-----END PRIVATE KEY-----\n",
    client_email: "firebase-adminsdk-fbsvc@ncbxa1.iam.gserviceaccount.com",
    client_id: "105337758969997568709",
    auth_uri: "https://accounts.google.com/o/oauth2/auth",
    token_uri: "https://oauth2.googleapis.com/token",
    auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
    client_x509_cert_url:
      "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-fbsvc%40ncbxa1.iam.gserviceaccount.com",
  },

  // Option 2: Environment variables (recommended)
  useEnvVars: true,

  // Database URL
  databaseURL: "https://ncbxa1.firebaseio.com",
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
