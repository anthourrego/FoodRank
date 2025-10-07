import { useEffect, useState } from "react";

export const useCheckIsMobile = () => {
  const [showScrollIndicator, setShowScrollIndicator] = useState(false);

  useEffect(() => {
    // Verificar si el dispositivo es móvil
    const isMobile = window.innerWidth <= 768;

    if (!isMobile) {
      setShowScrollIndicator(false);
      return;
    }

    const checkScrollPosition = () => {
      const scrollTop =
        window.pageYOffset || document.documentElement.scrollTop;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;

      // Mostrar indicador si hay contenido debajo
      const hasContentBelow = scrollTop + windowHeight < documentHeight - 100;

      setShowScrollIndicator(isMobile && hasContentBelow);
    };

    // Ejecutar inmediatamente
    checkScrollPosition();

    // Ejecutar después de un pequeño delay para asegurar que el contenido esté renderizado
    const timeoutId = setTimeout(() => {
      checkScrollPosition();
    }, 100);

    // También ejecutar después de que las imágenes se carguen
    const imageLoadTimeout = setTimeout(() => {
      checkScrollPosition();
    }, 500);

    window.addEventListener("scroll", checkScrollPosition);
    window.addEventListener("resize", checkScrollPosition);
    window.addEventListener("load", checkScrollPosition);

    return () => {
      clearTimeout(timeoutId);
      clearTimeout(imageLoadTimeout);
      window.removeEventListener("scroll", checkScrollPosition);
      window.removeEventListener("resize", checkScrollPosition);
      window.removeEventListener("load", checkScrollPosition);
    };
  }, [])

  return {
    showScrollIndicator,
  }

}