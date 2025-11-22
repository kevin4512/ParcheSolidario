export interface Activity {
  id: string;
  title: string;
  description: string;
  category: ActivityCategory;
  location: Location;
  participants: number;
  date: Date;
  status: ActivityStatus;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export type ActivityCategory = 'eventos' | 'colectas' | 'refugios' | 'protestas';
export type ActivityStatus = 'active' | 'completed' | 'upcoming';

export interface Location {
  latitude: number;
  longitude: number;
}

export interface CreateActivityRequest {
  title: string;
  description: string;
  category: ActivityCategory;
  location: Location;
  participants: number;
  date: Date;
  status: ActivityStatus;
  createdBy: string;
}

export interface UpdateActivityRequest {
  id: string;
  title?: string;
  description?: string;
  category?: ActivityCategory;
  location?: Location;
  participants?: number;
  date?: Date;
  status?: ActivityStatus;
}

