import { useState, useEffect } from 'react';
import { UserService } from '../../application/services/UserService';
import { UserProfileResponseDto, CreateProfileDto, DocumentUploadDto } from '../../application/dto/UserDto';
import { container } from '../../infrastructure/di/Container';

export function useUserProfile() {
  const [profile, setProfile] = useState<UserProfileResponseDto | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const userService = container.getUserService();

  const loadProfile = async (userId: string) => {
    setLoading(true);
    setError(null);
    try {
      const profileData = await userService.getUserProfile(userId);
      setProfile(profileData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar perfil');
    } finally {
      setLoading(false);
    }
  };

  const createProfile = async (
    userId: string,
    profileData: CreateProfileDto,
    documents: DocumentUploadDto
  ) => {
    setLoading(true);
    setError(null);
    try {
      const newProfile = await userService.createProfile(userId, profileData, documents);
      setProfile(newProfile);
      return newProfile;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear perfil');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const checkVerificationStatus = async (userId: string): Promise<boolean> => {
    try {
      return await userService.isUserVerified(userId);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al verificar estado');
      return false;
    }
  };

  return {
    profile,
    loading,
    error,
    loadProfile,
    createProfile,
    checkVerificationStatus,
  };
}

