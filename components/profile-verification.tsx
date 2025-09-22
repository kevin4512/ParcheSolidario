"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Upload, Camera, FileText, MapPin, Link, User, Mail, Phone } from "lucide-react"
import { toast } from "sonner"
import { ProfileService, ProfileData as ServiceProfileData, DocumentUpload as ServiceDocumentUpload } from "@/modules/domain/profile/ProfileService"

interface ProfileData {
  fullName: string
  description: string
  location: string
  socialMedia: {
    facebook?: string
    instagram?: string
    twitter?: string
    linkedin?: string
  }
  phone: string
  email: string
}

interface DocumentUpload {
  cameraDocument: File | null
  commerceDocument: File | null
}

export function ProfileVerification() {
  const [profileData, setProfileData] = useState<ProfileData>({
    fullName: "",
    description: "",
    location: "",
    socialMedia: {},
    phone: "",
    email: ""
  })

  const [documents, setDocuments] = useState<DocumentUpload>({
    cameraDocument: null,
    commerceDocument: null
  })

  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleInputChange = (field: keyof ProfileData, value: string) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSocialMediaChange = (platform: string, value: string) => {
    setProfileData(prev => ({
      ...prev,
      socialMedia: {
        ...prev.socialMedia,
        [platform]: value
      }
    }))
  }

  const handleFileUpload = (type: 'camera' | 'commerce', file: File) => {
    setDocuments(prev => ({
      ...prev,
      [type === 'camera' ? 'cameraDocument' : 'commerceDocument']: file
    }))
    toast.success(`${type === 'camera' ? 'Documento de cámara' : 'Documento de comercio'} subido correctamente`)
  }

  const handleSubmit = async () => {
    if (!documents.cameraDocument || !documents.commerceDocument) {
      toast.error("Por favor sube ambos documentos requeridos")
      return
    }

    // Formatear datos del perfil
    const formattedProfileData = ProfileService.formatProfileData(profileData)
    
    // Validar datos
    const validationErrors = ProfileService.validateProfileData(
      formattedProfileData,
      {
        cameraDocument: documents.cameraDocument,
        commerceDocument: documents.commerceDocument
      }
    )

    if (validationErrors.length > 0) {
      validationErrors.forEach(error => toast.error(error))
      return
    }

    setIsSubmitting(true)
    try {
      // Generar un ID de usuario temporal (en producción esto vendría del contexto de autenticación)
      const userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      
      // Procesar verificación de perfil
      await ProfileService.submitProfileVerification(
        userId,
        formattedProfileData,
        {
          cameraDocument: documents.cameraDocument,
          commerceDocument: documents.commerceDocument
        }
      )

      toast.success("Perfil enviado para verificación. Te notificaremos cuando esté listo.")
      
      // Limpiar formulario después del envío exitoso
      setProfileData({
        fullName: "",
        description: "",
        location: "",
        socialMedia: {},
        phone: "",
        email: ""
      })
      setDocuments({
        cameraDocument: null,
        commerceDocument: null
      })
      
    } catch (error) {
      console.error("Error al enviar perfil:", error)
      toast.error("Error al enviar el perfil. Intenta nuevamente.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold text-foreground">Verificación de Perfil</h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Completa tu perfil y sube los documentos necesarios para verificar tu cuenta y acceder a todos los servicios.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Información Personal */}
        <Card className="shadow-lg border-0">
          <CardHeader className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                <User className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <CardTitle className="text-xl">Información Personal</CardTitle>
                <CardDescription>Datos básicos de tu perfil</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="fullName" className="text-sm font-medium">
                Nombre Completo *
              </Label>
              <Input
                id="fullName"
                value={profileData.fullName}
                onChange={(e) => handleInputChange('fullName', e.target.value)}
                placeholder="Tu nombre completo"
                className="h-11"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">
                Email *
              </Label>
              <Input
                id="email"
                type="email"
                value={profileData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="tu@email.com"
                className="h-11"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="text-sm font-medium">
                Teléfono
              </Label>
              <Input
                id="phone"
                type="tel"
                value={profileData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                placeholder="+57 300 123 4567"
                className="h-11"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="location" className="text-sm font-medium">
                Ubicación *
              </Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="location"
                  value={profileData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  placeholder="Ciudad, Departamento"
                  className="h-11 pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-sm font-medium">
                Descripción *
              </Label>
              <Textarea
                id="description"
                value={profileData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Cuéntanos sobre ti, tus intereses y cómo quieres contribuir a la comunidad..."
                className="min-h-[100px] resize-none"
              />
            </div>
          </CardContent>
        </Card>

        {/* Redes Sociales */}
        <Card className="shadow-lg border-0">
          <CardHeader className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center">
                <Link className="h-5 w-5 text-accent-foreground" />
              </div>
              <div>
                <CardTitle className="text-xl">Redes Sociales</CardTitle>
                <CardDescription>Conecta tus perfiles sociales (opcional)</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="facebook" className="text-sm font-medium">
                Facebook
              </Label>
              <Input
                id="facebook"
                value={profileData.socialMedia.facebook || ""}
                onChange={(e) => handleSocialMediaChange('facebook', e.target.value)}
                placeholder="https://facebook.com/tu-perfil"
                className="h-11"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="instagram" className="text-sm font-medium">
                Instagram
              </Label>
              <Input
                id="instagram"
                value={profileData.socialMedia.instagram || ""}
                onChange={(e) => handleSocialMediaChange('instagram', e.target.value)}
                placeholder="https://instagram.com/tu-perfil"
                className="h-11"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="twitter" className="text-sm font-medium">
                Twitter/X
              </Label>
              <Input
                id="twitter"
                value={profileData.socialMedia.twitter || ""}
                onChange={(e) => handleSocialMediaChange('twitter', e.target.value)}
                placeholder="https://twitter.com/tu-perfil"
                className="h-11"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="linkedin" className="text-sm font-medium">
                LinkedIn
              </Label>
              <Input
                id="linkedin"
                value={profileData.socialMedia.linkedin || ""}
                onChange={(e) => handleSocialMediaChange('linkedin', e.target.value)}
                placeholder="https://linkedin.com/in/tu-perfil"
                className="h-11"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Documentos */}
      <Card className="shadow-lg border-0">
        <CardHeader className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
              <FileText className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <CardTitle className="text-xl">Documentos de Verificación</CardTitle>
              <CardDescription>Sube los documentos requeridos para verificar tu cuenta</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Documento de Cámara */}
            <div className="space-y-4">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
                  <Camera className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Documento de Cámara</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Sube tu documento de cámara de comercio o equivalente
                </p>
              </div>
              
              <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary transition-colors">
                <input
                  type="file"
                  id="camera-document"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) => e.target.files?.[0] && handleFileUpload('camera', e.target.files[0])}
                  className="hidden"
                />
                <label
                  htmlFor="camera-document"
                  className="cursor-pointer flex flex-col items-center space-y-2"
                >
                  <Upload className="h-8 w-8 text-muted-foreground" />
                  <span className="text-sm font-medium">
                    {documents.cameraDocument ? documents.cameraDocument.name : "Hacer clic para subir"}
                  </span>
                  <span className="text-xs text-muted-foreground">PDF, JPG, PNG (máx. 5MB)</span>
                </label>
              </div>
            </div>

            {/* Documento de Comercio */}
            <div className="space-y-4">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
                  <FileText className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Documento de Comercio</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Sube tu documento de comercio o registro mercantil
                </p>
              </div>
              
              <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary transition-colors">
                <input
                  type="file"
                  id="commerce-document"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) => e.target.files?.[0] && handleFileUpload('commerce', e.target.files[0])}
                  className="hidden"
                />
                <label
                  htmlFor="commerce-document"
                  className="cursor-pointer flex flex-col items-center space-y-2"
                >
                  <Upload className="h-8 w-8 text-muted-foreground" />
                  <span className="text-sm font-medium">
                    {documents.commerceDocument ? documents.commerceDocument.name : "Hacer clic para subir"}
                  </span>
                  <span className="text-xs text-muted-foreground">PDF, JPG, PNG (máx. 5MB)</span>
                </label>
              </div>
            </div>
          </div>

          <div className="mt-8 p-4 bg-muted/50 rounded-lg">
            <p className="text-sm text-muted-foreground text-center">
              <strong>Importante:</strong> Una vez que subas los documentos, nuestro equipo los revisará manualmente. 
              Te notificaremos por email cuando tu cuenta esté verificada y puedas acceder a todos los servicios.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Botón de Envío */}
      <div className="flex justify-center">
        <Button
          onClick={handleSubmit}
          disabled={isSubmitting}
          size="lg"
          className="h-12 px-8 text-base font-semibold"
        >
          {isSubmitting ? "Enviando..." : "Enviar para Verificación"}
        </Button>
      </div>
    </div>
  )
}
