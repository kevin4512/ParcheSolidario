// Exportaciones principales de la aplicación
export * from './domain/entities/Activity';
export * from './domain/entities/User';
export * from './domain/repositories/ActivityRepository';
export * from './domain/repositories/UserRepository';

export * from './application/dto/ActivityDto';
export * from './application/dto/UserDto';
export * from './application/services/ActivityService';
export * from './application/services/UserService';

export * from './infrastructure/di/Container';

export * from './presentation/hooks/useActivities';
export * from './presentation/hooks/useUserProfile';
export * from './presentation/hooks/useAdminVerification';

