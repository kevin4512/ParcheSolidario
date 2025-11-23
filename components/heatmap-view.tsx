"use client"
"use client"

import { useEffect, useState } from "react"
import dynamic from "next/dynamic"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapPin, Users, Calendar, Heart, Shield, Megaphone, Navigation, RefreshCw } from "lucide-react"
import { ActivitiesService, Activity } from "@/modules/infraestructura/firebase/ActivitiesService"
import { useActivitiesContext } from "@/contexts/ActivitiesContext"
import { LocationPermission } from "@/components/location-permission"

// Importar Leaflet dinámicamente para evitar problemas de SSR
const MapContainer = dynamic(() => import("react-leaflet").then((mod) => mod.MapContainer), { ssr: false })
const TileLayer = dynamic(() => import("react-leaflet").then((mod) => mod.TileLayer), { ssr: false })
const Marker = dynamic(() => import("react-leaflet").then((mod) => mod.Marker), { ssr: false })
const Popup = dynamic(() => import("react-leaflet").then((mod) => mod.Popup), { ssr: false })
const CircleMarker = dynamic(() => import("react-leaflet").then((mod) => mod.CircleMarker), { ssr: false })

// Configuración de categorías con colores
const categoryConfig = {
  eventos: {
    color: '#3b82f6', // Azul
    icon: Calendar,
    label: 'Eventos',
    bgColor: 'bg-blue-100',
    textColor: 'text-blue-800'
  },
  colectas: {
    color: '#10b981', // Verde
    icon: Heart,
    label: 'Colectas',
    bgColor: 'bg-green-100',
    textColor: 'text-green-800'
  },
  refugios: {
    color: '#f59e0b', // Amarillo/Naranja
    icon: Shield,
    label: 'Refugios',
    bgColor: 'bg-yellow-100',
    textColor: 'text-yellow-800'
  },
  protestas: {
    color: '#ef4444', // Rojo
    icon: Megaphone,
    label: 'Protestas',
    bgColor: 'bg-red-100',
    textColor: 'text-red-800'
  }
}

const mockActivities: Activity[] = []

