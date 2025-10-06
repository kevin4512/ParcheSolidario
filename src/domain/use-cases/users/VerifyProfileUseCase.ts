import { UserProfile, VerificationStatus } from '../../entities/User';
import { ProfileRepository } from '../../repositories/UserRepository';

export class VerifyProfileUseCase {
  constructor(private profileRepository: ProfileRepository) {}

  async execute(userId: string, status: VerificationStatus): Promise<UserProfile> {
    const isVerified = status === 'approved';
    
    await this.profileRepository.updateVerificationStatus(userId, status, isVerified);
    
    const updatedProfile = await this.profileRepository.findByUserId(userId);
    if (!updatedProfile) {
      throw new Error('Perfil no encontrado');
    }

    return updatedProfile;
  }

  async getPendingVerifications(): Promise<UserProfile[]> {
    return this.profileRepository.findPendingVerifications();
  }
}

