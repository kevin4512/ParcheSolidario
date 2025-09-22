"use client"

import { useEffect, useState } from "react"
import dynamic from "next/dynamic"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapPin, Users, Calendar, Heart, Shield, Megaphone, Navigation, RefreshCw } from "lucide-react"
import { ActivitiesService, Activity } from "@/modules/infraestructura/firebase/ActivitiesService"
import { LocationPermission } from "@/components/location-permission"
import { useGeolocation } from "@/hooks/useGeolocation"

// Importar Leaflet dinámicamente para evitar problemas de SSR
const MapContainer = dynamic(() => import("react-leaflet").then((mod) => mod.MapContainer), { ssr: false })
const TileLayer = dynamic(() => import("react-leaflet").then((mod) => mod.TileLayer), { ssr: false })
const Marker = dynamic(() => import("react-leaflet").then((mod) => mod.Marker), { ssr: false })
const Popup = dynamic(() => import("react-leaflet").then((mod) => mod.Popup), { ssr: false })
const CircleMarker = dynamic(() => import("react-leaflet").then((mod) => mod.CircleMarker), { ssr: false })

// Los tipos de Activity ahora se importan desde ActivitiesService

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

// Datos de ejemplo (en producción vendrían de Firebase)
const mockActivities: Activity[] = [
  // EVENTOS
  {
    id: '1',
    title: 'Jornada de Limpieza del Río Medellín',
    description: 'Limpieza comunitaria del río Medellín en el sector de El Poblado. Incluye recolección de basura y siembra de árboles nativos.',
    category: 'eventos',
    latitude: 6.2000,
    longitude: -75.5700,
    participants: 45,
    date: '2025-09-25',
    status: 'upcoming',
    createdBy: 'admin',
    createdAt: new Date('2025-09-20'),
    updatedAt: new Date('2025-09-20')
  },
  {
    id: '2',
    title: 'Taller de Reciclaje - Laureles',
    description: 'Capacitación en técnicas de reciclaje y cuidado ambiental en el parque de Laureles. Aprende a separar residuos correctamente.',
    category: 'eventos',
    latitude: 6.2300,
    longitude: -75.5900,
    participants: 30,
    date: '2025-09-24',
    status: 'upcoming',
    createdBy: 'admin',
    createdAt: new Date('2025-09-19'),
    updatedAt: new Date('2025-09-19')
  },
  {
    id: '3',
    title: 'Festival de Arte Urbano - Comuna 13',
    description: 'Celebración del arte y la cultura en la Comuna 13. Incluye murales, música y actividades para toda la familia.',
    category: 'eventos',
    latitude: 6.2500,
    longitude: -75.5700,
    participants: 80,
    date: '2025-09-30',
    status: 'upcoming',
    createdBy: 'admin',
    createdAt: new Date('2025-09-18'),
    updatedAt: new Date('2025-09-18')
  },
  {
    id: '4',
    title: 'Caminata Ecológica - Cerro Nutibara',
    description: 'Caminata guiada por el Cerro Nutibara para conocer la flora y fauna local. Incluye charla sobre conservación ambiental.',
    category: 'eventos',
    latitude: 6.2200,
    longitude: -75.6000,
    participants: 25,
    date: '2025-09-26',
    status: 'upcoming',
    createdBy: 'admin',
    createdAt: new Date('2025-09-17'),
    updatedAt: new Date('2025-09-17')
  },

  // COLECTAS
  {
    id: '5',
    title: 'Colecta de Alimentos - Comuna 13',
    description: 'Recolección de alimentos no perecederos para familias vulnerables de la Comuna 13. Punto de entrega en el parque principal.',
    category: 'colectas',
    latitude: 6.2500,
    longitude: -75.5700,
    participants: 23,
    date: '2025-09-22',
    status: 'active',
    createdBy: 'admin',
    createdAt: new Date('2025-09-15'),
    updatedAt: new Date('2025-09-15')
  },
  {
    id: '6',
    title: 'Colecta de Medicamentos - Belén',
    description: 'Recolección de medicamentos para el hospital de Belén. Se necesitan medicamentos para diabetes, hipertensión y enfermedades respiratorias.',
    category: 'colectas',
    latitude: 6.2600,
    longitude: -75.5600,
    participants: 18,
    date: '2025-09-21',
    status: 'active',
    createdBy: 'admin',
    createdAt: new Date('2025-09-14'),
    updatedAt: new Date('2025-09-14')
  },
  {
    id: '7',
    title: 'Colecta de Ropa de Invierno - Centro',
    description: 'Recolección de ropa de abrigo para personas en situación de calle. Se aceptan chaquetas, cobijas y ropa en buen estado.',
    category: 'colectas',
    latitude: 6.2442,
    longitude: -75.5812,
    participants: 35,
    date: '2025-09-23',
    status: 'active',
    createdBy: 'admin',
    createdAt: new Date('2025-09-16'),
    updatedAt: new Date('2025-09-16')
  },
  {
    id: '8',
    title: 'Colecta de Útiles Escolares - Robledo',
    description: 'Recolección de útiles escolares para niños de escasos recursos en Robledo. Se necesitan cuadernos, lápices, colores y mochilas.',
    category: 'colectas',
    latitude: 6.2800,
    longitude: -75.6000,
    participants: 42,
    date: '2025-09-27',
    status: 'upcoming',
    createdBy: 'admin',
    createdAt: new Date('2025-09-13'),
    updatedAt: new Date('2025-09-13')
  },

  // REFUGIOS
  {
    id: '9',
    title: 'Refugio Temporal Centro',
    description: 'Centro de acogida para personas en situación de calle en el centro de Medellín. Ofrece comida caliente, duchas y ropa limpia.',
    category: 'refugios',
    latitude: 6.2400,
    longitude: -75.5900,
    participants: 12,
    date: '2025-09-20',
    status: 'active',
    createdBy: 'admin',
    createdAt: new Date('2025-09-12'),
    updatedAt: new Date('2025-09-12')
  },
  {
    id: '10',
    title: 'Refugio de Emergencia - El Poblado',
    description: 'Refugio temporal para familias desplazadas en El Poblado. Ofrece alojamiento temporal, alimentación y apoyo psicosocial.',
    category: 'refugios',
    latitude: 6.2000,
    longitude: -75.5700,
    participants: 8,
    date: '2025-09-19',
    status: 'active',
    createdBy: 'admin',
    createdAt: new Date('2025-09-11'),
    updatedAt: new Date('2025-09-11')
  },
  {
    id: '11',
    title: 'Casa de Acogida - Manrique',
    description: 'Casa de acogida para mujeres víctimas de violencia en Manrique. Ofrece refugio seguro, asesoría legal y apoyo psicológico.',
    category: 'refugios',
    latitude: 6.2700,
    longitude: -75.5500,
    participants: 15,
    date: '2025-09-18',
    status: 'active',
    createdBy: 'admin',
    createdAt: new Date('2025-09-10'),
    updatedAt: new Date('2025-09-10')
  },

  // PROTESTAS
  {
    id: '12',
    title: 'Marcha por la Paz - Medellín',
    description: 'Manifestación pacífica por la construcción de paz en Medellín. Reclama mayor inversión social y oportunidades para los jóvenes.',
    category: 'protestas',
    latitude: 6.2500,
    longitude: -75.5800,
    participants: 150,
    date: '2025-09-28',
    status: 'upcoming',
    createdBy: 'admin',
    createdAt: new Date('2025-09-09'),
    updatedAt: new Date('2025-09-09')
  },
  {
    id: '13',
    title: 'Movilización por el Medio Ambiente',
    description: 'Protesta pacífica exigiendo políticas ambientales más estrictas y protección de los cerros tutelares de Medellín.',
    category: 'protestas',
    latitude: 6.2200,
    longitude: -75.6000,
    participants: 75,
    date: '2025-09-29',
    status: 'upcoming',
    createdBy: 'admin',
    createdAt: new Date('2025-09-08'),
    updatedAt: new Date('2025-09-08')
  },
  {
    id: '14',
    title: 'Manifestación por la Educación Pública',
    description: 'Protesta estudiantil exigiendo mejoras en la educación pública y mayor presupuesto para las universidades estatales.',
    category: 'protestas',
    latitude: 6.2600,
    longitude: -75.5700,
    participants: 200,
    date: '2025-09-25',
    status: 'upcoming',
    createdBy: 'admin',
    createdAt: new Date('2025-09-07'),
    updatedAt: new Date('2025-09-07')
  }
]

