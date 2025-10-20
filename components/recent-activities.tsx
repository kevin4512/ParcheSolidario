"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Users, MapPin, Heart, Shield, Megaphone } from "lucide-react"
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

  // No necesitamos cargar aquí, el contexto ya lo hace automáticamente

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
