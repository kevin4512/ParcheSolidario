"use client"

import { useState, useEffect } from "react";

interface GeolocationState {
  latitude: number | null;
  longitude: number | null;
  accuracy: number | null;
  error: string | null;
  loading: boolean;
}

interface GeolocationOptions {
  enableHighAccuracy?: boolean;
  timeout?: number;
  maximumAge?: number;
}

export function useGeolocation(options: GeolocationOptions = {}) {
  const [state, setState] = useState<GeolocationState>({
    latitude: null,
    longitude: null,
    accuracy: null,
    error: null,
    loading: false // Cambiado a false para que no se ejecute automáticamente
  });

  const defaultOptions: GeolocationOptions = {
    enableHighAccuracy: true,
    timeout: 15000, // Aumentado a 15 segundos
    maximumAge: 300000, // 5 minutos
    ...options
  };

  const requestLocation = () => {
    console.log("Solicitando ubicación...");
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    if (!navigator.geolocation) {
      console.log("Geolocalización no soportada");
      setState(prev => ({
        ...prev,
        error: "Geolocalización no soportada por este navegador",
        loading: false
      }));
      return;
    }

    const success = (position: GeolocationPosition) => {
      console.log("Ubicación obtenida exitosamente:", {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        accuracy: position.coords.accuracy
      });
      setState({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        accuracy: position.coords.accuracy,
        error: null,
        loading: false
      });
    };

    const error = (error: GeolocationPositionError) => {
      console.log("Error al obtener ubicación:", error);
      let errorMessage = "Error desconocido al obtener la ubicación";
      
      switch (error.code) {
        case error.PERMISSION_DENIED:
          errorMessage = "Permisos de ubicación denegados. Por favor, permite el acceso a tu ubicación.";
          break;
        case error.POSITION_UNAVAILABLE:
          errorMessage = "Ubicación no disponible. Verifica tu conexión GPS.";
          break;
        case error.TIMEOUT:
          errorMessage = "Tiempo de espera agotado. Intenta nuevamente.";
          break;
      }

      setState(prev => ({
        ...prev,
        error: errorMessage,
        loading: false
      }));
    };

    console.log("Llamando a getCurrentPosition con opciones:", defaultOptions);
    navigator.geolocation.getCurrentPosition(success, error, defaultOptions);
  };

  return {
    ...state,
    requestLocation,
    hasLocation: state.latitude !== null && state.longitude !== null
  };
}
