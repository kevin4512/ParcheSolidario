import { collection, getDocs, addDoc, updateDoc, doc, query, where, orderBy } from 'firebase/firestore';
import { getFirestore } from 'firebase/firestore';
import { firebaseApp } from '../../../firebase/clientApp';
import { UserProfile, CreateProfileRequest, VerificationStatus } from '../../domain/entities/User';
import { ProfileRepository } from '../../domain/repositories/UserRepository';

export class FirebaseProfileRepository implements ProfileRepository {
  private db = getFirestore(firebaseApp);
  private readonly COLLECTION_NAME = 'profiles';

  async findByUserId(userId: string): Promise<UserProfile | null> {
    try {
      const profilesRef = collection(this.db, this.COLLECTION_NAME);
      const q = query(profilesRef, where('userId', '==', userId));
      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) {
        return null;
      }

      const doc = querySnapshot.docs[0];
      return this.mapDocumentToProfile(doc.id, doc.data());
    } catch (error) {
      console.error('Error al obtener perfil por userId:', error);
      throw error;
    }
  }

  async hasProfile(userId: string): Promise<boolean> {
    try {
      const profile = await this.findByUserId(userId);
      return profile !== null;
    } catch (error) {
      console.error('Error al verificar si existe perfil:', error);
      return false;
    }
  }

  async create(profile: Omit<UserProfile, 'id' | 'createdAt' | 'updatedAt'>): Promise<UserProfile> {
    try {
      const profilesRef = collection(this.db, this.COLLECTION_NAME);
      const now = new Date();
      
      const docRef = await addDoc(profilesRef, {
        userId: profile.userId,
        fullName: profile.fullName,
        description: profile.description,
        location: profile.location,
        socialMedia: profile.socialMedia,
        phone: profile.phone,
        email: profile.email,
        isVerified: profile.isVerified,
        verificationStatus: profile.verificationStatus,
        documents: profile.documents,
        createdAt: now,
        updatedAt: now,
      });

      return {
        id: docRef.id,
        ...profile,
        createdAt: now,
        updatedAt: now,
      };
    } catch (error) {
      console.error('Error al crear perfil:', error);
      throw error;
    }
  }

  async update(userId: string, profile: Partial<UserProfile>): Promise<UserProfile> {
    try {
      const existingProfile = await this.findByUserId(userId);
      if (!existingProfile) {
        throw new Error('Perfil no encontrado');
      }

      const profileRef = doc(this.db, this.COLLECTION_NAME, existingProfile.id);
      const updateData: any = {
        updatedAt: new Date(),
      };

      if (profile.fullName !== undefined) updateData.fullName = profile.fullName;
      if (profile.description !== undefined) updateData.description = profile.description;
      if (profile.location !== undefined) updateData.location = profile.location;
      if (profile.socialMedia !== undefined) updateData.socialMedia = profile.socialMedia;
      if (profile.phone !== undefined) updateData.phone = profile.phone;
      if (profile.email !== undefined) updateData.email = profile.email;
      if (profile.isVerified !== undefined) updateData.isVerified = profile.isVerified;
      if (profile.verificationStatus !== undefined) updateData.verificationStatus = profile.verificationStatus;
      if (profile.documents !== undefined) updateData.documents = profile.documents;

      await updateDoc(profileRef, updateData);

      // Obtener el perfil actualizado
      const updatedProfile = await this.findByUserId(userId);
      if (!updatedProfile) {
        throw new Error('Error al obtener el perfil actualizado');
      }

      return updatedProfile;
    } catch (error) {
      console.error('Error al actualizar perfil:', error);
      throw error;
    }
  }

  async updateVerificationStatus(
    userId: string,
    status: VerificationStatus,
    isVerified: boolean
  ): Promise<void> {
    try {
      const existingProfile = await this.findByUserId(userId);
      if (!existingProfile) {
        throw new Error('Perfil no encontrado');
      }

      const profileRef = doc(this.db, this.COLLECTION_NAME, existingProfile.id);
      await updateDoc(profileRef, {
        verificationStatus: status,
        isVerified,
        updatedAt: new Date(),
      });
    } catch (error) {
      console.error('Error al actualizar estado de verificación:', error);
      throw error;
    }
  }

  async findPendingVerifications(): Promise<UserProfile[]> {
    try {
      const profilesRef = collection(this.db, this.COLLECTION_NAME);
      const q = query(
        profilesRef,
        where('verificationStatus', '==', 'pending'),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      
      const profiles: UserProfile[] = [];
      querySnapshot.forEach((doc) => {
        profiles.push(this.mapDocumentToProfile(doc.id, doc.data()));
      });

      return profiles;
    } catch (error) {
      console.error('Error al obtener verificaciones pendientes:', error);
      throw error;
    }
  }

  private mapDocumentToProfile(id: string, data: any): UserProfile {
    return {
      id,
      userId: data.userId,
      fullName: data.fullName,
      description: data.description,
      location: data.location,
      socialMedia: data.socialMedia || {},
      phone: data.phone,
      email: data.email,
      isVerified: data.isVerified || false,
      verificationStatus: data.verificationStatus || 'pending',
      documents: {
        cameraDocumentUrl: data.documents?.cameraDocumentUrl || '',
        commerceDocumentUrl: data.documents?.commerceDocumentUrl || '',
      },
      createdAt: data.createdAt?.toDate() || new Date(data.createdAt),
      updatedAt: data.updatedAt?.toDate() || new Date(data.updatedAt),
    };
  }
}

