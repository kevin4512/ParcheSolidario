import { StorageService } from "../../infraestructura/firebase/StorageService";
import { EmailService, VerificationEmailData } from "../../infraestructura/email/EmailService";
import { ProfileRepository, UserProfile } from "../../infraestructura/firebase/ProfileRepository";

export interface ProfileData {
  fullName: string;
  description: string;
  location: string;
  socialMedia: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    linkedin?: string;
  };
  phone: string;
  email: string;
  isBusiness?: boolean;
  isBusinessConfirmed?: boolean;
}

export interface DocumentUpload {
  cameraDocument: File | null;
  commerceDocument: File | null;
}

export class ProfileService {
  /**
   * Procesa la verificación de perfil completa
   * @param userId - ID del usuario autenticado
   * @param profileData - Datos del perfil del usuario
   * @param documents - Documentos a subir
   */
  static async submitProfileVerification(
    userId: string,
    profileData: ProfileData,
    documents: DocumentUpload
  ): Promise<void> {
    try {
      // 1. Verificar si el usuario ya tiene un perfil
      // Si ya existe un perfil y está en estado 'pending', bloqueamos reenvíos hasta que se resuelva.
      // En otros casos permitimos re-subir documentos y hacer merge (saveProfile usa setDoc merge:true).
      const existingProfile = await ProfileRepository.getProfile(userId);
      if (existingProfile && existingProfile.verificationStatus === 'pending') {
        throw new Error("Ya tienes una verificación en proceso. Por favor espera a que se resuelva antes de reenviar.");
      }

      // 2. Subir documentos a Firebase Storage
      if (!documents?.cameraDocument || !documents?.commerceDocument) {
        throw new Error("Faltan documentos de verificación");
      }

      const uploadResults = await StorageService.uploadVerificationDocuments(
        userId,
        documents.cameraDocument,
        documents.commerceDocument
      );
      // 3. Guardar perfil en Firestore
      try {
        await ProfileRepository.saveProfile(userId, profileData, {
          cameraDocumentUrl: uploadResults.cameraDocument.url,
          commerceDocumentUrl: uploadResults.commerceDocument.url
        });
      } catch (saveError) {
        // Si la persistencia falla, intentar limpiar los archivos subidos para evitar orfandad
        try {
          await StorageService.deleteFile(uploadResults.cameraDocument.path);
        } catch (e) {
          console.warn("No se pudo eliminar cameraDocument tras fallo en saveProfile:", e);
        }
        try {
          await StorageService.deleteFile(uploadResults.commerceDocument.path);
        } catch (e) {
          console.warn("No se pudo eliminar commerceDocument tras fallo en saveProfile:", e);
        }
        throw saveError;
      }

      // 4. Preparar datos para el email de notificación
      const emailData: VerificationEmailData = {
        userEmail: profileData.email,
        userName: profileData.fullName,
        userLocation: profileData.location,
        cameraDocumentUrl: uploadResults.cameraDocument.url,
        commerceDocumentUrl: uploadResults.commerceDocument.url,
        profileData: profileData
      };

      // 5. Enviar notificación al administrador
      await EmailService.sendVerificationNotification(emailData);

      // 6. Enviar confirmación al usuario
      await EmailService.sendUserConfirmation(profileData.email, profileData.fullName);

    } catch (error) {
      console.error("Error en el proceso de verificación de perfil:", error);
      throw error;
    }
  }

