import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, where, orderBy } from 'firebase/firestore';
import { getFirestore } from 'firebase/firestore';
import { firebaseApp } from '../../../firebase/clientApp';
import { Activity, CreateActivityRequest, UpdateActivityRequest, ActivityStats } from '../../domain/entities/Activity';
import { ActivityRepository } from '../../domain/repositories/ActivityRepository';

export class FirebaseActivityRepository implements ActivityRepository {
  private db = getFirestore(firebaseApp);
  private readonly COLLECTION_NAME = 'activities';

  async findAll(): Promise<Activity[]> {
    try {
      const activitiesRef = collection(this.db, this.COLLECTION_NAME);
      const q = query(activitiesRef, orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      
      return this.mapDocumentsToActivities(querySnapshot);
    } catch (error) {
      console.error('Error al obtener actividades:', error);
      throw error;
    }
  }

  async findById(id: string): Promise<Activity | null> {
    try {
      const activitiesRef = collection(this.db, this.COLLECTION_NAME);
      const q = query(activitiesRef, where('__name__', '==', id));
      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) {
        return null;
      }

      const doc = querySnapshot.docs[0];
      return this.mapDocumentToActivity(doc.id, doc.data());
    } catch (error) {
      console.error('Error al obtener actividad por ID:', error);
      throw error;
    }
  }

  async findByCategory(category: string): Promise<Activity[]> {
    try {
      const activitiesRef = collection(this.db, this.COLLECTION_NAME);
      const q = query(
        activitiesRef, 
        where('category', '==', category),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      
      return this.mapDocumentsToActivities(querySnapshot);
    } catch (error) {
      console.error('Error al obtener actividades por categoría:', error);
      throw error;
    }
  }

  async findByStatus(status: string): Promise<Activity[]> {
    try {
      const activitiesRef = collection(this.db, this.COLLECTION_NAME);
      const q = query(
        activitiesRef, 
        where('status', '==', status),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      
      return this.mapDocumentsToActivities(querySnapshot);
    } catch (error) {
      console.error('Error al obtener actividades por estado:', error);
      throw error;
    }
  }

  async findByLocationBounds(
    north: number,
    south: number,
    east: number,
    west: number
  ): Promise<Activity[]> {
    try {
      const activitiesRef = collection(this.db, this.COLLECTION_NAME);
      const q = query(
        activitiesRef,
        where('latitude', '>=', south),
        where('latitude', '<=', north),
        where('longitude', '>=', west),
        where('longitude', '<=', east),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      
      return this.mapDocumentsToActivities(querySnapshot);
    } catch (error) {
      console.error('Error al obtener actividades en rango geográfico:', error);
      throw error;
    }
  }

  async create(activity: CreateActivityRequest): Promise<Activity> {
    try {
      const activitiesRef = collection(this.db, this.COLLECTION_NAME);
      const now = new Date();
      
      const docRef = await addDoc(activitiesRef, {
        title: activity.title,
        description: activity.description,
        category: activity.category,
        latitude: activity.location.latitude,
        longitude: activity.location.longitude,
        participants: activity.participants,
        date: activity.date,
        status: activity.status,
        createdBy: activity.createdBy,
        createdAt: now,
        updatedAt: now,
      });

      return {
        id: docRef.id,
        ...activity,
        createdAt: now,
        updatedAt: now,
      };
    } catch (error) {
      console.error('Error al crear actividad:', error);
      throw error;
    }
  }

  async update(activity: UpdateActivityRequest): Promise<Activity> {
    try {
      const activityRef = doc(this.db, this.COLLECTION_NAME, activity.id);
      const updateData: any = {
        updatedAt: new Date(),
      };

      if (activity.title !== undefined) updateData.title = activity.title;
      if (activity.description !== undefined) updateData.description = activity.description;
      if (activity.category !== undefined) updateData.category = activity.category;
      if (activity.location !== undefined) {
        updateData.latitude = activity.location.latitude;
        updateData.longitude = activity.location.longitude;
      }
      if (activity.participants !== undefined) updateData.participants = activity.participants;
      if (activity.date !== undefined) updateData.date = activity.date;
      if (activity.status !== undefined) updateData.status = activity.status;

      await updateDoc(activityRef, updateData);

      // Obtener la actividad actualizada
      const updatedActivity = await this.findById(activity.id);
      if (!updatedActivity) {
        throw new Error('Error al obtener la actividad actualizada');
      }

      return updatedActivity;
    } catch (error) {
      console.error('Error al actualizar actividad:', error);
      throw error;
    }
  }

  async delete(id: string): Promise<void> {
    try {
      const activityRef = doc(this.db, this.COLLECTION_NAME, id);
      await deleteDoc(activityRef);
    } catch (error) {
      console.error('Error al eliminar actividad:', error);
      throw error;
    }
  }

  async getStats(): Promise<ActivityStats> {
    try {
      const activities = await this.findAll();
      
      const stats: ActivityStats = {
        total: activities.length,
        byCategory: {},
        byStatus: {}
      };

      activities.forEach(activity => {
        // Contar por categoría
        if (!stats.byCategory[activity.category]) {
          stats.byCategory[activity.category] = 0;
        }
        stats.byCategory[activity.category]++;

        // Contar por estado
        if (!stats.byStatus[activity.status]) {
          stats.byStatus[activity.status] = 0;
        }
        stats.byStatus[activity.status]++;
      });

      return stats;
    } catch (error) {
      console.error('Error al obtener estadísticas:', error);
      throw error;
    }
  }

  private mapDocumentsToActivities(querySnapshot: any): Activity[] {
    const activities: Activity[] = [];
    querySnapshot.forEach((doc: any) => {
      activities.push(this.mapDocumentToActivity(doc.id, doc.data()));
    });
    return activities;
  }

  private mapDocumentToActivity(id: string, data: any): Activity {
    return {
      id,
      title: data.title,
      description: data.description,
      category: data.category,
      location: {
        latitude: data.latitude,
        longitude: data.longitude,
      },
      participants: data.participants,
      date: data.date?.toDate() || new Date(data.date),
      status: data.status,
      createdBy: data.createdBy,
      createdAt: data.createdAt?.toDate() || new Date(data.createdAt),
      updatedAt: data.updatedAt?.toDate() || new Date(data.updatedAt),
    };
  }
}

