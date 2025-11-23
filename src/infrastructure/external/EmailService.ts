import { EmailService as IEmailService, VerificationEmailData } from '../../domain/use-cases/users/CreateProfileUseCase';

export class EmailService implements IEmailService {
  async sendVerificationNotification(data: VerificationEmailData): Promise<void> {
    try {
      // Aquí implementarías el envío real de email
      // Por ahora solo logueamos la información
      console.log('Enviando notificación de verificación:', {
        to: 'admin@parchesolidario.com',
        subject: 'Nueva verificación de perfil pendiente',
        data: {
          userName: data.userName,
          userEmail: data.userEmail,
          userLocation: data.userLocation,
        }
      });

      // TODO: Implementar envío real de email usando un servicio como SendGrid, Nodemailer, etc.
    } catch (error) {
      console.error('Error al enviar notificación de verificación:', error);
      throw error;
    }
  }

  async sendUserConfirmation(email: string, name: string): Promise<void> {
    try {
      // Aquí implementarías el envío real de email
      // Por ahora solo logueamos la información
      console.log('Enviando confirmación al usuario:', {
        to: email,
        subject: 'Confirmación de registro de perfil',
        data: { name }
      });

      // TODO: Implementar envío real de email usando un servicio como SendGrid, Nodemailer, etc.
    } catch (error) {
      console.error('Error al enviar confirmación al usuario:', error);
      throw error;
    }
  }
}

