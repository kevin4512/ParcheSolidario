import { Activity, CreateActivityRequest } from '../../entities/Activity';
import { ActivityRepository } from '../../repositories/ActivityRepository';

export class CreateActivityUseCase {
  constructor(private activityRepository: ActivityRepository) {}

  async execute(request: CreateActivityRequest): Promise<Activity> {
    // Validaciones de negocio
    this.validateActivityRequest(request);

    // Crear la actividad
    const activity = await this.activityRepository.create(request);

    return activity;
  }

  private validateActivityRequest(request: CreateActivityRequest): void {
    if (!request.title?.trim()) {
      throw new Error('El título es obligatorio');
    }

    if (!request.description?.trim()) {
      throw new Error('La descripción es obligatoria');
    }

    if (!request.date) {
      throw new Error('La fecha es obligatoria');
    }

    if (request.date < new Date()) {
      throw new Error('La fecha no puede ser anterior a hoy');
    }

    if (request.participants < 0) {
      throw new Error('El número de participantes no puede ser negativo');
    }

    if (!request.location.latitude || !request.location.longitude) {
      throw new Error('La ubicación es obligatoria');
    }

    if (!request.createdBy) {
      throw new Error('El creador es obligatorio');
    }
  }
}

