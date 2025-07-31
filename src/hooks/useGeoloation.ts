import { useState, useEffect } from 'react';

const useGeolocation = (options = {}) => {
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [error, setError] = useState<string|null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verificar si el navegador soporta la API de Geolocation
    if (!navigator.geolocation) {
      setError("Tu navegador no soporta la Geolocation API.");
      setLoading(false);
      return;
    }

    // Opciones por defecto para alta precisión, con posibilidad de sobrescribir
    const defaultOptions = {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0,
    };

    const mergedOptions = { ...defaultOptions, ...options };

    const successHandler = (position) => {
      setLatitude(position.coords.latitude);
      setLongitude(position.coords.longitude);
      setLoading(false);
      setError(null); // Limpiar cualquier error previo si la ubicación se obtiene correctamente
    };

    const errorHandler = (err) => {
      let errorMessage = "Un error desconocido ha ocurrido.";
      switch (err.code) {
        case err.PERMISSION_DENIED:
          errorMessage = "Permiso denegado: El usuario denegó la solicitud de geolocalización.";
          break;
        case err.POSITION_UNAVAILABLE:
          errorMessage = "Información de ubicación no disponible.";
          break;
        case err.TIMEOUT:
          errorMessage = "La solicitud de obtener ubicación ha caducado.";
          break;
      }
      setError(errorMessage);
      setLoading(false);
      setLatitude(null); // Limpiar la latitud y longitud en caso de error
      setLongitude(null);
    };

    // Obtener la ubicación actual
    navigator.geolocation.getCurrentPosition(successHandler, errorHandler, mergedOptions);

    // Si necesitaras monitorear la ubicación constantemente, podrías agregar:
    // const watchId = navigator.geolocation.watchPosition(successHandler, errorHandler, mergedOptions);
    // return () => navigator.geolocation.clearWatch(watchId); // Limpiar el "watcher" al desmontar el componente

  }, [options]); // Dependencia 'options' para que el hook reaccione a cambios en las opciones

  return { latitude, longitude, error, loading };
};

export default useGeolocation;