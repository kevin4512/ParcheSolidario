"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin, Shield, Eye, Navigation } from "lucide-react"
import { useGeolocation } from "@/hooks/useGeolocation"

interface LocationPermissionProps {
  onLocationGranted: (latitude: number, longitude: number) => void
  onSkip: () => void
}

export function LocationPermission({ onLocationGranted, onSkip }: LocationPermissionProps) {
  const { latitude, longitude, error, loading, requestLocation, hasLocation } = useGeolocation()
  const [showPermission, setShowPermission] = useState(true)
  const [isRequesting, setIsRequesting] = useState(false)

  // Si ya tenemos ubicación, llamar al callback
  if (hasLocation && latitude && longitude) {
    onLocationGranted(latitude, longitude)
    return null
  }

  if (!showPermission) {
    return null
  }

  const handleRequestLocation = async () => {
    setIsRequesting(true)
    try {
      await requestLocation()
    } catch (err) {
      console.error("Error al solicitar ubicación:", err)
    } finally {
      setIsRequesting(false)
    }
  }

  // Efecto para detectar cuando se obtiene la ubicación
  useEffect(() => {
    if (hasLocation && latitude && longitude) {
      console.log("Ubicación obtenida:", { latitude, longitude })
      onLocationGranted(latitude, longitude)
    }
  }, [hasLocation, latitude, longitude, onLocationGranted])

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-2xl border-0">
        <CardHeader className="text-center space-y-4">
          <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
            <MapPin className="h-8 w-8 text-primary" />
          </div>
          <div>
            <CardTitle className="text-2xl font-bold">Ubicación Requerida</CardTitle>
            <CardDescription className="text-base mt-2">
              Para mostrarte las actividades más cercanas a ti, necesitamos acceder a tu ubicación.
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Beneficios de permitir ubicación */}
          <div className="space-y-3">
            <h3 className="font-semibold text-sm text-foreground">¿Por qué necesitamos tu ubicación?</h3>
            <div className="space-y-2">
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <Navigation className="h-4 w-4 text-primary" />
                <span>Mostrar actividades cercanas a ti</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <Eye className="h-4 w-4 text-primary" />
                <span>Centrar el mapa en tu zona</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <Shield className="h-4 w-4 text-primary" />
                <span>Tu ubicación no se comparte con otros usuarios</span>
              </div>
            </div>
          </div>

          {/* Error message */}
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-800">{error}</p>
              <p className="text-xs text-red-600 mt-1">
                Si el problema persiste, verifica que tu navegador tenga permisos de ubicación habilitados.
              </p>
            </div>
          )}

          {/* Botones de acción */}
          <div className="space-y-3">
            <Button
              onClick={handleRequestLocation}
              disabled={loading || isRequesting}
              className="w-full h-12 text-base font-semibold"
              size="lg"
            >
              {(loading || isRequesting) ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Obteniendo ubicación...
                </>
              ) : (
                <>
                  <MapPin className="h-4 w-4 mr-2" />
                  Permitir Ubicación
                </>
              )}
            </Button>

            <Button
              onClick={() => {
                setShowPermission(false)
                onSkip()
              }}
              variant="outline"
              className="w-full h-10"
            >
              Usar ubicación por defecto
            </Button>
          </div>

          {/* Información de privacidad */}
          <div className="text-xs text-muted-foreground text-center leading-relaxed">
            <p>
              Tu ubicación se usa solo para mostrar actividades cercanas y no se almacena ni comparte.
              Puedes cambiar este permiso en la configuración de tu navegador.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
