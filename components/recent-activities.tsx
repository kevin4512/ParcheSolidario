"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Users, MapPin, Heart, Shield, Megaphone } from "lucide-react"
import { Activity } from "@/modules/infraestructura/firebase/ActivitiesService"

// Datos de ejemplo (mismos que en heatmap-view.tsx)
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

const categoryConfig = {
  eventos: {
    color: '#3b82f6',
    icon: Calendar,
    label: 'Eventos',
    bgColor: 'bg-blue-100',
    textColor: 'text-blue-800'
  },
  colectas: {
    color: '#10b981',
    icon: Heart,
    label: 'Colectas',
    bgColor: 'bg-green-100',
    textColor: 'text-green-800'
  },
  refugios: {
    color: '#f59e0b',
    icon: Shield,
    label: 'Refugios',
    bgColor: 'bg-yellow-100',
    textColor: 'text-yellow-800'
  },
  protestas: {
    color: '#ef4444',
    icon: Megaphone,
    label: 'Protestas',
    bgColor: 'bg-red-100',
    textColor: 'text-red-800'
  }
}

export function RecentActivities() {
  const [activities, setActivities] = useState<Activity[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadActivities = async () => {
      setIsLoading(true)
      try {
        // Usar datos de ejemplo
        setActivities(mockActivities)
        console.log("Actividades recientes cargadas:", mockActivities.length)
      } catch (error) {
        console.error("Error al cargar actividades:", error)
        setActivities([])
      } finally {
        setIsLoading(false)
      }
    }

    loadActivities()
  }, [])

  // Obtener las 6 actividades más recientes
  const recentActivities = activities
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 6)

  if (isLoading) {
    return (
      <div className="w-full h-64 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-muted-foreground">Cargando actividades...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full space-y-6">
      <div className="text-center space-y-4">
        <h2 className="text-2xl font-bold text-foreground">Actividades Recientes</h2>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Últimas actividades agregadas a la plataforma en Medellín
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {recentActivities.map((activity) => {
          const config = categoryConfig[activity.category]
          const Icon = config.icon
          
          return (
            <Card key={activity.id} className="hover:shadow-lg transition-all duration-300 border-0 shadow-md">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full ${config.bgColor} flex items-center justify-center`}>
                      <Icon className={`h-5 w-5 ${config.textColor}`} />
                    </div>
                    <div>
                      <CardTitle className="text-lg leading-tight">{activity.title}</CardTitle>
                      <Badge 
                        variant="outline" 
                        className={`text-xs ${config.textColor} border-current mt-1`}
                      >
                        {config.label}
                      </Badge>
                    </div>
                  </div>
                  <Badge 
                    variant={activity.status === 'active' ? 'default' : 'secondary'}
                    className="text-xs"
                  >
                    {activity.status === 'active' ? 'Activo' : 
                     activity.status === 'upcoming' ? 'Próximo' : 'Completado'}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
                  {activity.description}
                </p>
                
                <div className="space-y-2 text-xs text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Users className="h-3 w-3" />
                    <span>{activity.participants} participantes</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-3 w-3" />
                    <span>{new Date(activity.date).toLocaleDateString('es-CO')}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-3 w-3" />
                    <span>Medellín</span>
                  </div>
                </div>
                
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full text-xs"
                >
                  Ver Detalles
                </Button>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="text-center">
        <Button variant="outline" className="px-8">
          Ver Todas las Actividades
        </Button>
      </div>
    </div>
  )
}
