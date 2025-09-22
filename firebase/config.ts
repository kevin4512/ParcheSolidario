// Configuración de Firebase - Next.js carga automáticamente las variables de entorno
export const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyBhCxT5IhaCpxOa6GHkcrJr5MCjDJj8svU",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "parchesolidario-d1d9c.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "parchesolidario-d1d9c",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "parchesolidario-d1d9c.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "464510586595",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:464510586595:web:8d28070a336aeabc1dffd6",
};
