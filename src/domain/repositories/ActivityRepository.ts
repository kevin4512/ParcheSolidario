import { Activity, CreateActivityRequest, UpdateActivityRequest } from '../entities/Activity';

export interface ActivityRepository {
  findAll(): Promise<Activity[]>;
  findById(id: string): Promise<Activity | null>;
  findByCategory(category: string): Promise<Activity[]>;
  findByStatus(status: string): Promise<Activity[]>;
  findByLocationBounds(
    north: number,
    south: number,
    east: number,
    west: number
  ): Promise<Activity[]>;
  create(activity: CreateActivityRequest): Promise<Activity>;
  update(activity: UpdateActivityRequest): Promise<Activity>;
  delete(id: string): Promise<void>;
  getStats(): Promise<ActivityStats>;
}

export interface ActivityStats {
  total: number;
  byCategory: Record<string, number>;
  byStatus: Record<string, number>;
}

