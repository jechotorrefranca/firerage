import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: "gabai-g4841.firebaseapp.com",
  projectId: "gabai-g4841",
  storageBucket: "gabai-g4841.appspot.com",
  messagingSenderId: "719409106806",
  appId: "1:719409106806:web:e3af3fe80f5d4ab5bc3457",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);
export default app;
