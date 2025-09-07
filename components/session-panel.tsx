// Archivo: components/session-panel.tsx
// Este componente muestra la información del usuario autenticado y permite cerrar sesión.
// Sigue una estructura limpia y desacoplada (Clean Architecture):
// - La lógica de autenticación está en el dominio (firebaseAuth)
// - El componente solo consume la función y muestra la UI

"use client"

import { useState } from "react"
import { ServiceCategories } from "@/components/panel-components/service-categories"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"


// Definición del tipo User para recibir el usuario real por props
export type User = {
  displayName?: string | null;
  email?: string | null;
  photoURL?: string | null;
} | null;

interface SessionPanelProps {
  user: User;
  onLogout: () => void;
}
  export function SessionPanel({ user, onLogout }: SessionPanelProps) {
    // Estado para controlar la sección activa del panel
    const [activeSection, setActiveSection] = useState<string>("home");
    if (!user) {
      return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
    <Card className="w-full max-w-2xl p-4 sm:p-8 text-center shadow-lg">
            <div className="w-16 h-16 mx-auto mb-6 bg-primary rounded-full flex items-center justify-center">
              <span className="text-2xl text-primary-foreground">🏛️</span>
            </div>
            <h1 className="text-2xl font-bold text-foreground mb-2">Servicio Comunitario</h1>
            <p className="text-muted-foreground mb-8 leading-relaxed">
              Conecta con tu comunidad y participa en servicios que marcan la diferencia
            </p>
          </Card>
        </div>
      );
    }

    return (
      <div className="w-full min-h-screen bg-background flex flex-col items-center justify-center">
  <header className="bg-primary text-primary-foreground shadow-lg w-full">
          <div className="w-full max-w-7xl mx-auto px-2 sm:px-4 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-8">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                    <span className="text-xl text-primary">🏛️</span>
                  </div>
                  <h1 className="text-xl font-bold">Servicio Comunitario</h1>
                </div>
                <nav className="hidden md:flex items-center gap-6">
                  <button
                    onClick={() => setActiveSection("home")}
                    className={`px-3 py-2 rounded-md transition-colors ${
                      activeSection === "home"
                        ? "bg-white text-primary font-medium"
                        : "text-primary-foreground hover:bg-white/10"
                    }`}
                  >
                    Inicio
                  </button>
                  <button
                    onClick={() => setActiveSection("services")}
                    className={`px-3 py-2 rounded-md transition-colors ${
                      activeSection === "services"
                        ? "bg-white text-primary font-medium"
                        : "text-primary-foreground hover:bg-white/10"
                    }`}
                  >
                    Servicios
                  </button>
                  <button
                    onClick={() => setActiveSection("about")}
                    className={`px-3 py-2 rounded-md transition-colors ${
                      activeSection === "about"
                        ? "bg-white text-primary font-medium"
                        : "text-primary-foreground hover:bg-white/10"
                    }`}
                  >
                    Nosotros
                  </button>
                </nav>
              </div>
              <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
                <span className="block text-sm text-center sm:text-left w-full">Bienvenido, {user.displayName}</span>
                <img
                  src={user.photoURL || "/placeholder.svg?height=64&width=64&query=user+avatar"}
                  alt="Avatar"
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-2 border-primary-foreground/30 object-cover"
                />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onLogout}
                  className="w-full sm:w-auto text-primary-foreground hover:bg-primary-foreground/10"
                >
                  Salir
                </Button>
              </div>
            </div>
          </div>
        </header>

  <main className="flex-1 w-full max-w-7xl mx-auto px-2 sm:px-4 py-4 md:py-8">
          {activeSection === "home" && (
            <div className="space-y-10 md:space-y-16">
              {/* Hero Section */}
              <section className="text-center py-8 md:py-16">
                <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-6 text-balance">
                  Hola {user?.displayName}, <br />
                  <span className="text-primary">Transforma tu comunidad</span>
                </h1>
                <p className="text-base md:text-xl text-muted-foreground mb-8 max-w-3xl mx-auto text-pretty leading-relaxed">
                  Somos una plataforma que conecta ciudadanos comprometidos con oportunidades de servicio comunitario.
                  Juntos construimos comunidades más fuertes, más unidas y más prósperas para todos.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center w-full">
                  <Button size="lg" className="h-12 px-4 md:px-8 text-base w-full sm:w-auto" onClick={() => setActiveSection("services")}> 
                    Explorar Servicios
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    className="h-12 px-4 md:px-8 text-base bg-transparent w-full sm:w-auto"
                    onClick={() => setActiveSection("about")}
                  >
                    Conoce Más
                  </Button>
                </div>
              </section>

              {/* Mission Cards */}
              <section className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
                <Card className="p-4 md:p-8 text-center hover:shadow-lg transition-shadow">
                  <div className="w-16 h-16 mx-auto mb-6 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-2xl">🎯</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-4 text-foreground">Nuestra Misión</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Facilitar la participación ciudadana en proyectos que generen impacto positivo y duradero en nuestras
                    comunidades.
                  </p>
                </Card>

                <Card className="p-8 text-center hover:shadow-lg transition-shadow">
                  <div className="w-16 h-16 mx-auto mb-6 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-2xl">🤝</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-4 text-foreground">Cómo Ayudamos</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Conectamos voluntarios con organizaciones locales, facilitando la colaboración en proyectos de
                    infraestructura, eventos y desarrollo social.
                  </p>
                </Card>

                <Card className="p-8 text-center hover:shadow-lg transition-shadow">
                  <div className="w-16 h-16 mx-auto mb-6 bg-purple-100 rounded-full flex items-center justify-center">
                    <span className="text-2xl">🌟</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-4 text-foreground">Nuestro Impacto</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Más de 10,000 voluntarios activos han participado en proyectos que han beneficiado a miles de familias
                    en toda la región.
                  </p>
                </Card>
              </section>

              {/* Service Categories Preview */}
              <section>
                <div className="text-center mb-8 md:mb-12">
                  <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">¿Cómo deseas ayudar?</h2>
                  <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
                    Elige el área donde quieres hacer la diferencia y únete a proyectos que transforman vidas.
                  </p>
                </div>
                <ServiceCategories expanded />
              </section>
            </div>
          )}

          {activeSection === "services" && (
            <div>
              <div className="text-center mb-12">
                <h1 className="text-4xl font-bold text-foreground mb-4">Todos los Servicios</h1>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Explora todas las oportunidades de servicio comunitario disponibles en tu área.
                </p>
              </div>
              <ServiceCategories expanded />
            </div>
          )}

          {activeSection === "about" && (
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h1 className="text-4xl font-bold text-foreground mb-4">Sobre Nosotros</h1>
                <p className="text-lg text-muted-foreground">
                  Conoce más sobre nuestra organización y cómo estamos transformando comunidades.
                </p>
              </div>
              <div className="prose prose-lg mx-auto">
                <Card className="p-8">
                  <h2 className="text-2xl font-semibold mb-4 text-foreground">Nuestra Historia</h2>
                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    Fundada en 2020, nuestra plataforma nació de la necesidad de crear puentes entre ciudadanos
                    comprometidos y las oportunidades de servicio en sus comunidades. Creemos que cada persona tiene el
                    poder de generar cambios positivos cuando se le brindan las herramientas y oportunidades adecuadas.
                  </p>
                  <h3 className="text-xl font-semibold mb-3 text-foreground">Nuestros Valores</h3>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>
                      • <strong>Transparencia:</strong> Operamos con total claridad en todos nuestros procesos
                    </li>
                    <li>
                      • <strong>Inclusión:</strong> Creamos espacios donde todos pueden participar y contribuir
                    </li>
                    <li>
                      • <strong>Impacto:</strong> Nos enfocamos en generar cambios medibles y duraderos
                    </li>
                    <li>
                      • <strong>Colaboración:</strong> Fomentamos el trabajo conjunto entre todos los actores
                    </li>
                  </ul>
                </Card>
              </div>
            </div>
          )}

          {activeSection === "profile" && (
            <div className="max-w-2xl mx-auto">
              <h1 className="text-3xl font-bold text-foreground mb-8">Mi Perfil</h1>
              <SessionPanel user={user} onLogout={onLogout} />
            </div>
          )}
        </main>
      </div>
    );
  }

  


// Explicación:
// - Este componente recibe el usuario autenticado y una función para manejar el cierre de sesión.
// - Llama a la función de logout del dominio (clean architecture: separación de lógica y UI).
// - Muestra la foto, nombre y correo del usuario, y un botón para cerrar sesión.
