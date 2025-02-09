import { initializeApp, getApp, FirebaseApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAuth, Auth } from 'firebase/auth';

let firebaseApp: FirebaseApp;
let auth: Auth;

const firebaseConfig = {
  apiKey: "AIzaSyBLb2OYl5W2cnlg9ieqONwhu80fFcPsxqI",
  authDomain: "cargatusfichas.firebaseapp.com",
  projectId: "cargatusfichas",
  storageBucket: "cargatusfichas.firebasestorage.app",
  messagingSenderId: "199924153804",
  appId: "1:199924153804:web:fe3a3190f3e25a0908b169"
};

export function initializeFirebase() {
  try {
    firebaseApp = getApp();
  } catch {
    firebaseApp = initializeApp(firebaseConfig);
  }

  // Initialize auth if not already initialized
  if (!auth) {
    auth = getAuth(firebaseApp);
  }

  return firebaseApp;
}

// Initialize Firebase
console.log('🔵 Inicializando Firebase');
const app = initializeFirebase();
const db = getFirestore(app);
const storage = getStorage(app);
console.log('✅ Firebase inicializado');

export { db, storage, auth };