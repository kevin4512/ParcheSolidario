import { initializeApp, getApps, getApp } from "firebase/app";
import { firebaseConfig } from "./config";

// Asegura que solo haya UNA instancia de Firebase
export const firebaseApp =
  getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
