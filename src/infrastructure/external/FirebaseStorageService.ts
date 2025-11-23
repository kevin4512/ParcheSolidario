import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getStorage } from 'firebase/storage';
import { firebaseApp } from '../../../firebase/clientApp';
import { DocumentUploadService } from '../../domain/use-cases/users/CreateProfileUseCase';

export class FirebaseStorageService implements DocumentUploadService {
  private storage = getStorage(firebaseApp);

  async uploadVerificationDocuments(
    userId: string,
    cameraDocument: File,
    commerceDocument: File
  ): Promise<{ cameraDocumentUrl: string; commerceDocumentUrl: string }> {
    try {
      // Subir documento de cámara
      const cameraRef = ref(this.storage, `verification-documents/${userId}/camera-document`);
      const cameraSnapshot = await uploadBytes(cameraRef, cameraDocument);
      const cameraDocumentUrl = await getDownloadURL(cameraSnapshot.ref);

      // Subir documento de comercio
      const commerceRef = ref(this.storage, `verification-documents/${userId}/commerce-document`);
      const commerceSnapshot = await uploadBytes(commerceRef, commerceDocument);
      const commerceDocumentUrl = await getDownloadURL(commerceSnapshot.ref);

      return {
        cameraDocumentUrl,
        commerceDocumentUrl,
      };
    } catch (error) {
      console.error('Error al subir documentos:', error);
      throw error;
    }
  }
}

