import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { firebaseApp } from "../../../firebase/clientApp";

const storage = getStorage(firebaseApp);

export interface UploadResult {
  url: string;
  path: string;
}

export class StorageService {
  /**
   * Sube un archivo a Firebase Storage
   * @param file - Archivo a subir
   * @param path - Ruta donde guardar el archivo
   * @returns URL de descarga del archivo
   */
  static async uploadFile(file: File, path: string): Promise<UploadResult> {
    try {
      // Validar tamaño del archivo (máximo 5MB)
      const maxSize = 5 * 1024 * 1024; // 5MB en bytes
      if (file.size > maxSize) {
        throw new Error("El archivo es demasiado grande. Máximo 5MB permitido.");
      }

      // Validar tipo de archivo
      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
      if (!allowedTypes.includes(file.type)) {
        throw new Error("Tipo de archivo no permitido. Solo se aceptan PDF, JPG, JPEG y PNG.");
      }

      // Crear referencia al archivo en Storage
      const storageRef = ref(storage, path);
      
      // Subir el archivo
      const snapshot = await uploadBytes(storageRef, file);
      
      // Obtener URL de descarga
      const downloadURL = await getDownloadURL(snapshot.ref);
      
      return {
        url: downloadURL,
        path: snapshot.ref.fullPath
      };
    } catch (error) {
      console.error("Error al subir archivo:", error);
      throw error;
    }
  }

  /**
   * Sube documentos de verificación de perfil
   * @param userId - ID del usuario
   * @param cameraDocument - Documento de cámara
   * @param commerceDocument - Documento de comercio
   * @returns URLs de los documentos subidos
   */
  static async uploadVerificationDocuments(
    userId: string,
    cameraDocument: File,
    commerceDocument: File
  ): Promise<{
    cameraDocument: UploadResult;
    commerceDocument: UploadResult;
  }> {
    try {
      const timestamp = Date.now();
      
      // Subir documento de cámara
      const cameraPath = `verification-documents/${userId}/camera-document-${timestamp}.${cameraDocument.name.split('.').pop()}`;
      const cameraResult = await this.uploadFile(cameraDocument, cameraPath);
      
      // Subir documento de comercio
      const commercePath = `verification-documents/${userId}/commerce-document-${timestamp}.${commerceDocument.name.split('.').pop()}`;
      const commerceResult = await this.uploadFile(commerceDocument, commercePath);
      
      return {
        cameraDocument: cameraResult,
        commerceDocument: commerceResult
      };
    } catch (error) {
      console.error("Error al subir documentos de verificación:", error);
      throw error;
    }
  }
}
