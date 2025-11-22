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
}

export interface DocumentUpload {
  cameraDocument: File;
  commerceDocument: File;
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
      const hasExistingProfile = await ProfileRepository.hasProfile(userId);
      if (hasExistingProfile) {
        throw new Error("Ya tienes un perfil registrado. Si necesitas actualizarlo, contacta al administrador.");
      }

      // 2. Subir documentos a Firebase Storage
      const uploadResults = await StorageService.uploadVerificationDocuments(
        userId,
        documents.cameraDocument,
        documents.commerceDocument
      );

      // 3. Guardar perfil en Firestore
      await ProfileRepository.saveProfile(userId, profileData, {
        cameraDocumentUrl: uploadResults.cameraDocument.url,
        commerceDocumentUrl: uploadResults.commerceDocument.url
      });

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
  static validateProfileData(profileData: ProfileData, documents: DocumentUpload): string[] {
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

    // Validar documentos
    if (!documents.cameraDocument) {
      errors.push("El documento de cámara es obligatorio");
    }

    if (!documents.commerceDocument) {
      errors.push("El documento de comercio es obligatorio");
    }

    // Validar tamaño de archivos
    if (documents.cameraDocument && documents.cameraDocument.size > 5 * 1024 * 1024) {
      errors.push("El documento de cámara es demasiado grande (máximo 5MB)");
    }

    if (documents.commerceDocument && documents.commerceDocument.size > 5 * 1024 * 1024) {
      errors.push("El documento de comercio es demasiado grande (máximo 5MB)");
    }

    // Validar tipos de archivo
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
    
    if (documents.cameraDocument && !allowedTypes.includes(documents.cameraDocument.type)) {
      errors.push("El documento de cámara debe ser PDF, JPG, JPEG o PNG");
    }

    if (documents.commerceDocument && !allowedTypes.includes(documents.commerceDocument.type)) {
      errors.push("El documento de comercio debe ser PDF, JPG, JPEG o PNG");
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
      socialMedia: {
        facebook: profileData.socialMedia?.facebook?.trim() || "",
        instagram: profileData.socialMedia?.instagram?.trim() || "",
        twitter: profileData.socialMedia?.twitter?.trim() || "",
        linkedin: profileData.socialMedia?.linkedin?.trim() || ""
      }
    };
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
