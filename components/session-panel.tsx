// Archivo: components/session-panel.tsx
// Este componente muestra la información del usuario autenticado y permite cerrar sesión.
// Sigue una estructura limpia y desacoplada (Clean Architecture):
// - La lógica de autenticación está en el dominio (firebaseAuth)
// - El componente solo consume la función y muestra la UI

import { useState } from "react";
import { logout } from "@/modules/domain/auth/firebaseAuth";

interface SessionPanelProps {
  user: {
    displayName?: string | null;
    email?: string | null;
    photoURL?: string | null;
  } | null;
  onLogout: () => void;
}

export function SessionPanel({ user, onLogout }: SessionPanelProps) {
  const [loading, setLoading] = useState(false);

  // Maneja el cierre de sesión
  const handleLogout = async () => {
    setLoading(true);
    try {
      await logout(); // Llama a la función de logout del dominio
      onLogout(); // Notifica al padre que se cerró sesión
    } catch (error) {
      // Maneja el error si ocurre
      alert("Error al cerrar sesión");
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null; // Si no hay usuario, no muestra nada

  return (
    <div className="flex flex-col items-center gap-4 p-4 border rounded shadow bg-white">
      <img
        src={user.photoURL || "/placeholder-user.jpg"}
        alt="Avatar"
        className="w-16 h-16 rounded-full border"
      />
      <div className="text-center">
        <div className="font-bold text-lg">{user.displayName || "Usuario sin nombre"}</div>
        <div className="text-sm text-gray-500">{user.email}</div>
      </div>
      <button
        onClick={handleLogout}
        disabled={loading}
        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
      >
        {loading ? "Cerrando sesión..." : "Cerrar sesión"}
      </button>
    </div>
  );
}

// Explicación:
// - Este componente recibe el usuario autenticado y una función para manejar el cierre de sesión.
// - Llama a la función de logout del dominio (clean architecture: separación de lógica y UI).
// - Muestra la foto, nombre y correo del usuario, y un botón para cerrar sesión.
