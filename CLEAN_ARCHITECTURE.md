# Clean Architecture - ParcheSolidario

## 📋 Resumen

Este documento describe la implementación de Clean Architecture en el proyecto ParcheSolidario, una aplicación Next.js para gestión de actividades solidarias.

## 🏗️ Estructura de la Arquitectura

```
src/
├── domain/                    # Reglas de negocio puras
│   ├── entities/             # Entidades del dominio
│   │   ├── Activity.ts
│   │   └── User.ts
│   ├── use-cases/           # Casos de uso
│   │   ├── activities/
│   │   └── users/
│   └── repositories/        # Interfaces de repositorios
│       ├── ActivityRepository.ts
│       └── UserRepository.ts
├── application/             # Lógica de aplicación
│   ├── services/           # Servicios de aplicación
│   │   ├── ActivityService.ts
│   │   └── UserService.ts
│   └── dto/               # Data Transfer Objects
│       ├── ActivityDto.ts
│       └── UserDto.ts
├── infrastructure/         # Implementaciones concretas
│   ├── repositories/      # Implementaciones de repositorios
│   │   ├── FirebaseActivityRepository.ts
│   │   └── FirebaseProfileRepository.ts
│   ├── external/         # Servicios externos
│   │   ├── FirebaseStorageService.ts
│   │   └── EmailService.ts
│   └── di/              # Inyección de dependencias
│       └── Container.ts
└── presentation/        # Capa de presentación
    ├── hooks/          # Custom hooks
    │   ├── useActivities.ts
    │   ├── useUserProfile.ts
    │   └── useAdminVerification.ts
    └── components/     # Componentes React (existentes)
```

## 🎯 Principios Aplicados

### 1. **Inversión de Dependencias**
- Las capas internas no dependen de las externas
- Las interfaces están en el dominio, las implementaciones en infraestructura

### 2. **Separación de Responsabilidades**
- **Domain**: Reglas de negocio puras
- **Application**: Orquestación de casos de uso
- **Infrastructure**: Implementaciones técnicas
- **Presentation**: Interfaz de usuario

### 3. **Testabilidad**
- Cada capa puede ser probada independientemente
- Fácil mockeo de dependencias

## 🔧 Componentes Principales

### Domain Layer
- **Entidades**: `Activity`, `User` - Representan conceptos del negocio
- **Casos de Uso**: Lógica de negocio específica (CreateActivity, GetUserProfile, etc.)
- **Repositorios**: Interfaces que definen contratos de acceso a datos

### Application Layer
- **Servicios**: Orquestan casos de uso y manejan DTOs
- **DTOs**: Objetos de transferencia de datos con mappers

### Infrastructure Layer
- **Repositorios**: Implementaciones concretas (Firebase)
- **Servicios Externos**: Storage, Email, etc.
- **Container**: Inyección de dependencias

### Presentation Layer
- **Hooks**: Lógica de estado y efectos
- **Componentes**: UI pura (React)

## 🚀 Beneficios Obtenidos

1. **Mantenibilidad**: Código más organizado y fácil de mantener
2. **Escalabilidad**: Fácil agregar nuevas funcionalidades
3. **Testabilidad**: Cada capa puede ser probada independientemente
4. **Flexibilidad**: Fácil cambiar implementaciones (ej: Firebase → PostgreSQL)
5. **Reutilización**: Casos de uso pueden ser reutilizados

## 📝 Ejemplo de Uso

```typescript
// En un componente React
import { useActivities } from '@/src/presentation/hooks/useActivities';

function MyComponent() {
  const { activities, createActivity, loading } = useActivities();
  
  const handleCreate = async (data) => {
    await createActivity(data, userId);
  };
  
  return (
    // JSX del componente
  );
}
```

## 🔄 Flujo de Datos

1. **Componente** → Hook → Servicio de Aplicación
2. **Servicio** → Caso de Uso → Repositorio
3. **Repositorio** → Firebase/API Externa
4. **Respuesta** → DTO → Entidad → Componente

## 🛠️ Próximos Pasos

1. Migrar componentes restantes a la nueva arquitectura
2. Implementar tests unitarios para cada capa
3. Agregar validaciones adicionales en el dominio
4. Implementar logging y monitoreo
5. Optimizar rendimiento con caching

## 📚 Referencias

- [Clean Architecture by Robert C. Martin](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [SOLID Principles](https://en.wikipedia.org/wiki/SOLID)
- [Dependency Injection](https://en.wikipedia.org/wiki/Dependency_injection)

