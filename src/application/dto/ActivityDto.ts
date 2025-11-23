import { Activity, CreateActivityRequest, UpdateActivityRequest, ActivityCategory, ActivityStatus } from '../../domain/entities/Activity';

// Re-exportar tipos del dominio para facilitar el uso
export type { ActivityCategory, ActivityStatus };

export interface ActivityResponseDto {
  id: string;
  title: string;
  description: string;
  category: ActivityCategory;
  latitude: number;
  longitude: number;
  participants: number;
  date: string; // ISO string
  status: ActivityStatus;
  createdBy: string;
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
}

export interface CreateActivityDto {
  title: string;
  description: string;
  category: ActivityCategory;
  latitude: number;
  longitude: number;
  participants: number;
  date: string; // ISO string
  status: ActivityStatus;
}

export interface UpdateActivityDto {
  title?: string;
  description?: string;
  category?: ActivityCategory;
  latitude?: number;
  longitude?: number;
  participants?: number;
  date?: string; // ISO string
  status?: ActivityStatus;
}

export interface ActivityFiltersDto {
  category?: string;
  status?: string;
  locationBounds?: {
    north: number;
    south: number;
    east: number;
    west: number;
  };
}

export class ActivityMapper {
  static toDto(activity: Activity): ActivityResponseDto {
    return {
      id: activity.id,
      title: activity.title,
      description: activity.description,
      category: activity.category,
      latitude: activity.location.latitude,
      longitude: activity.location.longitude,
      participants: activity.participants,
      date: activity.date.toISOString(),
      status: activity.status,
      createdBy: activity.createdBy,
      createdAt: activity.createdAt.toISOString(),
      updatedAt: activity.updatedAt.toISOString(),
    };
  }

  static toCreateRequest(dto: CreateActivityDto, userId: string): CreateActivityRequest {
    return {
      title: dto.title,
      description: dto.description,
      category: dto.category,
      location: {
        latitude: dto.latitude,
        longitude: dto.longitude,
      },
      participants: dto.participants,
      date: new Date(dto.date),
      status: dto.status,
      createdBy: userId,
    };
  }

  static toUpdateRequest(dto: UpdateActivityDto, activityId: string): UpdateActivityRequest {
    const request: UpdateActivityRequest = { id: activityId };

    if (dto.title !== undefined) request.title = dto.title;
    if (dto.description !== undefined) request.description = dto.description;
    if (dto.category !== undefined) request.category = dto.category;
    if (dto.latitude !== undefined || dto.longitude !== undefined) {
      request.location = {
        latitude: dto.latitude ?? 0,
        longitude: dto.longitude ?? 0,
      };
    }
    if (dto.participants !== undefined) request.participants = dto.participants;
    if (dto.date !== undefined) request.date = new Date(dto.date);
    if (dto.status !== undefined) request.status = dto.status;

    return request;
  }
}