export function HeatmapView() {
  const [activities, setActivities] = useState<Activity[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null)
  const [showLocationPermission, setShowLocationPermission] = useState(false)
  const [mapKey, setMapKey] = useState(0) // Para forzar re-render del mapa

  // Centro por defecto (Medellín)
  const defaultCenter: [number, number] = [6.2442, -75.5812]
  const center = userLocation || defaultCenter

  useEffect(() => {
    // Cargar datos desde Firebase
    const loadActivities = async () => {
      setIsLoading(true)
      try {
        // Por ahora usar datos de ejemplo directamente
        // En producción, cambiar por: const activitiesData = await ActivitiesService.getAllActivities()
        setActivities(mockActivities)
        console.log("Actividades cargadas:", mockActivities.length)
      } catch (error) {
        console.error("Error al cargar actividades:", error)
        // En caso de error, usar datos de ejemplo
        setActivities(mockActivities)
      } finally {
        setIsLoading(false)
      }
    }

    loadActivities()
  }, [])

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
        </div>
      </div>
    )
  }

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
              
              {filteredActivities.map((activity) => {
                const config = categoryConfig[activity.category]
                const Icon = config.icon
                
                return (
                  <CircleMarker
                    key={activity.id}
                    center={[activity.latitude, activity.longitude]}
                    radius={Math.max(8, Math.min(20, activity.participants / 5))}
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
