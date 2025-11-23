"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Calendar, Users, MapPin, Clock, Target, Heart, Shield, Megaphone, ArrowLeft } from "lucide-react"
import { Activity } from "@/modules/infraestructura/firebase/ActivitiesService"
import { useActivitiesContext } from "@/contexts/ActivitiesContext"

const categoryConfig = {
  eventos: {
    color: '#3b82f6',
    icon: Calendar,
    label: 'Eventos',
    bgColor: 'bg-blue-100',
    textColor: 'text-blue-800',
    name: 'Eventos',
    description: 'Participa en eventos comunitarios'
  },
  colectas: {
    color: '#10b981',
    icon: Heart,
    label: 'Colectas',
    bgColor: 'bg-green-100',
    textColor: 'text-green-800',
    name: 'Colectas',
    description: 'Ayuda con donaciones y colectas'
  },
  refugios: {
    color: '#f59e0b',
    icon: Shield,
    label: 'Refugios',
    bgColor: 'bg-yellow-100',
    textColor: 'text-yellow-800',
    name: 'Refugios',
    description: 'Centros de acogida y refugios'
  },
  protestas: {
    color: '#ef4444',
    icon: Megaphone,
    label: 'Protestas',
    bgColor: 'bg-red-100',
    textColor: 'text-red-800',
    name: 'Protestas',
    description: 'Manifestaciones y movilizaciones'
  }
}

interface CategoryActivitiesProps {
  categoryId: string
  onBack?: () => void
}

export function CategoryActivities({ categoryId, onBack }: CategoryActivitiesProps) {
  const { activities, isLoading } = useActivitiesContext()
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null)

  // Filtrar actividades por categoría
  const filteredActivities = activities.filter(
    activity => activity.category === categoryId
  )

  const config = categoryConfig[categoryId as keyof typeof categoryConfig]
  const Icon = config?.icon || Calendar

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
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        {onBack && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver
          </Button>
        )}
        <div className="flex items-center gap-4 flex-1">
          {config && (
            <div className={`w-12 h-12 rounded-full ${config.bgColor} flex items-center justify-center`}>
              <Icon className={`h-6 w-6 ${config.textColor}`} />
            </div>
          )}
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              {config?.name || 'Categoría'}
            </h1>
            <p className="text-muted-foreground">
              {config?.description || 'Actividades de esta categoría'}
            </p>
          </div>
        </div>
      </div>

      {/* Actividades */}
      {filteredActivities.length === 0 ? (
        <div className="w-full text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
            <Icon className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">
            No hay actividades en esta categoría
          </h3>
          <p className="text-muted-foreground">
            Sé el primero en crear una actividad de {config?.name.toLowerCase() || 'esta categoría'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredActivities.map((activity) => {
            const activityConfig = categoryConfig[activity.category as keyof typeof categoryConfig]
            const ActivityIcon = activityConfig?.icon || Calendar
            
            return (
              <Card 
                key={activity.id} 
                className="hover:shadow-lg transition-all duration-300 border-0 shadow-md"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full ${activityConfig?.bgColor || 'bg-gray-100'} flex items-center justify-center`}>
                        <ActivityIcon className={`h-5 w-5 ${activityConfig?.textColor || 'text-gray-800'}`} />
                      </div>
                      <div>
                        <CardTitle className="text-lg leading-tight">{activity.title}</CardTitle>
                        <Badge 
                          variant="outline" 
                          className={`text-xs ${activityConfig?.textColor || 'text-gray-800'} border-current mt-1`}
                        >
                          {activityConfig?.label || activity.category}
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
                      <span>{activity.location || 'Medellín'}</span>
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
      )}

      {/* Dialog de detalles */}
      {selectedActivity && (
        <Dialog open={!!selectedActivity} onOpenChange={() => setSelectedActivity(null)}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <div className="flex items-center gap-3 mb-2">
                {config && (
                  <div className={`w-10 h-10 rounded-full ${config.bgColor} flex items-center justify-center`}>
                    <Icon className={`h-5 w-5 ${config.textColor}`} />
                  </div>
                )}
                <DialogTitle className="text-2xl">{selectedActivity.title}</DialogTitle>
              </div>
              <div className="flex items-center gap-2">
                <Badge 
                  variant="outline" 
                  className={`text-xs ${config?.textColor || 'text-gray-800'} border-current`}
                >
                  {config?.label || selectedActivity.category}
                </Badge>
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

