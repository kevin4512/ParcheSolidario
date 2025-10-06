export interface User {
  id: string;
  email: string;
  fullName: string;
  isVerified: boolean;
  profile?: UserProfile;
}

export interface UserProfile {
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
  documents: VerificationDocuments;
  createdAt: Date;
  updatedAt: Date;
}

export interface SocialMedia {
  facebook?: string;
  instagram?: string;
  twitter?: string;
  linkedin?: string;
}

export type VerificationStatus = 'pending' | 'approved' | 'rejected';

export interface VerificationDocuments {
  cameraDocumentUrl: string;
  commerceDocumentUrl: string;
}

export interface CreateProfileRequest {
  fullName: string;
  description: string;
  location: string;
  socialMedia: SocialMedia;
  phone: string;
  email: string;
}

export interface DocumentUpload {
  cameraDocument: File;
  commerceDocument: File;
}

