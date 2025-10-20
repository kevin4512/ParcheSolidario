"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MapPin, Plus, Calendar, Users } from "lucide-react"
import { toast } from "sonner"
import { ActivitiesService, CreateActivityData, Activity } from "@/modules/infraestructura/firebase/ActivitiesService"
import { useAuth } from "@/hooks/useAuth"
import { useActivitiesContext } from "@/contexts/ActivitiesContext"

export function AddActivityForm() {
  const { user } = useAuth()
  const { addActivity } = useActivitiesContext()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState<CreateActivityData>({
    title: "",
    description: "",
    category: "eventos",
    latitude: 6.2442, // Medellín por defecto
    longitude: -75.5812,
    participants: 0,
    capacity: 0,
    date: "",
    time: "",
    location: "",
    fundraisingGoal: "",
    status: "upcoming",
    createdBy: user?.uid || ""
  })

  const handleInputChange = (field: keyof CreateActivityData, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleNumberChange = (field: keyof CreateActivityData, value: string) => {
    const numValue = value === '' ? 0 : parseInt(value, 10)
    if (!isNaN(numValue)) {
      handleInputChange(field, numValue)
    }
  }

  const handleFloatChange = (field: keyof CreateActivityData, value: string) => {
    const numValue = value === '' ? 0 : parseFloat(value)
    if (!isNaN(numValue)) {
      handleInputChange(field, numValue)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!user) {
      toast.error("Debes estar autenticado para crear actividades")
      return
    }

    // Validación de campos obligatorios
    if (!formData.title.trim()) {
      toast.error("El nombre del evento es obligatorio")
      return
    }

    if (!formData.description.trim()) {
      toast.error("La descripción es obligatoria")
      return
    }

    if (!formData.date) {
      toast.error("La fecha es obligatoria")
      return
    }

    if (!formData.time) {
      toast.error("La hora es obligatoria")
      return
    }

    if (!formData.location.trim()) {
      toast.error("La ubicación es obligatoria")
      return
    }

    if (!formData.capacity || formData.capacity < 1) {
      toast.error("La capacidad debe ser mayor a 0")
      return
    }

    if (!formData.fundraisingGoal.trim()) {
      toast.error("El objetivo de recaudación es obligatorio")
      return
    }

    // Validar que la fecha no sea anterior a hoy
    const selectedDate = new Date(formData.date)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    if (selectedDate < today) {
      toast.error("La fecha del evento no puede ser anterior a hoy")
      return
    }

    setIsSubmitting(true)
    try {
      const activityId = await ActivitiesService.createActivity({
        ...formData,
        createdBy: user.uid
      })
      
      // Crear el objeto de actividad completo para agregar al contexto
      const newActivity: Activity = {
        id: activityId,
        ...formData,
        createdBy: user.uid,
        createdAt: new Date(),
        updatedAt: new Date()
      }
      
      // Agregar la actividad al contexto para actualizar automáticamente las publicaciones
      addActivity(newActivity)
      
      toast.success("Evento publicado exitosamente")
      
      // Limpiar formulario
      setFormData({
        title: "",
        description: "",
        category: "eventos",
        latitude: 6.2442,
        longitude: -75.5812,
        participants: 0,
        capacity: 0,
        date: "",
        time: "",
        location: "",
        fundraisingGoal: "",
        status: "upcoming",
        createdBy: user.uid
      })
      
    } catch (error) {
      console.error("Error al crear actividad:", error)
      toast.error("Error al crear la actividad")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Plus className="h-5 w-5" />
          Crear y Publicar Evento
        </CardTitle>
        <CardDescription>
          Completa el formulario para crear un evento que será visible para otros usuarios
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Título *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="Nombre de la actividad"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Categoría *</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => handleInputChange('category', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona una categoría" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="eventos">Eventos</SelectItem>
                  <SelectItem value="colectas">Colectas</SelectItem>
                  <SelectItem value="refugios">Refugios</SelectItem>
                  <SelectItem value="protestas">Protestas</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descripción *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Describe la actividad..."
              className="min-h-[100px]"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="fundraisingGoal">¿Qué desea recaudar? *</Label>
            <Input
              id="fundraisingGoal"
              value={formData.fundraisingGoal}
              onChange={(e) => handleInputChange('fundraisingGoal', e.target.value)}
              placeholder="Ej: Fondos para animales sin hogar, $500,000 COP"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Ubicación *</Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => handleInputChange('location', e.target.value)}
              placeholder="Ej: Parque Central, Medellín"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="latitude">Latitud</Label>
              <Input
                id="latitude"
                type="number"
                step="any"
                value={formData.latitude || ''}
                onChange={(e) => handleFloatChange('latitude', e.target.value)}
                placeholder="6.2442"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="longitude">Longitud</Label>
              <Input
                id="longitude"
                type="number"
                step="any"
                value={formData.longitude || ''}
                onChange={(e) => handleFloatChange('longitude', e.target.value)}
                placeholder="-75.5812"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="participants">Participantes Actuales</Label>
              <Input
                id="participants"
                type="number"
                min="0"
                value={formData.participants || ''}
                onChange={(e) => handleNumberChange('participants', e.target.value)}
                placeholder="0"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="capacity">Capacidad Máxima *</Label>
              <Input
                id="capacity"
                type="number"
                min="1"
                value={formData.capacity || ''}
                onChange={(e) => handleNumberChange('capacity', e.target.value)}
                placeholder="50"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Fecha *</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => handleInputChange('date', e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="time">Hora *</Label>
              <Input
                id="time"
                type="time"
                value={formData.time}
                onChange={(e) => handleInputChange('time', e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Estado</Label>
            <Select
              value={formData.status}
              onValueChange={(value) => handleInputChange('status', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecciona el estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="upcoming">Próximo</SelectItem>
                <SelectItem value="active">Activo</SelectItem>
                <SelectItem value="completed">Completado</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => setFormData({
                title: "",
                description: "",
                category: "eventos",
                latitude: 6.2442,
                longitude: -75.5812,
                participants: 0,
                capacity: 0,
                date: "",
                time: "",
                location: "",
                fundraisingGoal: "",
                status: "upcoming",
                createdBy: user?.uid || ""
              })}
            >
              Limpiar
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Publicando...
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4" />
                  Publicar Evento
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