export function HeatmapView() {
  const { activities, isLoading, error, loadActivities } = useActivitiesContext()
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null)
  const [showLocationPermission, setShowLocationPermission] = useState(false)
  const [mapKey, setMapKey] = useState(0) // Para forzar re-render del mapa

  // Centro por defecto (Medellín)
  const defaultCenter: [number, number] = [6.2442, -75.5812]
  const center = userLocation || defaultCenter

  // No necesitamos cargar aquí, el contexto ya lo hace automáticamente

  // Mostrar modal de permisos de ubicación al cargar
  useEffect(() => {
    const hasRequestedLocation = localStorage.getItem('locationRequested')
    if (!hasRequestedLocation) {
      setShowLocationPermission(true)
    }
  }, [])

  const handleLocationGranted = (latitude: number, longitude: number) => {
    setUserLocation([latitude, longitude])
    setShowLocationPermission(false)
    setMapKey(prev => prev + 1) // Forzar re-render del mapa
    localStorage.setItem('locationRequested', 'true')
  }

  const handleLocationSkip = () => {
    setShowLocationPermission(false)
    localStorage.setItem('locationRequested', 'true')
  }

  const requestLocationAgain = () => {
    setShowLocationPermission(true)
  }

  const filteredActivities = selectedCategory 
    ? activities.filter(activity => activity.category === selectedCategory)
    : activities

  const getCategoryStats = () => {
    const stats = activities.reduce((acc, activity) => {
      if (!acc[activity.category]) {
        acc[activity.category] = 0
      }
      acc[activity.category]++
      return acc
    }, {} as Record<string, number>)

    return stats
  }

  const stats = getCategoryStats()

  if (isLoading) {
    return (
      <div className="w-full h-96 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-muted-foreground">Cargando mapa de actividades...</p>
          <Button 
            variant="outline" 
            onClick={() => {
              console.log("🔄 Recargando manualmente...")
              loadActivities()
            }}
            className="mt-4"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Recargar
          </Button>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="w-full h-96 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
            <RefreshCw className="h-8 w-8 text-red-600" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">Error al cargar actividades</h3>
          <p className="text-muted-foreground text-sm max-w-md">{error}</p>
          <Button 
            variant="outline" 
            onClick={() => {
              console.log("🔄 Recargando después de error...")
              loadActivities()
            }}
            className="mt-4"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Reintentar
          </Button>
        </div>
      </div>
    )
  }

  // Normalización / filtrado de coordenadas (defensivo)
  const toNumber = (v: any): number | undefined => {
    if (typeof v === 'number' && Number.isFinite(v)) return v
    if (v == null) return undefined
    const n = Number(v)
    return Number.isFinite(n) ? n : undefined
  }

  const activitiesWithCoords = filteredActivities.filter((activity) => {
    const a: any = activity
    const rawLat = a.latitude ?? a.location?.latitude
    const rawLng = a.longitude ?? a.location?.longitude
    const lat = toNumber(rawLat)
    const lng = toNumber(rawLng)
    const ok = typeof lat === 'number' && typeof lng === 'number'
    if (!ok) {
      // eslint-disable-next-line no-console
      console.warn(`Skipping activity ${activity.id} - missing/invalid coords`, { rawLat, rawLng, activity })
    }
    return ok
  })

  return (
    <div className="w-full space-y-6">
      {/* Header con estadísticas */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold text-foreground">Mapa de Actividades</h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Visualiza las actividades de la plataforma y encuentra oportunidades de participación en tu zona
        </p>
        
        {/* Botón para solicitar ubicación */}
        {!userLocation && (
          <div className="flex justify-center">
            <Button
              onClick={requestLocationAgain}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Navigation className="h-4 w-4" />
              Centrar en mi ubicación
            </Button>
          </div>
        )}
        
        {/* Indicador de ubicación actual */}
        {userLocation && (
          <div className="flex justify-center">
            <Badge variant="secondary" className="flex items-center gap-2">
              <MapPin className="h-3 w-3" />
              Centrado en tu ubicación
              <Button
                onClick={requestLocationAgain}
                variant="ghost"
                size="sm"
                className="h-4 w-4 p-0 ml-2"
              >
                <RefreshCw className="h-3 w-3" />
              </Button>
            </Badge>
          </div>
        )}
      </div>

      {/* Estadísticas por categoría */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Object.entries(categoryConfig).map(([key, config]) => {
          const Icon = config.icon
          const count = stats[key] || 0
          return (
            <Card 
              key={key}
              className={`cursor-pointer transition-all hover:shadow-lg ${
                selectedCategory === key ? 'ring-2 ring-primary' : ''
              }`}
              onClick={() => setSelectedCategory(selectedCategory === key ? null : key)}
            >
              <CardContent className="p-4 text-center">
                <div className={`w-12 h-12 mx-auto mb-3 rounded-full ${config.bgColor} flex items-center justify-center`}>
                  <Icon className={`h-6 w-6 ${config.textColor}`} />
                </div>
                <h3 className="font-semibold text-sm mb-1">{config.label}</h3>
                <p className={`text-2xl font-bold ${config.textColor}`}>{count}</p>
                <p className="text-xs text-muted-foreground">actividades</p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Mapa */}
      <Card className="overflow-hidden">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Mapa Interactivo
              </CardTitle>
              <CardDescription>
                Haz clic en los marcadores para ver detalles de cada actividad
              </CardDescription>
            </div>
            <Badge variant="outline" className="text-sm">
              {filteredActivities.length} actividades mostradas
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="h-96 w-full">
            <MapContainer
              key={mapKey} // Forzar re-render cuando cambie la ubicación
              center={center}
              zoom={userLocation ? 15 : 13} // Zoom más cercano si tenemos ubicación del usuario
              style={{ height: '100%', width: '100%' }}
              className="z-0"
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              {/* Marcador de la ubicación del usuario */}
              {userLocation && (
                <Marker position={userLocation}>
                  <Popup>
                    <div className="p-2 text-center">
                      <div className="flex items-center gap-2 mb-2">
                        <MapPin className="h-4 w-4 text-primary" />
                        <span className="font-semibold text-sm">Tu ubicación</span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Lat: {userLocation[0].toFixed(4)}<br/>
                        Lng: {userLocation[1].toFixed(4)}
                      </p>
                    </div>
                  </Popup>
                </Marker>
              )}

              
              {filteredActivities
                .filter(activity => 
                  activity.latitude != null && 
                  activity.longitude != null && 
                  !isNaN(activity.latitude) && 
                  !isNaN(activity.longitude)
                )
                .map((activity) => {

                const config = categoryConfig[activity.category]
                const Icon = config.icon
                const a: any = activity
                const lat = toNumber(a.latitude ?? a.location?.latitude) as number
                const lng = toNumber(a.longitude ?? a.location?.longitude) as number

                return (
                  <CircleMarker
                    key={activity.id}

                    center={[activity.latitude, activity.longitude]}
                    radius={Math.max(8, Math.min(20, (activity.participants || 0) / 5))}

                    pathOptions={{
                      color: config.color,
                      fillColor: config.color,
                      fillOpacity: 0.6,
                      weight: 2
                    }}
                  >
                    <Popup>
                      <div className="p-2 min-w-[250px]">
                        <div className="flex items-start gap-3 mb-3">
                          <div className={`w-8 h-8 rounded-full ${config.bgColor} flex items-center justify-center flex-shrink-0`}>
                            <Icon className={`h-4 w-4 ${config.textColor}`} />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-sm mb-1">{activity.title}</h3>
                            <Badge 
                              variant="outline" 
                              className={`text-xs ${config.textColor} border-current`}
                            >
                              {config.label}
                            </Badge>
                          </div>
                        </div>
                        
                        <p className="text-xs text-muted-foreground mb-3 leading-relaxed">
                          {activity.description}
                        </p>
                        
                        <div className="space-y-2 text-xs">
                          <div className="flex items-center gap-2">
                            <Users className="h-3 w-3 text-muted-foreground" />
                            <span>{activity.participants} participantes</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-3 w-3 text-muted-foreground" />
                            <span>{new Date(activity.date).toLocaleDateString('es-CO')}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${
                              activity.status === 'active' ? 'bg-green-500' :
                              activity.status === 'upcoming' ? 'bg-blue-500' : 'bg-gray-500'
                            }`}></div>
                            <span className="capitalize">
                              {activity.status === 'active' ? 'Activo' :
                               activity.status === 'upcoming' ? 'Próximo' : 'Completado'}
                            </span>
                          </div>
                        </div>
                        
                        <div className="mt-3 pt-3 border-t">
                          <button className="w-full text-xs bg-primary text-primary-foreground px-3 py-1.5 rounded hover:bg-primary/90 transition-colors">
                            Ver Detalles
                          </button>
                        </div>
                      </div>
                    </Popup>
                  </CircleMarker>
                )
              })}
            </MapContainer>
          </div>
        </CardContent>
      </Card>

      {/* Leyenda */}
      <Card>
        <CardContent className="p-4">
          <h3 className="font-semibold mb-3">Leyenda</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {Object.entries(categoryConfig).map(([key, config]) => {
              const Icon = config.icon
              return (
                <div key={key} className="flex items-center gap-2">
                  <div 
                    className="w-4 h-4 rounded-full" 
                    style={{ backgroundColor: config.color }}
                  ></div>
                  <span className="text-sm">{config.label}</span>
                </div>
              )
            })}
          </div>
          <p className="text-xs text-muted-foreground mt-3">
            El tamaño de los círculos indica el número de participantes
          </p>
        </CardContent>
      </Card>

      {/* Modal de permisos de ubicación */}
      {showLocationPermission && (
        <LocationPermission
          onLocationGranted={handleLocationGranted}
          onSkip={handleLocationSkip}
        />
      )}
    </div>
  )
}

