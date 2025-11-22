"use client"

import { useEffect, useState } from "react"
import dynamic from "next/dynamic"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Users, Calendar, Heart, Shield, Megaphone } from "lucide-react"
import { ActivitiesService, Activity } from "@/modules/infraestructura/firebase/ActivitiesService"

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
  {
    id: '1',
    title: 'Jornada de Limpieza del Río',
    description: 'Limpieza comunitaria del río Magdalena en el sector de La Candelaria',
    category: 'eventos',
    latitude: 4.6097,
    longitude: -74.0817,
    participants: 45,
    date: '2025-09-25',
    status: 'upcoming'
    ,
    createdBy: 'system',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '2',
    title: 'Colecta de Alimentos',
    description: 'Recolección de alimentos no perecederos para familias vulnerables',
    category: 'colectas',
    latitude: 4.6200,
    longitude: -74.0700,
    participants: 23,
    date: '2025-09-22',
    status: 'active'
    ,
    createdBy: 'system',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '3',
    title: 'Refugio Temporal San Cristóbal',
    description: 'Centro de acogida para personas en situación de calle',
    category: 'refugios',
    latitude: 4.5800,
    longitude: -74.0900,
    participants: 12,
    date: '2025-09-20',
    status: 'active'
    ,
    createdBy: 'system',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '4',
    title: 'Marcha por la Paz',
    description: 'Manifestación pacífica por la construcción de paz en la ciudad',
    category: 'protestas',
    latitude: 4.6000,
    longitude: -74.0750,
    participants: 150,
    date: '2025-09-28',
    status: 'upcoming'
    ,
    createdBy: 'system',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '5',
    title: 'Taller de Reciclaje',
    description: 'Capacitación en técnicas de reciclaje y cuidado ambiental',
    category: 'eventos',
    latitude: 4.5900,
    longitude: -74.0850,
    participants: 30,
    date: '2025-09-24',
    status: 'upcoming'
    ,
    createdBy: 'system',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '6',
    title: 'Colecta de Medicamentos',
    description: 'Recolección de medicamentos para el hospital local',
    category: 'colectas',
    latitude: 4.6100,
    longitude: -74.0650,
    participants: 18,
    date: '2025-09-21',
    status: 'active'
    ,
    createdBy: 'system',
    createdAt: new Date(),
    updatedAt: new Date()
  }
]

export function HeatmapView() {
  const [activities, setActivities] = useState<Activity[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Centro de Bogotá
  const center: [number, number] = [4.6097, -74.0817]

  useEffect(() => {
    // Cargar datos desde Firebase
    const loadActivities = async () => {
      setIsLoading(true)
      try {
        const activitiesData = await ActivitiesService.getAllActivities()
        setActivities(activitiesData)
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
              center={center}
              zoom={13}
              style={{ height: '100%', width: '100%' }}
              className="z-0"
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              
              {
                // Filtrar actividades que tengan coordenadas válidas. Algunas entradas en Firestore
                // pueden no tener los campos `latitude`/`longitude` (o pueden almacenarse como GeoPoint
                // en `location`). Aquí normalizamos y descartamos las actividades sin coords válidas
                // para evitar el error de Leaflet: "Invalid LatLng object: (undefined, undefined)".
                (() => {
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
                      // Loguear para depuración en desarrollo (no rompe la UI)
                      // eslint-disable-next-line no-console
                      console.warn(`Skipping activity ${activity.id} - missing/invalid coords`, { rawLat, rawLng, activity })
                    }
                    return ok
                  })

                  return activitiesWithCoords.map((activity) => {
                    const config = categoryConfig[activity.category]
                    const Icon = config.icon
                    const a: any = activity
                    const rawLat = a.latitude ?? a.location?.latitude
                    const rawLng = a.longitude ?? a.location?.longitude
                    const lat = toNumber(rawLat) as number
                    const lng = toNumber(rawLng) as number

                    return (
                      <CircleMarker
                        key={activity.id}
                        center={[lat, lng]}
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
                  })
                })()
              }
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
    </div>
  )
}
