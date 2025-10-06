import { ActivityRepository } from '../../repositories/ActivityRepository';

export class DeleteActivityUseCase {
  constructor(private activityRepository: ActivityRepository) {}

  async execute(activityId: string, userId: string): Promise<void> {
    // Verificar que la actividad existe
    const activity = await this.activityRepository.findById(activityId);
    if (!activity) {
      throw new Error('La actividad no existe');
    }

    // Verificar que el usuario es el creador o tiene permisos
    if (activity.createdBy !== userId) {
      throw new Error('No tienes permisos para eliminar esta actividad');
    }

    // Eliminar la actividad
    await this.activityRepository.delete(activityId);
  }
}

