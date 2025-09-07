"use client"
// Archivo: components/auth-view.tsx
// Este componente controla la vista principal de autenticación:
// - Si el usuario NO ha iniciado sesión, muestra el formulario de login.
// - Si el usuario ha iniciado sesión, muestra el panel de sesión (SessionPanel).
//
// Clean Architecture: la lógica de autenticación está desacoplada de la UI.

import { useState } from "react";
import { LoginForm } from "./login-form";
import { SessionPanel } from "./session-panel";

// Definimos el tipo de usuario que recibimos de Firebase
//Aqui sacamos el nombre de usuario, email y foto
interface User {
  displayName?: string | null;
  email?: string | null;
  photoURL?: string | null;
}

export function AuthView() {
  // Estado para guardar el usuario autenticado
  const [user, setUser] = useState<User | null>(null);

  // Esta función se pasa al LoginForm y se llama cuando el login es exitoso
  const handleLoginSuccess = (userData: User) => {
    setUser(userData);
  };

  // Esta función se pasa al SessionPanel y se llama cuando el usuario cierra sesión
  const handleLogout = () => {
    setUser(null);
  };

  // Si hay usuario, muestra el panel de sesión; si no, el formulario de login
  return user ? (
    <SessionPanel user={user} onLogout={handleLogout} />
  ) : (
    <LoginForm onLoginSuccess={handleLoginSuccess} />
  );
}

// Explicación:
// - Este componente es el "contenedor" de autenticación.
// - Controla si mostrar el login o el panel de usuario según el estado de sesión.
// - Recibe los datos del usuario desde el LoginForm y los pasa al SessionPanel.
