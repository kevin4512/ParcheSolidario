"use client"

import { Button } from "@/components/ui/button"
import { signInWithGoogle } from "@/modules/domain/auth/firebaseAuth" // Importa la función de login con Google
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Heart, Users, Sparkles } from "lucide-react"

// Definimos las props que recibe el LoginForm
interface LoginFormProps {
  onLoginSuccess?: (user: {
    displayName?: string | null;
    email?: string | null;
    photoURL?: string | null;
  }) => void;
}

// El formulario de login ahora acepta la prop onLoginSuccess
export function LoginForm({ onLoginSuccess }: LoginFormProps) {
  // Estado para deshabilitar el botón mientras se autentica
  const [loading, setLoading] = useState(false);

  // Esta función se ejecuta cuando el usuario hace click en el botón de Google
  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      // Llama a la función de login con Google (abre el popup)
      const user = await signInWithGoogle();
      // Si la prop existe, notifica al componente padre (AuthView) que el login fue exitoso
      if (onLoginSuccess && user) {
        onLoginSuccess({
          displayName: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
        });
      }
    } catch (error: any) {
      // Si el usuario cierra el popup o hay doble click, no es un error grave
      if (error.code === "auth/cancelled-popup-request" || error.code === "auth/popup-closed-by-user") {
        console.warn("El popup fue cancelado o cerrado por el usuario.");
      } else {
        // Otros errores sí se reportan
        console.error("Error al iniciar sesión con Google:", error);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
  <div className="w-full min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/30 via-accent/10 to-primary/30">
      <Card className="w-full max-w-md min-h-[32rem] shadow-2xl border-0 gradient-card relative overflow-hidden flex flex-col justify-center">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5"></div>
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-accent/10 to-transparent rounded-full blur-xl"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-primary/10 to-transparent rounded-full blur-lg"></div>

        <CardHeader className="text-center space-y-6 pb-8 relative z-10">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent rounded-full blur-md opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>
              <div className="relative bg-gradient-to-br from-primary to-accent p-3 rounded-full">
              <Heart className="h-8 w-8 text-white fill-white" />
              <Users className="h-4 w-4 text-white absolute -bottom-1 -right-1 bg-accent rounded-full p-0.5" />
              <Sparkles className="h-3 w-3 text-white absolute -top-1 -left-1 animate-pulse" />
            </div>
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
              Parche Solidario
            </h1>
            <p className="text-xs text-muted-foreground font-medium">.......</p>
          </div>
        </div>

        <div className="space-y-3">
          <CardTitle className="text-2xl font-bold text-balance bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
            Únete a nuestra comunidad
          </CardTitle>
          <CardDescription className="text-muted-foreground text-pretty text-base leading-relaxed">
            Conecta con personas que quieren hacer la diferencia. Juntos construimos un mundo más solidario y lleno de
            esperanza.
          </CardDescription>
        </div>
      </CardHeader>

      <CardContent className="space-y-6 relative z-10">
        <Button
          onClick={handleGoogleLogin}
          disabled={loading} // Deshabilita el botón mientras se autentica
          className="w-full h-14 gradient-button text-white font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 group relative overflow-hidden"
          size="lg"
        >
          {/* Puedes mostrar un loader si loading es true */}
          {loading ? (
            <span className="relative z-10">Cargando...</span>
          ) : (
            <>
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
              <svg className="w-6 h-6 mr-3 relative z-10" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              <span className="relative z-10">Continuar con Google</span>
            </>
          )}
        </Button>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-gradient-to-r from-transparent via-border to-transparent" />
          </div>
          <div className="relative flex justify-center text-sm uppercase">
            <span className="gradient-card px-4 py-1 text-muted-foreground font-medium rounded-full border border-border/50">
              O únete de otra forma
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          //aqui el btn de twiter o x
          <Button
            variant="outline"
            className="h-12 border-2 border-accent/20 hover:border-accent/40 hover:bg-accent/5 transition-all duration-300 bg-card/50 backdrop-blur-sm group"
          >
            <svg
              className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform duration-300"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
            <span className="font-medium">Facebook</span>
          </Button>
        </div>

        <div className="text-center space-y-3 pt-2">
          <div className="w-full h-px bg-gradient-to-r from-transparent via-border to-transparent"></div>
          <p className="text-sm text-muted-foreground text-pretty leading-relaxed">
            Al continuar, aceptas nuestros{" "}
            <a
              href="#"
              className="text-primary hover:text-primary/80 underline underline-offset-2 font-medium transition-colors"
            >
              Términos de Servicio
            </a>{" "}
            y{" "}
            <a
              href="#"
              className="text-primary hover:text-primary/80 underline underline-offset-2 font-medium transition-colors"
            >
              Política de Privacidad
            </a>
          </p>
        </div>
      </CardContent>
    </Card>
    </div>     
  )
}


