"use client"

import { useState, useEffect } from "react";
import { User, onAuthStateChanged } from "firebase/auth";
import { getAuth } from "firebase/auth";
import { firebaseApp } from "@/firebase/clientApp";

// Hook personalizado para manejar el estado de autenticación
export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getAuth(firebaseApp);
    
    // Escucha los cambios en el estado de autenticación
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    // Limpia el listener cuando el componente se desmonta
    return () => unsubscribe();
  }, []);

  return { user, loading };
}
