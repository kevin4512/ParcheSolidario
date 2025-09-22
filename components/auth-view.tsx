"use client"
// Archivo: components/auth-view.tsx
// Este componente controla la vista principal de autenticación:
// - Si el usuario NO ha iniciado sesión, muestra el formulario de login.
// - Si el usuario ha iniciado sesión, muestra el panel de sesión (SessionPanel).
//
// Clean Architecture: la lógica de autenticación está desacoplada de la UI.

import { useAuth } from "@/hooks/useAuth";
import { LoginForm } from "./login-form";
import { SessionPanel } from "./session-panel";

export function AuthView() {
  // Usamos el hook personalizado para manejar el estado de autenticación
  const { user, loading } = useAuth();

  // Mostrar un loading mientras se verifica el estado de autenticación
  if (loading) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/30 via-accent/10 to-primary/30">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Verificando sesión...</p>
        </div>
      </div>
    );
  }

  // Si hay usuario, muestra el panel de sesión; si no, el formulario de login
  return user ? (
    <SessionPanel user={{
      displayName: user.displayName,
      email: user.email,
      photoURL: user.photoURL,
    }} onLogout={() => {}} />
  ) : (
    <LoginForm />
  );
}

// Explicación:
// - Este componente es el "contenedor" de autenticación.
// - Controla si mostrar el login o el panel de usuario según el estado de sesión.
// - Recibe los datos del usuario desde el LoginForm y los pasa al SessionPanel.
