import { UserProfile, CreateProfileRequest, DocumentUpload } from '../../entities/User';
import { ProfileRepository } from '../../repositories/UserRepository';

export interface DocumentUploadService {
  uploadVerificationDocuments(
    userId: string,
    cameraDocument: File,
    commerceDocument: File
  ): Promise<{ cameraDocumentUrl: string; commerceDocumentUrl: string }>;
}

export interface EmailService {
  sendVerificationNotification(data: VerificationEmailData): Promise<void>;
  sendUserConfirmation(email: string, name: string): Promise<void>;
}

export interface VerificationEmailData {
  userEmail: string;
  userName: string;
  userLocation: string;
  cameraDocumentUrl: string;
  commerceDocumentUrl: string;
  profileData: CreateProfileRequest;
}

export class CreateProfileUseCase {
  constructor(
    private profileRepository: ProfileRepository,
    private documentUploadService: DocumentUploadService,
    private emailService: EmailService
  ) {}

  async execute(
    userId: string,
    profileData: CreateProfileRequest,
    documents: DocumentUpload
  ): Promise<UserProfile> {
    // Validar datos
    this.validateProfileData(profileData, documents);

    // Verificar si ya existe un perfil
    const hasExistingProfile = await this.profileRepository.hasProfile(userId);
    if (hasExistingProfile) {
      throw new Error('Ya tienes un perfil registrado. Si necesitas actualizarlo, contacta al administrador.');
    }

    // Subir documentos
    const uploadResults = await this.documentUploadService.uploadVerificationDocuments(
      userId,
      documents.cameraDocument,
      documents.commerceDocument
    );

    // Crear perfil
    const profile = await this.profileRepository.create({
      userId,
      ...profileData,
      isVerified: false,
      verificationStatus: 'pending',
      documents: {
        cameraDocumentUrl: uploadResults.cameraDocumentUrl,
        commerceDocumentUrl: uploadResults.commerceDocumentUrl,
      },
    });

    // Enviar notificaciones
    await this.emailService.sendVerificationNotification({
      userEmail: profileData.email,
      userName: profileData.fullName,
      userLocation: profileData.location,
      cameraDocumentUrl: uploadResults.cameraDocumentUrl,
      commerceDocumentUrl: uploadResults.commerceDocumentUrl,
      profileData,
    });

    await this.emailService.sendUserConfirmation(profileData.email, profileData.fullName);

    return profile;
  }

  private validateProfileData(profileData: CreateProfileRequest, documents: DocumentUpload): void {
    const errors: string[] = [];

    if (!profileData.fullName?.trim()) {
      errors.push('El nombre completo es obligatorio');
    }

    if (!profileData.description?.trim()) {
      errors.push('La descripción es obligatoria');
    }

    if (!profileData.location?.trim()) {
      errors.push('La ubicación es obligatoria');
    }

    if (!profileData.email?.trim()) {
      errors.push('El email es obligatorio');
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (profileData.email && !emailRegex.test(profileData.email)) {
      errors.push('El formato del email no es válido');
    }

    // Validar URLs de redes sociales
    const urlRegex = /^https?:\/\/.+/;
    if (profileData.socialMedia.facebook && !urlRegex.test(profileData.socialMedia.facebook)) {
      errors.push('La URL de Facebook debe comenzar con http:// o https://');
    }
    if (profileData.socialMedia.instagram && !urlRegex.test(profileData.socialMedia.instagram)) {
      errors.push('La URL de Instagram debe comenzar con http:// o https://');
    }
    if (profileData.socialMedia.twitter && !urlRegex.test(profileData.socialMedia.twitter)) {
      errors.push('La URL de Twitter debe comenzar con http:// o https://');
    }
    if (profileData.socialMedia.linkedin && !urlRegex.test(profileData.socialMedia.linkedin)) {
      errors.push('La URL de LinkedIn debe comenzar con http:// o https://');
    }

    // Validar documentos
    if (!documents.cameraDocument) {
      errors.push('El documento de cámara es obligatorio');
    }

    if (!documents.commerceDocument) {
      errors.push('El documento de comercio es obligatorio');
    }

    // Validar tamaño de archivos
    if (documents.cameraDocument && documents.cameraDocument.size > 5 * 1024 * 1024) {
      errors.push('El documento de cámara es demasiado grande (máximo 5MB)');
    }

    if (documents.commerceDocument && documents.commerceDocument.size > 5 * 1024 * 1024) {
      errors.push('El documento de comercio es demasiado grande (máximo 5MB)');
    }

    // Validar tipos de archivo
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
    
    if (documents.cameraDocument && !allowedTypes.includes(documents.cameraDocument.type)) {
      errors.push('El documento de cámara debe ser PDF, JPG, JPEG o PNG');
    }

    if (documents.commerceDocument && !allowedTypes.includes(documents.commerceDocument.type)) {
      errors.push('El documento de comercio debe ser PDF, JPG, JPEG o PNG');
    }

    if (errors.length > 0) {
      throw new Error(errors.join(', '));
    }
  }
}

