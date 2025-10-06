import { UserProfile } from '../../entities/User';
import { ProfileRepository } from '../../repositories/UserRepository';

export class GetUserProfileUseCase {
  constructor(private profileRepository: ProfileRepository) {}

  async execute(userId: string): Promise<UserProfile | null> {
    return this.profileRepository.findByUserId(userId);
  }

  async isUserVerified(userId: string): Promise<boolean> {
    const profile = await this.profileRepository.findByUserId(userId);
    return profile?.isVerified || false;
  }
}

