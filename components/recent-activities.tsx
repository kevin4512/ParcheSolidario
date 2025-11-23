"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Calendar, Users, MapPin, Heart, Shield, Megaphone, Clock, Target } from "lucide-react"
import { Activity } from "@/modules/infraestructura/firebase/ActivitiesService"
import { useActivitiesContext } from "@/contexts/ActivitiesContext"

// Dejamos el arreglo mock vacío. La fuente será Firestore via contexto
const mockActivities: Activity[] = []

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
  const { activities, isLoading, loadActivities } = useActivitiesContext()
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null)

  // No necesitamos cargar aquí, el contexto ya lo hace automáticamente

  // Obtener las 6 actividades más recientes
  const recentActivities = activities
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 6)

  const formatTime = (time: string) => {
    if (!time) return ""
    const [hours, minutes] = time.split(':')
    const hour = parseInt(hours)
    const ampm = hour >= 12 ? 'PM' : 'AM'
    const displayHour = hour % 12 || 12
    return `${displayHour}:${minutes} ${ampm}`
  }

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
                  onClick={() => setSelectedActivity(activity)}
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

      {/* Dialog de detalles */}
      {selectedActivity && (
        <Dialog open={!!selectedActivity} onOpenChange={() => setSelectedActivity(null)}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <div className="flex items-center gap-3 mb-2">
                {(() => {
                  const config = categoryConfig[selectedActivity.category]
                  const Icon = config.icon
                  return (
                    <div className={`w-10 h-10 rounded-full ${config.bgColor} flex items-center justify-center`}>
                      <Icon className={`h-5 w-5 ${config.textColor}`} />
                    </div>
                  )
                })()}
                <DialogTitle className="text-2xl">{selectedActivity.title}</DialogTitle>
              </div>
              <div className="flex items-center gap-2">
                {(() => {
                  const config = categoryConfig[selectedActivity.category]
                  return (
                    <Badge 
                      variant="outline" 
                      className={`text-xs ${config.textColor} border-current`}
                    >
                      {config.label}
                    </Badge>
                  )
                })()}
                <Badge 
                  variant={selectedActivity.status === 'active' ? 'default' : 'secondary'}
                  className="text-xs"
                >
                  {selectedActivity.status === 'active' ? 'Activo' : 
                   selectedActivity.status === 'upcoming' ? 'Próximo' : 'Completado'}
                </Badge>
              </div>
            </DialogHeader>
            
            <div className="space-y-6 pt-4">
              <div>
                <h4 className="font-semibold mb-2 text-foreground">Descripción</h4>
                <p className="text-muted-foreground leading-relaxed">
                  {selectedActivity.description}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <span className="font-semibold text-foreground">Ubicación:</span>
                      <p className="text-muted-foreground">{selectedActivity.location || 'Medellín'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <span className="font-semibold text-foreground">Fecha:</span>
                      <p className="text-muted-foreground">
                        {new Date(selectedActivity.date).toLocaleDateString('es-CO', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <span className="font-semibold text-foreground">Hora:</span>
                      <p className="text-muted-foreground">
                        {formatTime(selectedActivity.time)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <span className="font-semibold text-foreground">Participantes:</span>
                      <p className="text-muted-foreground">
                        {selectedActivity.participants} / {selectedActivity.capacity}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Target className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <span className="font-semibold text-foreground">Objetivo:</span>
                      <p className="text-muted-foreground">{selectedActivity.fundraisingGoal}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-2 pt-4 border-t">
                <Button variant="default" className="flex-1">
                  Participar
                </Button>
                <Button variant="outline" className="flex-1">
                  Compartir
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