  /**
   * Valida los datos del perfil antes de enviar
   */
  static validateProfileData(profileData: ProfileData, documents?: DocumentUpload): string[] {
    const errors: string[] = [];

    // Validar campos obligatorios
    if (!profileData.fullName?.trim()) {
      errors.push("El nombre completo es obligatorio");
    }

    if (!profileData.description?.trim()) {
      errors.push("La descripción es obligatoria");
    }

    if (!profileData.location?.trim()) {
      errors.push("La ubicación es obligatoria");
    }

    if (!profileData.email?.trim()) {
      errors.push("El email es obligatorio");
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (profileData.email && !emailRegex.test(profileData.email)) {
      errors.push("El formato del email no es válido");
    }

    // Validar URLs de redes sociales
    const urlRegex = /^https?:\/\/.+/;
    if (profileData.socialMedia.facebook && !urlRegex.test(profileData.socialMedia.facebook)) {
      errors.push("La URL de Facebook debe comenzar con http:// o https://");
    }
    if (profileData.socialMedia.instagram && !urlRegex.test(profileData.socialMedia.instagram)) {
      errors.push("La URL de Instagram debe comenzar con http:// o https://");
    }
    if (profileData.socialMedia.twitter && !urlRegex.test(profileData.socialMedia.twitter)) {
      errors.push("La URL de Twitter debe comenzar con http:// o https://");
    }
    if (profileData.socialMedia.linkedin && !urlRegex.test(profileData.socialMedia.linkedin)) {
      errors.push("La URL de LinkedIn debe comenzar con http:// o https://");
    }

    // Validar documentos solo si el perfil corresponde a persona jurídica
    if ((profileData as any).isBusiness) {
      // Validar presencia
      if (!documents || !documents.cameraDocument) {
        errors.push("El documento de cámara es obligatorio");
      }

      if (!documents || !documents.commerceDocument) {
        errors.push("El documento de comercio es obligatorio");
      }

      // Validar tamaño de archivos
      if (documents?.cameraDocument && documents.cameraDocument.size > 5 * 1024 * 1024) {
        errors.push("El documento de cámara es demasiado grande (máximo 5MB)");
      }

      if (documents?.commerceDocument && documents.commerceDocument.size > 5 * 1024 * 1024) {
        errors.push("El documento de comercio es demasiado grande (máximo 5MB)");
      }

      // Validar tipos de archivo
      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
      if (documents?.cameraDocument && !allowedTypes.includes(documents.cameraDocument.type)) {
        errors.push("El documento de cámara debe ser PDF, JPG, JPEG o PNG");
      }

      if (documents?.commerceDocument && !allowedTypes.includes(documents.commerceDocument.type)) {
        errors.push("El documento de comercio debe ser PDF, JPG, JPEG o PNG");
      }
    }

    return errors;
  }

  /**
   * Formatea los datos del perfil para mostrar
   */
  static formatProfileData(profileData: ProfileData): ProfileData {
    return {
      fullName: profileData.fullName?.trim() || "",
      description: profileData.description?.trim() || "",
      location: profileData.location?.trim() || "",
      phone: profileData.phone?.trim() || "",
      email: profileData.email?.trim() || "",
      isBusiness: !!(profileData as any).isBusiness,
      isBusinessConfirmed: !!(profileData as any).isBusinessConfirmed,
      socialMedia: {
        facebook: profileData.socialMedia?.facebook?.trim() || "",
        instagram: profileData.socialMedia?.instagram?.trim() || "",
        twitter: profileData.socialMedia?.twitter?.trim() || "",
        linkedin: profileData.socialMedia?.linkedin?.trim() || ""
      }
    };
  }

  /**
   * Validación ligera para actualizar perfil (no requiere documentos)
   */
  static validateProfileUpdate(profileData: ProfileData): string[] {
    const errors: string[] = [];
    // For profile updates we allow partial updates: require at least fullName and email
    if (!profileData.fullName?.trim()) {
      errors.push("El nombre completo es obligatorio");
    }
    if (!profileData.email?.trim()) {
      errors.push("El email es obligatorio");
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (profileData.email && !emailRegex.test(profileData.email)) {
      errors.push("El formato del email no es válido");
    }
    return errors;
  }

  /**
   * Actualiza el perfil de usuario (campos editables desde el formulario)
   */
  static async updateProfile(userId: string, profileData: ProfileData): Promise<void> {
    try {
      // validar mínimamente
      const formatted = this.formatProfileData(profileData);
      const validationErrors = this.validateProfileUpdate(formatted);
      if (validationErrors.length > 0) {
        throw new Error(validationErrors.join('; '));
      }

      // delegar al repositorio (update parcial)
      await ProfileRepository.updateProfile(userId, {
        fullName: formatted.fullName,
        description: formatted.description,
        location: formatted.location,
        isBusiness: (profileData as any).isBusiness || false,
        isBusinessConfirmed: (profileData as any).isBusinessConfirmed || false,
        socialMedia: formatted.socialMedia,
        phone: formatted.phone,
        email: formatted.email
      });
    } catch (error) {
      console.error("Error al actualizar perfil:", error);
      throw error;
    }
  }

  /**
   * Obtiene el perfil de un usuario
   */
  static async getUserProfile(userId: string): Promise<UserProfile | null> {
    try {
      return await ProfileRepository.getProfile(userId);
    } catch (error) {
      console.error("Error al obtener perfil del usuario:", error);
      throw error;
    }
  }

  /**
   * Verifica si un usuario está verificado
   */
  static async isUserVerified(userId: string): Promise<boolean> {
    try {
      const profile = await ProfileRepository.getProfile(userId);
      return profile?.isVerified || false;
    } catch (error) {
      console.error("Error al verificar estado del usuario:", error);
      return false;
    }
  }

  /**
   * Obtiene todos los perfiles pendientes de verificación (para administradores)
   */
  static async getPendingVerifications(): Promise<UserProfile[]> {
    try {
      return await ProfileRepository.getPendingProfiles();
    } catch (error) {
      console.error("Error al obtener verificaciones pendientes:", error);
      throw error;
    }
  }

  /**
   * Aprueba o rechaza la verificación de un usuario (para administradores)
   */
  static async updateVerificationStatus(
    userId: string, 
    status: 'approved' | 'rejected'
  ): Promise<void> {
    try {
      const isVerified = status === 'approved';
      await ProfileRepository.updateVerificationStatus(userId, status, isVerified);
    } catch (error) {
      console.error("Error al actualizar estado de verificación:", error);
      throw error;
    }
  }
}
