// Servicio para enviar notificaciones por email
// En un entorno de producción, esto se conectaría con un servicio como SendGrid, Nodemailer, o Firebase Functions

export interface VerificationEmailData {
  userEmail: string;
  userName: string;
  userLocation: string;
  cameraDocumentUrl: string;
  commerceDocumentUrl: string;
  profileData: {
    fullName: string;
    description: string;
    location: string;
    phone: string;
    socialMedia: {
      facebook?: string;
      instagram?: string;
      twitter?: string;
      linkedin?: string;
    };
  };
}

export class EmailService {
  /**
   * Envía notificación de verificación de perfil al administrador
   * @param data - Datos del usuario y documentos
   */
  static async sendVerificationNotification(data: VerificationEmailData): Promise<void> {
    try {
      // En un entorno de producción, aquí se implementaría el envío real de email
      // Por ahora, simulamos el envío y mostramos los datos en consola
      
      const emailContent = this.generateVerificationEmailContent(data);
      
      console.log("=== NOTIFICACIÓN DE VERIFICACIÓN DE PERFIL ===");
      console.log("Para: administrador@parchesolidario.com");
      console.log("Asunto: Nueva solicitud de verificación de perfil");
      console.log("Contenido:", emailContent);
      console.log("=============================================");
      
      // Simular delay de envío
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // En producción, aquí se haría algo como:
      // await sendGrid.send({
      //   to: 'administrador@parchesolidario.com',
      //   from: 'noreply@parchesolidario.com',
      //   subject: 'Nueva solicitud de verificación de perfil',
      //   html: emailContent
      // });
      
    } catch (error) {
      console.error("Error al enviar notificación de verificación:", error);
      throw error;
    }
  }

  /**
   * Genera el contenido HTML del email de notificación
   */
  private static generateVerificationEmailContent(data: VerificationEmailData): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Nueva Solicitud de Verificación</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #3b82f6; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: #f8f9fa; padding: 20px; border-radius: 0 0 8px 8px; }
          .section { margin-bottom: 20px; }
          .label { font-weight: bold; color: #374151; }
          .value { margin-left: 10px; }
          .documents { background: white; padding: 15px; border-radius: 5px; margin: 10px 0; }
          .button { 
            display: inline-block; 
            background: #3b82f6; 
            color: white; 
            padding: 10px 20px; 
            text-decoration: none; 
            border-radius: 5px; 
            margin: 10px 5px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🏛️ Parche Solidario</h1>
            <h2>Nueva Solicitud de Verificación de Perfil</h2>
          </div>
          
          <div class="content">
            <div class="section">
              <h3>Información del Usuario</h3>
              <p><span class="label">Nombre:</span> <span class="value">${data.profileData.fullName}</span></p>
              <p><span class="label">Email:</span> <span class="value">${data.userEmail}</span></p>
              <p><span class="label">Ubicación:</span> <span class="value">${data.profileData.location}</span></p>
              <p><span class="label">Teléfono:</span> <span class="value">${data.profileData.phone || 'No proporcionado'}</span></p>
              <p><span class="label">Descripción:</span> <span class="value">${data.profileData.description}</span></p>
            </div>

            <div class="section">
              <h3>Redes Sociales</h3>
              ${data.profileData.socialMedia.facebook ? `<p><span class="label">Facebook:</span> <span class="value">${data.profileData.socialMedia.facebook}</span></p>` : ''}
              ${data.profileData.socialMedia.instagram ? `<p><span class="label">Instagram:</span> <span class="value">${data.profileData.socialMedia.instagram}</span></p>` : ''}
              ${data.profileData.socialMedia.twitter ? `<p><span class="label">Twitter:</span> <span class="value">${data.profileData.socialMedia.twitter}</span></p>` : ''}
              ${data.profileData.socialMedia.linkedin ? `<p><span class="label">LinkedIn:</span> <span class="value">${data.profileData.socialMedia.linkedin}</span></p>` : ''}
            </div>

            <div class="section">
              <h3>Documentos Subidos</h3>
              <div class="documents">
                <p><span class="label">Documento de Cámara:</span></p>
                <a href="${data.cameraDocumentUrl}" class="button" target="_blank">Ver Documento de Cámara</a>
              </div>
              <div class="documents">
                <p><span class="label">Documento de Comercio:</span></p>
                <a href="${data.commerceDocumentUrl}" class="button" target="_blank">Ver Documento de Comercio</a>
              </div>
            </div>

            <div class="section">
              <h3>Acciones Requeridas</h3>
              <p>Por favor revisa los documentos y verifica la información del usuario en Firebase Console:</p>
              <ol>
                <li>Accede a Firebase Console</li>
                <li>Ve a Authentication > Users</li>
                <li>Busca el usuario por email: <strong>${data.userEmail}</strong></li>
                <li>Cambia el rol del usuario a "verified" una vez verificado</li>
              </ol>
            </div>

            <div class="section">
              <p><em>Este email fue generado automáticamente por el sistema de Parche Solidario.</em></p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  /**
   * Envía confirmación al usuario de que su solicitud fue recibida
   */
  static async sendUserConfirmation(userEmail: string, userName: string): Promise<void> {
    try {
      const confirmationContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>Confirmación de Solicitud</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #3b82f6; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f8f9fa; padding: 20px; border-radius: 0 0 8px 8px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🏛️ Parche Solidario</h1>
              <h2>Solicitud Recibida</h2>
            </div>
            <div class="content">
              <p>Hola <strong>${userName}</strong>,</p>
              <p>Hemos recibido tu solicitud de verificación de perfil correctamente.</p>
              <p>Nuestro equipo revisará los documentos que subiste y te notificaremos cuando tu cuenta esté verificada.</p>
              <p>Este proceso puede tomar entre 1-3 días hábiles.</p>
              <p>¡Gracias por unirte a nuestra comunidad solidaria!</p>
              <p><em>El equipo de Parche Solidario</em></p>
            </div>
          </div>
        </body>
        </html>
      `;

      console.log("=== CONFIRMACIÓN AL USUARIO ===");
      console.log("Para:", userEmail);
      console.log("Asunto: Solicitud de verificación recibida");
      console.log("Contenido:", confirmationContent);
      console.log("==============================");

      // Simular delay de envío
      await new Promise(resolve => setTimeout(resolve, 1000));

    } catch (error) {
      console.error("Error al enviar confirmación al usuario:", error);
      throw error;
    }
  }
}
