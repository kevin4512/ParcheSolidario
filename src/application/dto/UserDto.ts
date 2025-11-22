import { UserProfile, CreateProfileRequest, SocialMedia, VerificationStatus } from '../../domain/entities/User';

export interface UserProfileResponseDto {
  id: string;
  userId: string;
  fullName: string;
  description: string;
  location: string;
  socialMedia: SocialMedia;
  phone: string;
  email: string;
  isVerified: boolean;
  verificationStatus: VerificationStatus;
  documents: {
    cameraDocumentUrl: string;
    commerceDocumentUrl: string;
  };
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
}

export interface CreateProfileDto {
  fullName: string;
  description: string;
  location: string;
  socialMedia: SocialMedia;
  phone: string;
  email: string;
}

export interface DocumentUploadDto {
  cameraDocument: File;
  commerceDocument: File;
}

export class UserMapper {
  static toProfileDto(profile: UserProfile): UserProfileResponseDto {
    return {
      id: profile.id,
      userId: profile.userId,
      fullName: profile.fullName,
      description: profile.description,
      location: profile.location,
      socialMedia: profile.socialMedia,
      phone: profile.phone,
      email: profile.email,
      isVerified: profile.isVerified,
      verificationStatus: profile.verificationStatus,
      documents: {
        cameraDocumentUrl: profile.documents.cameraDocumentUrl,
        commerceDocumentUrl: profile.documents.commerceDocumentUrl,
      },
      createdAt: profile.createdAt.toISOString(),
      updatedAt: profile.updatedAt.toISOString(),
    };
  }

  static toCreateRequest(dto: CreateProfileDto): CreateProfileRequest {
    return {
      fullName: dto.fullName,
      description: dto.description,
      location: dto.location,
      socialMedia: dto.socialMedia,
      phone: dto.phone,
      email: dto.email,
    };
  }
}

