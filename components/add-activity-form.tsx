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
import { useActivities } from "@/src/presentation/hooks/useActivities"
import { useAuth } from "@/hooks/useAuth"
import { CreateActivityDto, ActivityCategory, ActivityStatus } from "@/src/application/dto/ActivityDto"

export function AddActivityForm() {
  const { user } = useAuth()
  const { createActivity, loading } = useActivities()
  const [formData, setFormData] = useState<CreateActivityDto>({
    title: "",
    description: "",
    category: "eventos",
    latitude: 6.2442, // Medellín por defecto
    longitude: -75.5812,
    participants: 0,
    date: "",
    status: "upcoming"
  })

  const handleInputChange = (field: keyof CreateActivityDto, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!user) {
      toast.error("Debes estar autenticado para crear actividades")
      return
    }

    if (!formData.title || !formData.description || !formData.date) {
      toast.error("Por favor completa todos los campos obligatorios")
      return
    }

    try {
      await createActivity(formData, user.uid)
      toast.success("Actividad creada exitosamente")
      
      // Limpiar formulario
      setFormData({
        title: "",
        description: "",
        category: "eventos",
        latitude: 6.2442,
        longitude: -75.5812,
        participants: 0,
        date: "",
        status: "upcoming"
      })
      
    } catch (error) {
      console.error("Error al crear actividad:", error)
      toast.error("Error al crear la actividad")
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Plus className="h-5 w-5" />
          Agregar Nueva Actividad
        </CardTitle>
        <CardDescription>
          Crea una nueva actividad para que aparezca en el mapa de calor
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="latitude">Latitud</Label>
              <Input
                id="latitude"
                type="number"
                step="any"
                value={formData.latitude}
                onChange={(e) => handleInputChange('latitude', parseFloat(e.target.value))}
                placeholder="6.2442"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="longitude">Longitud</Label>
              <Input
                id="longitude"
                type="number"
                step="any"
                value={formData.longitude}
                onChange={(e) => handleInputChange('longitude', parseFloat(e.target.value))}
                placeholder="-75.5812"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="participants">Participantes</Label>
              <Input
                id="participants"
                type="number"
                min="0"
                value={formData.participants}
                onChange={(e) => handleInputChange('participants', parseInt(e.target.value))}
                placeholder="0"
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
                required
              />
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
                date: "",
                status: "upcoming"
              })}
            >
              Limpiar
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Creando...
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4" />
                  Crear Actividad
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
