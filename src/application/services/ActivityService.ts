import { CreateActivityUseCase } from '../../domain/use-cases/activities/CreateActivityUseCase';
import { GetActivitiesUseCase } from '../../domain/use-cases/activities/GetActivitiesUseCase';
import { UpdateActivityUseCase } from '../../domain/use-cases/activities/UpdateActivityUseCase';
import { DeleteActivityUseCase } from '../../domain/use-cases/activities/DeleteActivityUseCase';
import { ActivityRepository } from '../../domain/repositories/ActivityRepository';
import { ActivityResponseDto, CreateActivityDto, UpdateActivityDto, ActivityFiltersDto, ActivityMapper } from '../dto/ActivityDto';
import { Activity } from '../../domain/entities/Activity';

export class ActivityService {
  private createActivityUseCase: CreateActivityUseCase;
  private getActivitiesUseCase: GetActivitiesUseCase;
  private updateActivityUseCase: UpdateActivityUseCase;
  private deleteActivityUseCase: DeleteActivityUseCase;

  constructor(activityRepository: ActivityRepository) {
    this.createActivityUseCase = new CreateActivityUseCase(activityRepository);
    this.getActivitiesUseCase = new GetActivitiesUseCase(activityRepository);
    this.updateActivityUseCase = new UpdateActivityUseCase(activityRepository);
    this.deleteActivityUseCase = new DeleteActivityUseCase(activityRepository);
  }

  async createActivity(dto: CreateActivityDto, userId: string): Promise<ActivityResponseDto> {
    const request = ActivityMapper.toCreateRequest(dto, userId);
    const activity = await this.createActivityUseCase.execute(request);
    return ActivityMapper.toDto(activity);
  }

  async getActivities(filters?: ActivityFiltersDto): Promise<ActivityResponseDto[]> {
    const activities = await this.getActivitiesUseCase.execute(filters);
    return activities.map(ActivityMapper.toDto);
  }

  async updateActivity(activityId: string, dto: UpdateActivityDto): Promise<ActivityResponseDto> {
    const request = ActivityMapper.toUpdateRequest(dto, activityId);
    const activity = await this.updateActivityUseCase.execute(request);
    return ActivityMapper.toDto(activity);
  }

  async deleteActivity(activityId: string, userId: string): Promise<void> {
    await this.deleteActivityUseCase.execute(activityId, userId);
  }

  async getActivityStats() {
    // Este método podría implementarse directamente en el repositorio
    // o crear un caso de uso específico para estadísticas
    throw new Error('Not implemented yet');
  }
}

