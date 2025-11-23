import { useState, useEffect } from 'react';
import { ActivityService } from '../../application/services/ActivityService';
import { ActivityResponseDto, CreateActivityDto, UpdateActivityDto, ActivityFiltersDto } from '../../application/dto/ActivityDto';
import { container } from '../../infrastructure/di/Container';

export function useActivities() {
  const [activities, setActivities] = useState<ActivityResponseDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const activityService = container.getActivityService();

  const loadActivities = async (filters?: ActivityFiltersDto) => {
    setLoading(true);
    setError(null);
    try {
      const data = await activityService.getActivities(filters);
      setActivities(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar actividades');
    } finally {
      setLoading(false);
    }
  };

  const createActivity = async (activityData: CreateActivityDto, userId: string) => {
    setLoading(true);
    setError(null);
    try {
      const newActivity = await activityService.createActivity(activityData, userId);
      setActivities(prev => [newActivity, ...prev]);
      return newActivity;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear actividad');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateActivity = async (activityId: string, activityData: UpdateActivityDto) => {
    setLoading(true);
    setError(null);
    try {
      const updatedActivity = await activityService.updateActivity(activityId, activityData);
      setActivities(prev => 
        prev.map(activity => 
          activity.id === activityId ? updatedActivity : activity
        )
      );
      return updatedActivity;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al actualizar actividad');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteActivity = async (activityId: string, userId: string) => {
    setLoading(true);
    setError(null);
    try {
      await activityService.deleteActivity(activityId, userId);
      setActivities(prev => prev.filter(activity => activity.id !== activityId));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al eliminar actividad');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    activities,
    loading,
    error,
    loadActivities,
    createActivity,
    updateActivity,
    deleteActivity,
  };
}

