import { useState, useEffect } from "react";
import { RateProductGrid } from "../components/RateProductGrid"
import { LazyLoadImage } from "react-lazy-load-image-component";
import { ChevronDown } from "lucide-react";
import image_2 from "@/assets/images/image_ads2.webp";
import image_1 from "@/assets/images/image_ads1.webp";


function RateProducts(){ 
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
  }, []);
  
  return(
    <div className="w-full h-full overflow-auto bg-white bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]">
      
      <LazyLoadImage src={image_2} alt="Evento" />
      <RateProductGrid/>
      
      <LazyLoadImage src={image_1} alt="Evento" />

      {/* Scroll Indicator */}
      {showScrollIndicator && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="bg-slate-200/40  px-3 py-3 rounded-lg  flex flex-col items-center">
            <div className="relative h-4 w-6 flex flex-col items-center justify-center">
              
              <ChevronDown
                className="w-5 h-5 text-red-600 absolute cascade-arrow-1"
                strokeWidth={2.5}
              />

              
              <ChevronDown
                className="w-5 h-5 text-red-500 absolute cascade-arrow-2"
                strokeWidth={2.5}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default RateProducts