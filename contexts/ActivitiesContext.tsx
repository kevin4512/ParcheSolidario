"use client"

import { createContext, useContext, ReactNode } from "react"
import { Activity } from "@/modules/infraestructura/firebase/ActivitiesService"
import { useActivities } from "@/hooks/useActivities"

interface ActivitiesContextType {
  activities: Activity[]
  isLoading: boolean
  error: string | null
  loadActivities: () => Promise<void>
  addActivity: (activity: Activity) => void
  updateActivity: (activity: Activity) => void
  removeActivity: (activityId: string) => void
}

const ActivitiesContext = createContext<ActivitiesContextType | undefined>(undefined)

interface ActivitiesProviderProps {
  children: ReactNode
}

export function ActivitiesProvider({ children }: ActivitiesProviderProps) {
  const activitiesData = useActivities()

  return (
    <ActivitiesContext.Provider value={activitiesData}>
      {children}
    </ActivitiesContext.Provider>
  )
}

export function useActivitiesContext() {
  const context = useContext(ActivitiesContext)
  if (context === undefined) {
    throw new Error('useActivitiesContext must be used within an ActivitiesProvider')
  }
  return context
}
