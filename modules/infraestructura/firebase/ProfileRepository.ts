import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc, 
  query, 
  where, 
  getDocs,
  serverTimestamp 
} from "firebase/firestore";
import { firebaseApp } from "../../../firebase/clientApp";
import { getFirestore } from "firebase/firestore";

const db = getFirestore(firebaseApp);
import { ProfileData } from "../../domain/profile/ProfileService";

export interface UserProfile extends ProfileData {
  userId: string;
  isVerified: boolean;
  verificationStatus: 'pending' | 'approved' | 'rejected';
  createdAt: any; // serverTimestamp
  updatedAt: any; // serverTimestamp
  documents: {
    cameraDocumentUrl?: string;
    commerceDocumentUrl?: string;
  };
}

export class ProfileRepository {
  private static readonly COLLECTION_NAME = 'userProfiles';

  /**
   * Guarda o actualiza el perfil de un usuario
   */
  static async saveProfile(userId: string, profileData: ProfileData, documentUrls: {
    cameraDocumentUrl: string;
    commerceDocumentUrl: string;
  }): Promise<void> {
    try {
      const profileRef = doc(db, this.COLLECTION_NAME, userId);
      
      const userProfile: UserProfile = {
        ...profileData,
        userId,
        isVerified: false,
        verificationStatus: 'pending',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        documents: {
          cameraDocumentUrl: documentUrls.cameraDocumentUrl,
          commerceDocumentUrl: documentUrls.commerceDocumentUrl
        }
      };

      await setDoc(profileRef, userProfile, { merge: true });
    } catch (error) {
      console.error("Error al guardar perfil:", error);
      throw error;
    }
  }

  /**
   * Crea un documento de perfil mínimo a partir del usuario de Auth si no existe.
   * Esto se usa para garantizar que haya un documento sobre el que poder hacer update posteriormente.
   */
  static async ensureProfileExistsFromAuth(user: any): Promise<void> {
    try {
      if (!user || !user.uid) return;
      const profileRef = doc(db, this.COLLECTION_NAME, user.uid);
      const profileSnap = await getDoc(profileRef);
      if (!profileSnap.exists()) {
        const baseProfile: any = {
          fullName: user.displayName || "",
          email: user.email || "",
          location: "",
          description: "",
          socialMedia: {},
          phone: "",
          userId: user.uid,
          isVerified: false,
          verificationStatus: 'none',
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
          documents: {}
        };

        await setDoc(profileRef, baseProfile, { merge: true });
      }
    } catch (error) {
      console.error("Error al asegurar perfil desde Auth:", error);
      throw error;
    }
  }

  /**
   * Obtiene el perfil de un usuario
   */
  static async getProfile(userId: string): Promise<UserProfile | null> {
    try {
      const profileRef = doc(db, this.COLLECTION_NAME, userId);
      const profileSnap = await getDoc(profileRef);
      
      if (profileSnap.exists()) {
        return profileSnap.data() as UserProfile;
      }
      
      return null;
    } catch (error) {
      console.error("Error al obtener perfil:", error);
      throw error;
    }
  }

  /**
   * Actualiza el estado de verificación de un usuario
   */
  static async updateVerificationStatus(
    userId: string, 
    status: 'pending' | 'approved' | 'rejected',
    isVerified: boolean = false
  ): Promise<void> {
    try {
      const profileRef = doc(db, this.COLLECTION_NAME, userId);
      
      await updateDoc(profileRef, {
        verificationStatus: status,
        isVerified,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error("Error al actualizar estado de verificación:", error);
      throw error;
    }
  }

  /**
   * Obtiene todos los perfiles pendientes de verificación
   */
  static async getPendingProfiles(): Promise<UserProfile[]> {
    try {
      const q = query(
        collection(db, this.COLLECTION_NAME),
        where('verificationStatus', '==', 'pending')
      );
      
      const querySnapshot = await getDocs(q);
      const profiles: UserProfile[] = [];
      
      querySnapshot.forEach((doc) => {
        profiles.push(doc.data() as UserProfile);
      });
      
      return profiles;
    } catch (error) {
      console.error("Error al obtener perfiles pendientes:", error);
      throw error;
    }
  }

  /**
   * Actualiza campos del perfil de un usuario (sin tocar documentos ni verificationStatus a menos que se indique)
   */
  static async updateProfile(userId: string, updateData: Partial<ProfileData>): Promise<void> {
    try {
      const profileRef = doc(db, this.COLLECTION_NAME, userId);
      // Debug: log payload
      console.log("ProfileRepository.updateProfile: userId=", userId, "updateData=", updateData);
      // Use setDoc with merge so that if the document does not exist it will be created.
      await setDoc(profileRef, {
        ...updateData,
        updatedAt: serverTimestamp()
      }, { merge: true });

      // Confirm success
      console.log("ProfileRepository.updateProfile: setDoc successful for", userId);
    } catch (error) {
      console.error("Error al actualizar perfil:", error);
      throw error;
    }
  }

  /**
   * Verifica si un usuario ya tiene un perfil
   */
  static async hasProfile(userId: string): Promise<boolean> {
    try {
      const profile = await this.getProfile(userId);
      return profile !== null;
    } catch (error) {
      console.error("Error al verificar si existe perfil:", error);
      return false;
    }
  }
}
