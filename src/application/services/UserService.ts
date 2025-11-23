import { CreateProfileUseCase, DocumentUploadService, EmailService } from '../../domain/use-cases/users/CreateProfileUseCase';
import { GetUserProfileUseCase } from '../../domain/use-cases/users/GetUserProfileUseCase';
import { VerifyProfileUseCase } from '../../domain/use-cases/users/VerifyProfileUseCase';
import { ProfileRepository } from '../../domain/repositories/UserRepository';
import { UserProfileResponseDto, CreateProfileDto, DocumentUploadDto, UserMapper } from '../dto/UserDto';
import { UserProfile } from '../../domain/entities/User';

export class UserService {
  private createProfileUseCase: CreateProfileUseCase;
  private getUserProfileUseCase: GetUserProfileUseCase;
  private verifyProfileUseCase: VerifyProfileUseCase;

  constructor(
    profileRepository: ProfileRepository,
    documentUploadService: DocumentUploadService,
    emailService: EmailService
  ) {
    this.createProfileUseCase = new CreateProfileUseCase(
      profileRepository,
      documentUploadService,
      emailService
    );
    this.getUserProfileUseCase = new GetUserProfileUseCase(profileRepository);
    this.verifyProfileUseCase = new VerifyProfileUseCase(profileRepository);
  }

  async createProfile(
    userId: string,
    profileDto: CreateProfileDto,
    documents: DocumentUploadDto
  ): Promise<UserProfileResponseDto> {
    const request = UserMapper.toCreateRequest(profileDto);
    const profile = await this.createProfileUseCase.execute(userId, request, documents);
    return UserMapper.toProfileDto(profile);
  }

  async getUserProfile(userId: string): Promise<UserProfileResponseDto | null> {
    const profile = await this.getUserProfileUseCase.execute(userId);
    return profile ? UserMapper.toProfileDto(profile) : null;
  }

  async isUserVerified(userId: string): Promise<boolean> {
    return this.getUserProfileUseCase.isUserVerified(userId);
  }

  async verifyProfile(userId: string, status: 'approved' | 'rejected'): Promise<UserProfileResponseDto> {
    const profile = await this.verifyProfileUseCase.execute(userId, status);
    return UserMapper.toProfileDto(profile);
  }

  async getPendingVerifications(): Promise<UserProfileResponseDto[]> {
    const profiles = await this.verifyProfileUseCase.getPendingVerifications();
    return profiles.map(UserMapper.toProfileDto);
  }
}

