# Mapa de Calor de Actividades - Segundo Sprint

## 📋 Funcionalidades Implementadas

### ✅ Visualización de Mapa de Calor
- **Mapa interactivo**: Basado en OpenStreetMap con Leaflet
- **Puntos de calor**: Círculos de diferentes tamaños según participación
- **Categorías por colores**: Eventos, Colectas, Refugios, Protestas
- **Zoom y desplazamiento**: Navegación completa del mapa
- **Datos dinámicos**: Conexión con Firebase Firestore

## 🗂️ Archivos Creados/Modificados

### Nuevos Archivos Creados:
1. **`components/heatmap-view.tsx`** - Componente principal del mapa de calor
2. **`modules/infraestructura/firebase/ActivitiesService.ts`** - Servicio para manejo de actividades en Firebase
3. **`styles/leaflet.css`** - Estilos personalizados para el mapa
4. **`HEATMAP_SETUP.md`** - Este archivo de documentación

### Archivos Modificados:
1. **`components/session-panel.tsx`** - Integrado el mapa en la página inicial y agregado botón "Mapa"
2. **`app/layout.tsx`** - Importados estilos de Leaflet
3. **`package.json`** - Agregadas dependencias de Leaflet

## 🎨 Características del Diseño

### Categorías de Colores:
- **🔵 Eventos**: Azul (#3b82f6) - Actividades y talleres
- **🟢 Colectas**: Verde (#10b981) - Recolección de recursos
- **🟡 Refugios**: Amarillo (#f59e0b) - Centros de acogida
- **🔴 Protestas**: Rojo (#ef4444) - Manifestaciones y marchas

### Funcionalidades del Mapa:
- **Zoom**: Control de zoom con botones y rueda del mouse
- **Desplazamiento**: Arrastrar para mover el mapa
- **Marcadores interactivos**: Círculos de tamaño variable según participantes
- **Popups informativos**: Detalles completos de cada actividad
- **Filtros por categoría**: Click en tarjetas para filtrar

## 🔧 Configuración Técnica

### Dependencias Instaladas:
```json
{
  "leaflet": "^1.9.4",
  "react-leaflet": "^4.2.1",
  "@types/leaflet": "^1.9.8"
}
```

### Estructura de Datos en Firebase:
```typescript
interface Activity {
  id: string;
  title: string;
  description: string;
  category: 'eventos' | 'colectas' | 'refugios' | 'protestas';
  latitude: number;
  longitude: number;
  participants: number;
  date: string;
  status: 'active' | 'completed' | 'upcoming';
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}
```

## 📍 Ubicación del Mapa

### Centro por Defecto:
- **Ciudad**: Bogotá, Colombia
- **Coordenadas**: 4.6097, -74.0817
- **Zoom inicial**: 13

### Datos de Ejemplo Incluidos:
- 6 actividades de ejemplo distribuidas en Bogotá
- Diferentes categorías y estados
- Números de participantes variables

## 🚀 Funcionalidades Implementadas

### 1. Visualización del Mapa:
- Mapa base de OpenStreetMap
- Marcadores circulares con colores por categoría
- Tamaño de círculos proporcional a participantes
- Popups con información detallada

### 2. Filtros y Controles:
- Filtro por categoría (click en tarjetas)
- Estadísticas en tiempo real
- Contador de actividades mostradas
- Leyenda explicativa

### 3. Interactividad:
- Zoom con mouse y controles
- Desplazamiento arrastrando
- Click en marcadores para detalles
- Hover effects en controles

### 4. Integración con Firebase:
- Carga automática de datos
- Fallback a datos de ejemplo
- Manejo de errores de conexión
- Servicios para CRUD de actividades

## 📱 Responsive Design

### Características:
- **Mobile**: Mapa adaptado a pantallas pequeñas
- **Tablet**: Layout optimizado para tablets
- **Desktop**: Experiencia completa con controles

### Breakpoints:
- **sm**: 640px
- **md**: 768px
- **lg**: 1024px

## 🔄 Flujo de Usuario

1. **Usuario inicia sesión** → Ve la página principal
2. **Ve el mapa de actividades** → En la sección principal
3. **Explora las actividades** → Zoom y desplazamiento
4. **Filtra por categoría** → Click en tarjetas de estadísticas
5. **Ve detalles** → Click en marcadores del mapa
6. **Navega a sección completa** → Botón "Mapa" en el menú

## ⚙️ Configuración de Firebase

### Colección: `activities`
```javascript
// Reglas de Firestore
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /activities/{document} {
      allow read: if true; // Lectura pública
      allow write: if request.auth != null; // Escritura solo autenticados
    }
  }
}
```

### Índices Requeridos:
- `category` (ascending)
- `status` (ascending)
- `createdAt` (descending)
- `latitude` (ascending)
- `longitude` (ascending)

## 🎯 Criterios de Aceptación Cumplidos

### ✅ Mapa muestra puntos de calor según nivel de actividad
- Círculos de tamaño variable según participantes
- Colores diferenciados por categoría

### ✅ Diferencia categorías por colores
- Eventos: Azul
- Colectas: Verde
- Refugios: Amarillo
- Protestas: Rojo

### ✅ Usuario puede hacer zoom y desplazarse
- Controles de zoom integrados
- Desplazamiento con mouse/touch
- Navegación fluida

### ✅ Datos provienen dinámicamente de Firebase
- Conexión con Firestore
- Carga automática de datos
- Manejo de errores

## 🔮 Próximas Mejoras

### Funcionalidades Adicionales:
- Búsqueda por ubicación
- Filtros por fecha y estado
- Clustering de marcadores
- Rutas entre actividades
- Notificaciones de actividades cercanas

### Optimizaciones:
- Carga lazy de marcadores
- Cache de datos
- Compresión de imágenes
- PWA para móviles

---

**Desarrollado para Parche Solidario - Segundo Sprint** 🗺️
