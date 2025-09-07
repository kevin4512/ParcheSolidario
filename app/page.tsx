import { AuthView } from "@/components/auth-view" // Importa el contenedor de autenticación

// Este componente es la página principal.
// Ahora muestra <AuthView />, que decide si mostrar el login o el panel de sesión según el estado de autenticación.
export default function HomePage() {
  return (
    <div className="min-h-screen bg-background w-full flex items-center justify-center p-0">
      <AuthView />
    </div>
  )
}

