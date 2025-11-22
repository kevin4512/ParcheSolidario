import { useState, useEffect } from 'react';
import { UserService } from '../../application/services/UserService';
import { UserProfileResponseDto } from '../../application/dto/UserDto';
import { container } from '../../infrastructure/di/Container';

export function useAdminVerification() {
  const [pendingVerifications, setPendingVerifications] = useState<UserProfileResponseDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const userService = container.getUserService();

  const loadPendingVerifications = async () => {
    setLoading(true);
    setError(null);
    try {
      const verifications = await userService.getPendingVerifications();
      setPendingVerifications(verifications);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar verificaciones pendientes');
    } finally {
      setLoading(false);
    }
  };

  const verifyProfile = async (userId: string, status: 'approved' | 'rejected') => {
    setLoading(true);
    setError(null);
    try {
      const updatedProfile = await userService.verifyProfile(userId, status);
      setPendingVerifications(prev => 
        prev.filter(profile => profile.userId !== userId)
      );
      return updatedProfile;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al verificar perfil');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    pendingVerifications,
    loading,
    error,
    loadPendingVerifications,
    verifyProfile,
  };
}

