import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, where, orderBy, serverTimestamp } from "firebase/firestore";
import { getFirestore } from "firebase/firestore";
import { firebaseApp } from "../../../firebase/clientApp";

const db = getFirestore(firebaseApp);

export interface Activity {
  id: string;
  title: string;
  description: string;
  category: 'eventos' | 'colectas' | 'refugios' | 'protestas';
  latitude: number;
  longitude: number;
  participants: number;
  capacity: number;
  date: string;
  time: string;
  location: string;
  fundraisingGoal: string;
  status: 'active' | 'completed' | 'upcoming';
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateActivityData {
  title: string;
  description: string;
  category: 'eventos' | 'colectas' | 'refugios' | 'protestas';
  latitude: number;
  longitude: number;
  participants: number;
  capacity: number;
  date: string;
  time: string;
  location: string;
  fundraisingGoal: string;
  status: 'active' | 'completed' | 'upcoming';
  createdBy: string;
}

export class ActivitiesService {
  private static readonly COLLECTION_NAME = 'activities';

  /**
   * Obtiene todas las actividades desde Firebase
   */
  static async getAllActivities(): Promise<Activity[]> {
    try {
      const activitiesRef = collection(db, this.COLLECTION_NAME);
      const q = query(activitiesRef, orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      
      const activities: Activity[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        
        // Validar y limpiar datos
        const activity: Activity = {
          id: doc.id,
          title: data.title || '',
          description: data.description || '',
          category: data.category || 'eventos',
          latitude: typeof data.latitude === 'number' ? data.latitude : 6.2442, // Default Medellín
          longitude: typeof data.longitude === 'number' ? data.longitude : -75.5812, // Default Medellín
          participants: typeof data.participants === 'number' ? data.participants : 0,
          capacity: typeof data.capacity === 'number' ? data.capacity : 1,
          date: data.date || '',
          time: data.time || '',
          location: data.location || '',
          fundraisingGoal: data.fundraisingGoal || '',
          status: data.status || 'upcoming',
          createdBy: data.createdBy || '',
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
        };
        
        activities.push(activity);
      });

      return activities;
    } catch (error) {
      console.error("Error al obtener actividades:", error);
      throw error;
    }
  }

  /**
   * Obtiene actividades por categoría
   */
  static async getActivitiesByCategory(category: string): Promise<Activity[]> {
    try {
      const activitiesRef = collection(db, this.COLLECTION_NAME);
      const q = query(
        activitiesRef, 
        where('category', '==', category),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      
      const activities: Activity[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        activities.push({
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
        } as Activity);
      });

      return activities;
    } catch (error) {
      console.error("Error al obtener actividades por categoría:", error);
      throw error;
    }
  }

  /**
   * Obtiene actividades por estado
   */
  static async getActivitiesByStatus(status: string): Promise<Activity[]> {
    try {
      const activitiesRef = collection(db, this.COLLECTION_NAME);
      const q = query(
        activitiesRef, 
        where('status', '==', status),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      
      const activities: Activity[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        activities.push({
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
        } as Activity);
      });

      return activities;
    } catch (error) {
      console.error("Error al obtener actividades por estado:", error);
      throw error;
    }
  }

  /**
   * Obtiene actividades en un rango geográfico
   */
  static async getActivitiesInBounds(
    north: number, 
    south: number, 
    east: number, 
    west: number
  ): Promise<Activity[]> {
    try {
      const activitiesRef = collection(db, this.COLLECTION_NAME);
      const q = query(
        activitiesRef,
        where('latitude', '>=', south),
        where('latitude', '<=', north),
        where('longitude', '>=', west),
        where('longitude', '<=', east),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      
      const activities: Activity[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        activities.push({
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
        } as Activity);
      });

      return activities;
    } catch (error) {
      console.error("Error al obtener actividades en rango geográfico:", error);
      throw error;
    }
  }

  /**
   * Crea una nueva actividad
   */
  static async createActivity(activityData: CreateActivityData): Promise<string> {
    try {
      const activitiesRef = collection(db, this.COLLECTION_NAME);
      
      const docRef = await addDoc(activitiesRef, {
        // Campos requeridos + defaults defensivos
        title: activityData.title,
        description: activityData.description,
        category: activityData.category,
        latitude: activityData.latitude,
        longitude: activityData.longitude,
        participants: activityData.participants ?? 0,
        capacity: activityData.capacity ?? 1,
        date: activityData.date,
        time: activityData.time,
        location: activityData.location,
        fundraisingGoal: activityData.fundraisingGoal,
        status: activityData.status,
        createdBy: activityData.createdBy,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      return docRef.id;
    } catch (error) {
      console.error("Error al crear actividad:", error);
      throw error;
    }
  }

  /**
   * Actualiza una actividad existente
   */
  static async updateActivity(activityId: string, updateData: Partial<CreateActivityData>): Promise<void> {
    try {
      const activityRef = doc(db, this.COLLECTION_NAME, activityId);
      await updateDoc(activityRef, {
        ...updateData,
        updatedAt: new Date(),
      });
    } catch (error) {
      console.error("Error al actualizar actividad:", error);
      throw error;
    }
  }

  /**
   * Elimina una actividad
   */
  static async deleteActivity(activityId: string): Promise<void> {
    try {
      const activityRef = doc(db, this.COLLECTION_NAME, activityId);
      await deleteDoc(activityRef);
    } catch (error) {
      console.error("Error al eliminar actividad:", error);
      throw error;
    }
  }

  /**
   * Obtiene estadísticas de actividades
   */
  static async getActivityStats(): Promise<{
    total: number;
    byCategory: Record<string, number>;
    byStatus: Record<string, number>;
  }> {
    try {
      const activities = await this.getAllActivities();
      
      const stats = {
        total: activities.length,
        byCategory: {} as Record<string, number>,
        byStatus: {} as Record<string, number>
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
      console.error("Error al obtener estadísticas:", error);
      throw error;
    }
  }
}
