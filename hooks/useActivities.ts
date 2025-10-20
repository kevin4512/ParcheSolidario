"use client"

import { useState, useEffect } from "react"
import { Activity, ActivitiesService } from "@/modules/infraestructura/firebase/ActivitiesService"

export function useActivities() {
  const [activities, setActivities] = useState<Activity[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isLoadingRef, setIsLoadingRef] = useState(false) // Para evitar múltiples cargas simultáneas

  const loadActivities = async () => {
    // Evitar múltiples cargas simultáneas
    if (isLoadingRef) {
      console.log("⏸️ Ya hay una carga en progreso, saltando...")
      return
    }
    
    setIsLoadingRef(true)
    setIsLoading(true)
    setError(null)
    
    // Timeout para evitar que se quede cargando indefinidamente
    const timeoutId = setTimeout(() => {
      console.warn("⏰ Timeout: Cargando actividades tardó más de 10 segundos")
      setIsLoading(false)
      setError("Timeout: La carga de actividades tardó demasiado")
      setActivities([])
      setIsLoadingRef(false)
    }, 10000)
    
    try {
      console.log("🔄 Cargando actividades desde Firestore...")
      const activitiesData = await ActivitiesService.getAllActivities()
      console.log("✅ Actividades cargadas:", activitiesData.length, activitiesData)
      
      // Verificar coordenadas de cada actividad
      activitiesData.forEach((activity, index) => {
        if (activity.latitude == null || activity.longitude == null || 
            isNaN(activity.latitude) || isNaN(activity.longitude)) {
          console.warn(`⚠️ Actividad ${index} (${activity.title}) tiene coordenadas inválidas:`, {
            latitude: activity.latitude,
            longitude: activity.longitude
          })
        }
      })
      
      setActivities(activitiesData)
    } catch (err) {
      console.error("❌ Error al cargar actividades:", err)
      setError(`Error al cargar las actividades: ${err instanceof Error ? err.message : 'Error desconocido'}`)
      // En caso de error, usar array vacío para evitar que se quede cargando
      setActivities([])
    } finally {
      clearTimeout(timeoutId)
      setIsLoading(false)
      setIsLoadingRef(false)
    }
  }

  const addActivity = (newActivity: Activity) => {
    setActivities(prev => [newActivity, ...prev])
  }

  const updateActivity = (updatedActivity: Activity) => {
    setActivities(prev => 
      prev.map(activity => 
        activity.id === updatedActivity.id ? updatedActivity : activity
      )
    )
  }

  const removeActivity = (activityId: string) => {
    setActivities(prev => prev.filter(activity => activity.id !== activityId))
  }

  useEffect(() => {
    loadActivities()
  }, [])

  return {
    activities,
    isLoading,
    error,
    loadActivities,
    addActivity,
    updateActivity,
    removeActivity
  }
}
