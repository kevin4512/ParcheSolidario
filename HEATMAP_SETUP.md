# Mapa de Calor - Configuración y Uso

## ✅ Funcionalidad Implementada

El mapa de calor está completamente implementado con las siguientes características:

### 🎯 **Características Principales**

#### 1. **Geolocalización Automática**
- ✅ Solicita permisos de ubicación al usuario
- ✅ Centra el mapa en la ubicación del usuario
- ✅ Marcador especial para la ubicación del usuario
- ✅ Opción para solicitar ubicación nuevamente
- ✅ Fallback a ubicación por defecto (Medellín)

#### 2. **Visualización de Actividades**
- ✅ **4 Categorías con colores diferenciados:**
  - 🔵 **Eventos** (Azul)
  - 🟢 **Colectas** (Verde) 
  - 🟡 **Refugios** (Amarillo/Naranja)
  - 🔴 **Protestas** (Rojo)
- ✅ Círculos de calor que varían según número de participantes
- ✅ Popups informativos con detalles de cada actividad
- ✅ Filtrado por categoría con clic en las tarjetas

#### 3. **Interactividad del Mapa**
- ✅ Zoom y desplazamiento libre
- ✅ Marcadores interactivos
- ✅ Información detallada en popups
- ✅ Leyenda explicativa
- ✅ Contador de actividades mostradas

#### 4. **Integración con Firebase**
- ✅ Carga dinámica de datos desde Firestore
- ✅ Fallback a datos de ejemplo si hay error
- ✅ Formulario para agregar nuevas actividades
- ✅ Validación de datos

### 🔧 **Archivos Creados/Modificados**

#### Nuevos Archivos:
- `hooks/useGeolocation.ts` - Hook para manejar geolocalización
- `components/location-permission.tsx` - Modal de permisos de ubicación
- `components/add-activity-form.tsx` - Formulario para agregar actividades

#### Archivos Modificados:
- `components/heatmap-view.tsx` - Integración con geolocalización
- `components/session-panel.tsx` - Agregado formulario de actividades

### 🚀 **Cómo Usar**

#### Para Usuarios:
1. **Primera vez**: El sistema solicitará permisos de ubicación
2. **Permitir ubicación**: El mapa se centrará en tu zona
3. **Denegar ubicación**: El mapa usará ubicación por defecto (Medellín)
4. **Filtrar actividades**: Haz clic en las tarjetas de categoría
5. **Ver detalles**: Haz clic en los círculos del mapa

#### Para Administradores:
1. Ve a la sección "Mapa" en el panel de usuario
2. Usa el formulario "Agregar Nueva Actividad" al final
3. Completa los datos de la actividad
4. La actividad aparecerá inmediatamente en el mapa

### 📍 **Configuración de Ubicaciones**

#### Coordenadas por Defecto:
- **Medellín**: 6.2442, -75.5812
- **Zoom por defecto**: 13
- **Zoom con ubicación del usuario**: 15

#### Ejemplos de Coordenadas para Pruebas:
```javascript
// Medellín - Centro
{ latitude: 6.2442, longitude: -75.5812 }

// Medellín - El Poblado
{ latitude: 6.2000, longitude: -75.5700 }

// Medellín - Laureles
{ latitude: 6.2300, longitude: -75.5900 }

// Medellín - Comuna 13
{ latitude: 6.2500, longitude: -75.5700 }

// Medellín - Belén
{ latitude: 6.2600, longitude: -75.5600 }
```

### 🎨 **Personalización de Colores**

Los colores de las categorías se pueden modificar en `heatmap-view.tsx`:

```javascript
const categoryConfig = {
  eventos: { color: '#3b82f6' }, // Azul
  colectas: { color: '#10b981' }, // Verde
  refugios: { color: '#f59e0b' }, // Amarillo
  protestas: { color: '#ef4444' }  // Rojo
}
```

### 🔒 **Privacidad y Seguridad**

- ✅ La ubicación del usuario se usa solo localmente
- ✅ No se almacena la ubicación en la base de datos
- ✅ El usuario puede denegar permisos sin problemas
- ✅ Opción para solicitar ubicación nuevamente

### 📱 **Responsive Design**

- ✅ Funciona en dispositivos móviles
- ✅ Touch-friendly para zoom y desplazamiento
- ✅ Popups adaptados a pantallas pequeñas
- ✅ Botones de control accesibles

### 🐛 **Solución de Problemas**

#### Si el mapa no carga:
1. Verifica que Leaflet esté instalado: `npm install leaflet react-leaflet`
2. Revisa la consola del navegador para errores
3. Asegúrate de que Firebase esté configurado correctamente

#### Si la geolocalización no funciona:
1. Verifica que el navegador soporte geolocalización
2. Asegúrate de que el usuario haya dado permisos
3. Revisa que la conexión GPS esté activa

#### Si las actividades no aparecen:
1. Verifica la conexión a Firebase
2. Revisa las reglas de Firestore
3. Comprueba que la colección 'activities' exista

### 🎉 **¡Listo para Usar!**

El mapa de calor está completamente funcional y listo para mostrar actividades reales. Solo necesitas:

1. **Agregar actividades** usando el formulario
2. **Configurar Firebase** con las reglas apropiadas
3. **Personalizar** los colores y estilos según necesites

¡El segundo sprint del mapa de calor está completo! 🗺️✨