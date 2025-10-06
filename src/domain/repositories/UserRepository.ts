import { User, UserProfile, CreateProfileRequest, VerificationStatus } from '../entities/User';

export interface UserRepository {
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  create(user: Omit<User, 'id'>): Promise<User>;
  update(id: string, user: Partial<User>): Promise<User>;
  delete(id: string): Promise<void>;
}

export interface ProfileRepository {
  findByUserId(userId: string): Promise<UserProfile | null>;
  hasProfile(userId: string): Promise<boolean>;
  create(profile: Omit<UserProfile, 'id' | 'createdAt' | 'updatedAt'>): Promise<UserProfile>;
  update(userId: string, profile: Partial<UserProfile>): Promise<UserProfile>;
  updateVerificationStatus(
    userId: string,
    status: VerificationStatus,
    isVerified: boolean
  ): Promise<void>;
  findPendingVerifications(): Promise<UserProfile[]>;
}

