"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Users, MapPin, Clock, Target, Heart, Shield, Megaphone } from "lucide-react"
import { Activity } from "@/modules/infraestructura/firebase/ActivitiesService"
import { useActivitiesContext } from "@/contexts/ActivitiesContext"

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

export function EventPublications() {
  const { activities, isLoading, error } = useActivitiesContext()

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
          <p className="text-muted-foreground">Cargando eventos...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="w-full text-center py-12">
        <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
          <Calendar className="h-8 w-8 text-red-600" />
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">Error al cargar eventos</h3>
        <p className="text-muted-foreground">{error}</p>
      </div>
    )
  }

  if (activities.length === 0) {
    return (
      <div className="w-full text-center py-12">
        <div className="w-16 h-16 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
          <Calendar className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">No hay eventos publicados</h3>
        <p className="text-muted-foreground">Sé el primero en crear un evento para tu comunidad</p>
      </div>
    )
  }

  return (
    <div className="w-full space-y-6">
      <div className="text-center space-y-4">
        <h2 className="text-2xl font-bold text-foreground">Eventos Publicados</h2>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Últimos eventos creados por la comunidad
        </p>
      </div>

      <div className="space-y-4">
        {activities.map((activity) => {
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
                      <CardTitle className="text-lg leading-tight">🗓️ {activity.title}</CardTitle>
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span>📍 Lugar: {activity.location || 'Medellín'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>📆 Fecha: {new Date(activity.date).toLocaleDateString('es-CO')}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>⏰ Hora: {formatTime(activity.time)}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Users className="h-4 w-4" />
                      <span>👥 Capacidad: {activity.capacity} personas</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Target className="h-4 w-4" />
                      <span>💰 Objetivo: {activity.fundraisingGoal}</span>
                    </div>
                  </div>
                </div>
                
                <div className="pt-2 border-t">
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    📝 Descripción: {activity.description}
                  </p>
                </div>
                
                <div className="flex gap-2 pt-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1 text-xs"
                  >
                    Participar
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1 text-xs"
                  >
                    Compartir
                  </Button>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
