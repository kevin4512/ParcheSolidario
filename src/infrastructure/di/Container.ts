import { FirebaseActivityRepository } from '../repositories/FirebaseActivityRepository';
import { FirebaseProfileRepository } from '../repositories/FirebaseProfileRepository';
import { FirebaseStorageService } from '../external/FirebaseStorageService';
import { EmailService } from '../external/EmailService';
import { ActivityService } from '../../application/services/ActivityService';
import { UserService } from '../../application/services/UserService';
import { ActivityRepository } from '../../domain/repositories/ActivityRepository';
import { ProfileRepository } from '../../domain/repositories/UserRepository';
import { DocumentUploadService } from '../../domain/use-cases/users/CreateProfileUseCase';

// Container de dependencias siguiendo el patrón de inyección de dependencias
export class Container {
  private static instance: Container;
  private activityService: ActivityService | null = null;
  private userService: UserService | null = null;

  private constructor() {}

  static getInstance(): Container {
    if (!Container.instance) {
      Container.instance = new Container();
    }
    return Container.instance;
  }

  // Repositorios
  getActivityRepository(): ActivityRepository {
    return new FirebaseActivityRepository();
  }

  getProfileRepository(): ProfileRepository {
    return new FirebaseProfileRepository();
  }

  getDocumentUploadService(): DocumentUploadService {
    return new FirebaseStorageService();
  }

  getEmailService(): EmailService {
    return new EmailService();
  }

  // Servicios de aplicación
  getActivityService(): ActivityService {
    if (!this.activityService) {
      this.activityService = new ActivityService(this.getActivityRepository());
    }
    return this.activityService;
  }

  getUserService(): UserService {
    if (!this.userService) {
      this.userService = new UserService(
        this.getProfileRepository(),
        this.getDocumentUploadService(),
        this.getEmailService()
      );
    }
    return this.userService;
  }
}

// Función helper para obtener el contenedor
export const container = Container.getInstance();

