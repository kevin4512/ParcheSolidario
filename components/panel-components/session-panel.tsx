"use client"

// Archivo: components/session-panel.tsx
// Este componente muestra la información del usuario autenticado y permite cerrar sesión.
// Versión simplificada sin dependencias de Firebase para demo

import { useState } from "react"

interface SessionPanelProps {
  user: {
    displayName?: string | null
    email?: string | null
    photoURL?: string | null
  } | null
  onLogout: () => void
}

export function SessionPanel({ user, onLogout }: SessionPanelProps) {
  const [loading, setLoading] = useState(false)

  const handleLogout = async () => {
    setLoading(true)
    try {
      // Simulate logout delay
      await new Promise((resolve) => setTimeout(resolve, 1000))
      onLogout() // Notifica al padre que se cerró sesión
    } catch (error) {
      // Maneja el error si ocurre
      alert("Error al cerrar sesión")
    } finally {
      setLoading(false)
    }
  }

  if (!user) return null // Si no hay usuario, no muestra nada

  return (
    <div className="flex flex-col items-center gap-4 p-6 bg-card rounded-lg shadow-sm">
      <img
        src={user.photoURL || "/placeholder.svg?height=64&width=64&query=user+avatar"}
        alt="Avatar"
        className="w-16 h-16 rounded-full border-2 border-border"
      />
      <div className="text-center">
        <div className="font-bold text-lg text-card-foreground">{user.displayName || "Usuario sin nombre"}</div>
        <div className="text-sm text-muted-foreground">{user.email}</div>
      </div>
      <button
        onClick={handleLogout}
        disabled={loading}
        className="px-6 py-2 bg-destructive text-destructive-foreground rounded-lg hover:bg-destructive/90 transition-colors disabled:opacity-50"
      >
        {loading ? "Cerrando sesión..." : "Cerrar sesión"}
      </button>
    </div>
  )
}

// Explicación:
// - Versión simplificada del componente sin dependencias de Firebase
// - Usa colores semánticos del sistema de diseño
// - Mantiene la funcionalidad de logout con simulación de delay
