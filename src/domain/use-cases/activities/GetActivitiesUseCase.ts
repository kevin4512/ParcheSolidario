import { Activity } from '../../entities/Activity';
import { ActivityRepository } from '../../repositories/ActivityRepository';

export interface GetActivitiesFilters {
  category?: string;
  status?: string;
  locationBounds?: {
    north: number;
    south: number;
    east: number;
    west: number;
  };
}

export class GetActivitiesUseCase {
  constructor(private activityRepository: ActivityRepository) {}

  async execute(filters?: GetActivitiesFilters): Promise<Activity[]> {
    if (filters?.category) {
      return this.activityRepository.findByCategory(filters.category);
    }

    if (filters?.status) {
      return this.activityRepository.findByStatus(filters.status);
    }

    if (filters?.locationBounds) {
      return this.activityRepository.findByLocationBounds(
        filters.locationBounds.north,
        filters.locationBounds.south,
        filters.locationBounds.east,
        filters.locationBounds.west
      );
    }

    return this.activityRepository.findAll();
  }
}

