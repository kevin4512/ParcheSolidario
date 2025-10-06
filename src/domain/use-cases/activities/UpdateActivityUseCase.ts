import { Activity, UpdateActivityRequest } from '../../entities/Activity';
import { ActivityRepository } from '../../repositories/ActivityRepository';

export class UpdateActivityUseCase {
  constructor(private activityRepository: ActivityRepository) {}

  async execute(request: UpdateActivityRequest): Promise<Activity> {
    // Verificar que la actividad existe
    const existingActivity = await this.activityRepository.findById(request.id);
    if (!existingActivity) {
      throw new Error('La actividad no existe');
    }

    // Validaciones de negocio
    this.validateUpdateRequest(request);

    // Actualizar la actividad
    const updatedActivity = await this.activityRepository.update(request);

    return updatedActivity;
  }

  private validateUpdateRequest(request: UpdateActivityRequest): void {
    if (request.title !== undefined && !request.title.trim()) {
      throw new Error('El título no puede estar vacío');
    }

    if (request.description !== undefined && !request.description.trim()) {
      throw new Error('La descripción no puede estar vacía');
    }

    if (request.date && request.date < new Date()) {
      throw new Error('La fecha no puede ser anterior a hoy');
    }

    if (request.participants !== undefined && request.participants < 0) {
      throw new Error('El número de participantes no puede ser negativo');
    }

    if (request.location && (!request.location.latitude || !request.location.longitude)) {
      throw new Error('La ubicación debe tener latitud y longitud válidas');
    }
  }
}

